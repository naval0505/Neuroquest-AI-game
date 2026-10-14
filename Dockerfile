# ==========================================
# Multi-stage Dockerfile for NeuroQuest
# Optimized, secure, lightweight (~25MB)
# ==========================================

# Stage 1: Build the React TypeScript application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install dependencies (clean install)
RUN npm ci

# Copy source code and configuration files
COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ ./src/
COPY public/ ./public/

# Build static production assets
RUN npm run build

# ==========================================
# Stage 2: Serve production assets via Nginx
# ==========================================
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

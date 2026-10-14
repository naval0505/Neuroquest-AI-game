import { UserProgress } from '../types';

const STORAGE_KEY = 'neuroquest_ai_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  rank: 'Neural Initiate',
  completedQuests: {},
  badges: [],
  soundEnabled: true,
  activeSector: 'taxonomy',
  owaspCompleted: {},
};

export const RANKS = [
  { threshold: 0, rank: 'Neural Initiate' },
  { threshold: 250, rank: 'Perceptron Tinkerer' },
  { threshold: 600, rank: 'Gradient Alchemist' },
  { threshold: 1200, rank: 'Transformer Architect' },
  { threshold: 2000, rank: 'OWASP Sentinel Commander' },
];

export function getRankForXP(xp: number): string {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].threshold) {
      return RANKS[i].rank;
    }
  }
  return 'Neural Initiate';
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage', err);
  }
}

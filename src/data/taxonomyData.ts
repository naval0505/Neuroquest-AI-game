export interface TaxonomyItem {
  id: string;
  name: string;
  description: string;
  correctCategory: 'symbolic' | 'ml' | 'dl' | 'llm';
  explanation: string;
  hints: string;
}

export const TAXONOMY_CATEGORIES = [
  {
    id: 'symbolic',
    name: 'Symbolic / Rule-Based AI',
    shortCode: 'AI (Rules)',
    color: 'border-amber-500/50 bg-amber-950/20 text-amber-400',
    description: 'Expert systems, logic trees, search heuristics (A*, Minimax). Hand-coded IF/THEN rules, NO statistical learning from data.'
  },
  {
    id: 'ml',
    name: 'Traditional Machine Learning',
    shortCode: 'ML',
    color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400',
    description: 'Statistical algorithms (Linear Regression, Random Forests, SVM, Naive Bayes) that learn patterns from structured feature tables.'
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    shortCode: 'DL',
    color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-400',
    description: 'Multi-layered neural networks (CNNs, RNNs, Autoencoders) capable of automatic feature extraction from unstructured data (images, audio).'
  },
  {
    id: 'llm',
    name: 'Generative AI / LLMs',
    shortCode: 'LLM & GenAI',
    color: 'border-purple-500/50 bg-purple-950/20 text-purple-400',
    description: 'Massive scale Transformer foundation models trained on billions of tokens to predict next tokens and synthesize novel text, code, or images.'
  }
];

export const TAXONOMY_ITEMS: TaxonomyItem[] = [
  {
    id: 'chess_deepblue',
    name: 'Deep Blue (1997 Chess System)',
    description: 'Evaluated 200 million chess board positions per second using alpha-beta minimax search tree and human grandmaster opening books.',
    correctCategory: 'symbolic',
    explanation: 'Deep Blue was an expert search and rule-based system. It did not use neural networks or learn from self-play (unlike AlphaZero decades later).',
    hints: 'Does it learn its own weights from training data, or does it search hand-coded heuristic evaluations?'
  },
  {
    id: 'credit_card_fraud',
    name: 'Credit Card Fraud Random Forest',
    description: 'A model trained on tabular transaction logs (amount, country, merchant) with 500 decision trees to flag suspicious transactions.',
    correctCategory: 'ml',
    explanation: 'Random Forests are classical ensemble machine learning algorithms operating on tabular hand-engineered features.',
    hints: 'This is an ensemble of decision trees operating on structured tabular data.'
  },
  {
    id: 'tumor_cnn',
    name: 'ResNet CT-Scan Tumor Detector',
    description: 'A 50-layer Convolutional Neural Network analyzing 2D/3D radiology pixel slices to localize malignant lesions.',
    correctCategory: 'dl',
    explanation: 'Convolutional Neural Networks (CNNs) with dozens of hidden layers that learn pixel kernels directly are deep learning.',
    hints: 'Pixel-level automatic feature learning across deep convolutional layers.'
  },
  {
    id: 'chatgpt_assistant',
    name: 'GPT-4 Code Assistant',
    description: 'A multi-billion parameter autoregressive Transformer trained on web-scale text and fine-tuned with RLHF to write programs.',
    correctCategory: 'llm',
    explanation: 'GPT-4 is a frontier Large Language Model utilizing multi-head self-attention and next-token prediction at planetary scale.',
    hints: 'A huge Transformer model generating coherent text and software.'
  },
  {
    id: 'spam_filter_nb',
    name: 'Email Spam Filter (Naive Bayes)',
    description: 'Calculates the probability P(Spam | Words) using Bayes theorem based on word frequency counts in previous emails.',
    correctCategory: 'ml',
    explanation: 'Naive Bayes is a foundational statistical machine learning classifier based on conditional probability.',
    hints: 'Uses Bayes theorem and frequency histograms rather than deep neural connections.'
  },
  {
    id: 'thermostat_logic',
    name: 'Smart Thermostat Logic Engine',
    description: 'Controls climate heating using a state machine: IF temp < 18°C AND time between 06:00-22:00 THEN activate heater.',
    correctCategory: 'symbolic',
    explanation: 'Pure deterministic conditional logic (expert rule system) with zero statistical learning.',
    hints: 'Hard-coded IF-ELSE business rules.'
  },
  {
    id: 'stable_diffusion',
    name: 'Stable Diffusion 3',
    description: 'A latent diffusion model that iteratively removes Gaussian noise guided by text embeddings to generate photorealistic art.',
    correctCategory: 'llm',
    explanation: 'Diffusion models and multimodal generative foundation models belong to the Generative AI revolution.',
    hints: 'Generates new high-resolution images from text prompts.'
  },
  {
    id: 'whisper_audio',
    name: 'Whisper Speech-to-Text',
    description: 'An encoder-decoder deep neural network processing log-Mel spectrogram audio frames to output multilingual transcripts.',
    correctCategory: 'dl',
    explanation: 'Deep sequence-to-sequence neural network learning representations directly from raw audio frequencies.',
    hints: 'Deep neural layers transforming spectrogram waves into phonetic tokens.'
  }
];

export const TAXONOMY_COMPARISON = [
  {
    dimension: 'Core Mechanism',
    symbolic: 'Logic rules, graph search, ontological trees',
    ml: 'Statistical equations, decision boundaries, cost minimization',
    dl: 'Multi-layer artificial neural networks with backprop',
    llm: 'Massive scale self-attention Transformers with RLHF'
  },
  {
    dimension: 'Feature Engineering',
    symbolic: 'Manual human-defined logic',
    ml: 'Manual human feature extraction (e.g. TF-IDF, histograms)',
    dl: 'Automatic hierarchical representation learning',
    llm: 'Zero/Few-shot task generalization across all modalities'
  },
  {
    dimension: 'Data Requirement',
    symbolic: 'Zero data (needs human expert knowledge)',
    ml: 'Moderate (hundreds to tens of thousands of rows)',
    dl: 'High (millions of images, audio clips, vectors)',
    llm: 'Massive (trillions of web tokens, thousands of GPUs)'
  },
  {
    dimension: 'Interpretability',
    symbolic: '100% white box & auditable logic trace',
    ml: 'Moderate (feature importances, coefficients)',
    dl: 'Black box (millions of matrix weights)',
    llm: 'Black box / Emergent reasoning & hallucination risks'
  }
];

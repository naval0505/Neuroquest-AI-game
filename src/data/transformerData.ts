export interface WordVector {
  word: string;
  category: string;
  coords: [number, number]; // 2D projection for visualization
  attributes: {
    royalty: number;
    gender: number; // positive = female, negative = male
    tech: number;
    nature: number;
  };
}

export const EMBEDDING_POINTS: WordVector[] = [
  { word: 'King', category: 'Royalty', coords: [0.75, -0.7], attributes: { royalty: 0.95, gender: -0.9, tech: 0.05, nature: 0.1 } },
  { word: 'Queen', category: 'Royalty', coords: [0.78, 0.75], attributes: { royalty: 0.98, gender: 0.95, tech: 0.05, nature: 0.1 } },
  { word: 'Man', category: 'People', coords: [0.15, -0.8], attributes: { royalty: 0.05, gender: -0.95, tech: 0.2, nature: 0.2 } },
  { word: 'Woman', category: 'People', coords: [0.18, 0.8], attributes: { royalty: 0.05, gender: 0.95, tech: 0.2, nature: 0.2 } },
  { word: 'Prince', category: 'Royalty', coords: [0.65, -0.6], attributes: { royalty: 0.85, gender: -0.8, tech: 0.1, nature: 0.1 } },
  { word: 'Princess', category: 'Royalty', coords: [0.68, 0.65], attributes: { royalty: 0.88, gender: 0.85, tech: 0.1, nature: 0.1 } },
  { word: 'Computer', category: 'Tech', coords: [-0.7, 0.05], attributes: { royalty: 0.0, gender: 0.0, tech: 0.98, nature: 0.05 } },
  { word: 'Algorithm', category: 'Tech', coords: [-0.85, 0.2], attributes: { royalty: 0.0, gender: 0.0, tech: 0.95, nature: 0.02 } },
  { word: 'Neural', category: 'Tech', coords: [-0.65, -0.2], attributes: { royalty: 0.0, gender: 0.0, tech: 0.92, nature: 0.3 } },
  { word: 'Forest', category: 'Nature', coords: [-0.1, -0.85], attributes: { royalty: 0.0, gender: 0.0, tech: 0.02, nature: 0.95 } },
  { word: 'River', category: 'Nature', coords: [-0.15, -0.65], attributes: { royalty: 0.0, gender: 0.0, tech: 0.01, nature: 0.92 } }
];

export interface AttentionSentence {
  id: string;
  sentence: string;
  tokens: string[];
  focusTokenIndex: number;
  attentionWeights: number[];
  insight: string;
}

export const SAMPLE_ATTENTION_SENTENCES: AttentionSentence[] = [
  {
    id: 'tired_animal',
    sentence: 'The animal did not cross the street because it was too tired.',
    tokens: ['The', 'animal', 'did', 'not', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'],
    focusTokenIndex: 8, // "it"
    attentionWeights: [0.02, 0.72, 0.01, 0.01, 0.03, 0.02, 0.04, 0.02, 0.01, 0.02, 0.02, 0.08],
    insight: 'Notice how the pronoun "it" attends 72% directly to "animal" because of the adjective "tired"! Self-attention resolves the coreference effortlessly.'
  },
  {
    id: 'wide_street',
    sentence: 'The animal did not cross the street because it was too wide.',
    tokens: ['The', 'animal', 'did', 'not', 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'wide'],
    focusTokenIndex: 8, // "it"
    attentionWeights: [0.02, 0.05, 0.01, 0.01, 0.04, 0.02, 0.69, 0.02, 0.01, 0.02, 0.02, 0.09],
    insight: 'By just changing "tired" to "wide", "it" now attends 69% to "street"! The Transformer learned spatial relationships and physical affordances.'
  },
  {
    id: 'bank_money',
    sentence: 'The bank approved the loan quickly.',
    tokens: ['The', 'bank', 'approved', 'the', 'loan', 'quickly'],
    focusTokenIndex: 1, // "bank"
    attentionWeights: [0.03, 0.10, 0.35, 0.02, 0.45, 0.05],
    insight: '"bank" heavily attends to "approved" (35%) and "loan" (45%), disambiguating it as a financial institution rather than a river bank.'
  }
];

export const SAMPLING_PARAMETERS = [
  {
    name: 'Temperature (T)',
    formula: 'P(w_i) = \\frac{e^{z_i / T}}{\\sum e^{z_j / T}}',
    description: 'Scales the raw logits before softmax. T < 0.3 creates rigid deterministic answers. T = 0.7 is balanced. T > 1.2 induces wild hallucination.',
    icon: 'Thermometer'
  },
  {
    name: 'Top-K Sampling',
    formula: '\\text{Filter top } K \\text{ tokens}',
    description: 'Discards all tokens outside the top K highest probabilities, clipping the long tail of bizarre words.',
    icon: 'Filter'
  },
  {
    name: 'Top-P (Nucleus Sampling)',
    formula: '\\sum_{i=1}^{k} P(w_i) \\ge P',
    description: 'Dynamically selects the smallest set of words whose cumulative probability exceeds threshold P (usually 0.9), flexing pool size with model confidence.',
    icon: 'Layers'
  }
];

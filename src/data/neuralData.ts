export interface ActivationFunctionInfo {
  id: string;
  name: string;
  formula: string;
  range: string;
  derivative: string;
  pros: string;
  cons: string;
  bestUsedFor: string;
  calc: (x: number) => number;
}

export const ACTIVATION_FUNCTIONS: ActivationFunctionInfo[] = [
  {
    id: 'step',
    name: 'Step Function (Heaviside)',
    formula: 'f(z) = 1 if z >= 0 else 0',
    range: '{0, 1}',
    derivative: 'f\'(z) = 0 (undefined at z=0)',
    pros: 'Simple binary decision boundary for original 1958 Perceptron.',
    cons: 'Derivative is zero everywhere! Gradient descent cannot learn because gradient = 0.',
    bestUsedFor: 'Historical perceptrons only; never in modern backpropagation.',
    calc: (x: number) => (x >= 0 ? 1 : 0)
  },
  {
    id: 'sigmoid',
    name: 'Sigmoid / Logistic',
    formula: 'f(z) = 1 / (1 + e^(-z))',
    range: '(0, 1)',
    derivative: 'f\'(z) = f(z) * (1 - f(z))',
    pros: 'Smooth differentiable S-curve, maps real values into valid probabilities.',
    cons: 'Vanishing gradient problem: for |z| > 4, gradient becomes nearly zero, freezing deep layers.',
    bestUsedFor: 'Binary classification output layers.',
    calc: (x: number) => 1 / (1 + Math.exp(-Math.max(-10, Math.min(10, x))))
  },
  {
    id: 'tanh',
    name: 'Hyperbolic Tangent (Tanh)',
    formula: 'f(z) = (e^z - e^(-z)) / (e^z + e^(-z))',
    range: '(-1, 1)',
    derivative: 'f\'(z) = 1 - f(z)^2',
    pros: 'Zero-centered outputs, accelerating optimization convergence compared to sigmoid.',
    cons: 'Still suffers from vanishing gradient when saturated at extremes.',
    bestUsedFor: 'Recurrent Neural Networks (RNNs) and hidden states.',
    calc: (x: number) => Math.tanh(Math.max(-10, Math.min(10, x)))
  },
  {
    id: 'relu',
    name: 'Rectified Linear Unit (ReLU)',
    formula: 'f(z) = max(0, z)',
    range: '[0, ∞)',
    derivative: 'f\'(z) = 1 if z > 0 else 0',
    pros: 'Computationally cheap (just max), solves vanishing gradient for positive signals, sparse activations.',
    cons: 'Dying ReLU problem: neurons with negative inputs can permanently output 0 and never recover.',
    bestUsedFor: 'Standard default for hidden layers in modern deep learning and CNNs.',
    calc: (x: number) => Math.max(0, x)
  },
  {
    id: 'leaky_relu',
    name: 'Leaky ReLU',
    formula: 'f(z) = max(0.01 * z, z)',
    range: '(-∞, ∞)',
    derivative: 'f\'(z) = 1 if z > 0 else 0.01',
    pros: 'Prevents "dying ReLU" by allowing a tiny non-zero gradient for negative values.',
    cons: 'Hyperparameter alpha must be tuned or kept fixed.',
    bestUsedFor: 'Generative Adversarial Networks (GANs) and deep feedforward networks.',
    calc: (x: number) => (x > 0 ? x : 0.05 * x)
  }
];

export interface LogicGateData {
  gate: 'AND' | 'OR' | 'XOR';
  description: string;
  isLinearlySeparable: boolean;
  truthTable: { x1: number; x2: number; y: number }[];
  explanation: string;
}

export const LOGIC_GATES: LogicGateData[] = [
  {
    gate: 'AND',
    description: 'Outputs 1 ONLY when both inputs are 1. Can a single straight line separate 1s from 0s? YES!',
    isLinearlySeparable: true,
    truthTable: [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 0 },
      { x1: 1, x2: 0, y: 0 },
      { x1: 1, x2: 1, y: 1 }
    ],
    explanation: 'A line like w1=1.0, w2=1.0, bias=-1.5 separates (1,1) from the rest cleanly.'
  },
  {
    gate: 'OR',
    description: 'Outputs 1 if either input is 1. Can a single line separate 1s from 0s? YES!',
    isLinearlySeparable: true,
    truthTable: [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 1 },
      { x1: 1, x2: 0, y: 1 },
      { x1: 1, x2: 1, y: 1 }
    ],
    explanation: 'A line like w1=1.0, w2=1.0, bias=-0.5 easily isolates (0,0) from the other three points.'
  },
  {
    gate: 'XOR',
    description: 'Exclusive OR: Outputs 1 if exactly one input is 1. Cannot be separated by ONE straight line!',
    isLinearlySeparable: false,
    truthTable: [
      { x1: 0, x2: 0, y: 0 },
      { x1: 0, x2: 1, y: 1 },
      { x1: 1, x2: 0, y: 1 },
      { x1: 1, x2: 1, y: 0 }
    ],
    explanation: 'The famous 1969 Minsky-Papert problem! (0,1) and (1,0) are diagonally opposite. No single 2D plane line can separate them. This sparked the first "AI Winter" until Multilayer Perceptrons (MLPs) with hidden layers arrived!'
  }
];

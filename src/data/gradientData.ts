export interface GradientConcept {
  id: string;
  title: string;
  math: string;
  analogy: string;
  explanation: string;
  takeaway: string;
}

export const GRADIENT_CONCEPTS: GradientConcept[] = [
  {
    id: 'loss_function',
    title: 'The Loss Function (Cost Landscape)',
    math: 'J(w, b) = \\frac{1}{2m} \\sum_{i=1}^{m} (\\hat{y}^{(i)} - y^{(i)})^2',
    analogy: 'Imagine standing blindfolded on a foggy mountain ridge. Your goal is to reach the lowest valley floor (Zero Loss).',
    explanation: 'The loss function quantifies how wrong your model predictions are compared to ground truth labels. Gradient descent guides the model down the slope.',
    takeaway: 'Lower loss = better model fit. Zero loss on training data might mean dangerous overfitting!'
  },
  {
    id: 'gradient_vector',
    title: 'The Gradient Vector (Direction of Ascent)',
    math: '\\nabla J(\\theta) = \\left[ \\frac{\\partial J}{\\partial w_1}, \\frac{\\partial J}{\\partial w_2}, \\dots, \\frac{\\partial J}{\\partial b} \\right]^T',
    analogy: 'Feeling the steepness under your boots. The gradient points UP the hill; taking the negative (-∇J) steps directly DOWN.',
    explanation: 'A multivariable calculus vector containing partial derivatives with respect to each parameter. It shows the direction of maximum rate of increase.',
    takeaway: 'We subtract the gradient because we want to minimize loss, not maximize it.'
  },
  {
    id: 'learning_rate',
    title: 'Learning Rate (Step Size α)',
    math: '\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)',
    analogy: 'How large your footsteps are. Baby steps take forever; giant leaps cause you to jump right over the valley and fly off the cliff!',
    explanation: 'The most important hyperparameter in deep learning. If α is too small, training crawls. If α is too large, the loss explodes to infinity.',
    takeaway: 'Modern optimizers like Adam dynamically scale α for each individual parameter.'
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation (The Chain Rule)',
    math: '\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}',
    analogy: 'Tracing a rumor backwards through a line of people to find who started the mistake and by how much.',
    explanation: 'Efficient algorithm allowing gradients to flow from the final output loss backwards through hundreds of neural layers using calculus chain rule.',
    takeaway: 'Without backprop, computing gradients for billions of weights would require impossible compute.'
  }
];

export const OPTIMIZERS = [
  {
    name: 'Standard SGD',
    description: 'Computes gradients on small random batches. Can oscillate heavily in ravines and stall at saddle points.',
    color: 'text-amber-400'
  },
  {
    name: 'SGD + Momentum',
    description: 'Adds a velocity term like a heavy ball rolling down hill, smoothing oscillations and blasting past shallow local minima.',
    color: 'text-emerald-400'
  },
  {
    name: 'Adam (Adaptive Moments)',
    description: 'Combines Momentum and RMSProp. Tracks both first (mean) and second (uncentered variance) moments of gradients. Gold standard for LLMs.',
    color: 'text-cyan-400'
  }
];

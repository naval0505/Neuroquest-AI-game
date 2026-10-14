import confetti from 'canvas-confetti';

export function fireConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899']
    });
  } catch (e) {
    console.warn('Confetti error', e);
  }
}

export function fireSuperConfetti() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#06b6d4', '#3b82f6', '#10b981', '#ec4899'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    console.warn('Super confetti error', e);
  }
}

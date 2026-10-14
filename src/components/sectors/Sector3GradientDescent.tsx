import React, { useState, useRef, useEffect } from 'react';
import { GRADIENT_CONCEPTS, OPTIMIZERS } from '../../data/gradientData';
import { sound } from '../../utils/soundFx';
import { fireConfetti } from '../../utils/confetti';
import { 
  TrendingDown, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  Flame, 
  HelpCircle,
  GitCommit
} from 'lucide-react';

interface Sector3Props {
  onEarnXP: (xp: number, questId: string, badgeId?: string) => void;
  isCompleted: boolean;
}

export const Sector3GradientDescent: React.FC<Sector3Props> = ({ onEarnXP, isCompleted }) => {
  // Landscape parameters
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [momentum, setMomentum] = useState<number>(0.5);
  const [pos, setPos] = useState<number>(-2.8); // current theta
  const [velocity, setVelocity] = useState<number>(0);
  const [history, setHistory] = useState<{ theta: number; loss: number }[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('Ready to descend.');
  const [hasWon, setHasWon] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Non-convex loss function with local minimum and global minimum:
  // J(x) = 0.08*x^4 - 0.2*x^3 - 0.5*x^2 + 0.3*x + 1.2
  const lossFn = (x: number) => {
    return 0.06 * Math.pow(x, 4) - 0.15 * Math.pow(x, 3) - 0.6 * Math.pow(x, 2) + 0.4 * x + 2.0;
  };

  // Derivative dJ/dx
  const gradFn = (x: number) => {
    return 0.24 * Math.pow(x, 3) - 0.45 * Math.pow(x, 2) - 1.2 * x + 0.4;
  };

  const currentLoss = lossFn(pos);
  const currentGrad = gradFn(pos);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, width, height);

    // Coordinate mapping: x in [-3.5, 3.5], y in [0, 6]
    const minX = -3.5, maxX = 3.5;
    const minY = 0, maxY = 5.5;

    const toCanvasX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const toCanvasY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = -3; x <= 3; x += 1) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), 0);
      ctx.lineTo(toCanvasX(x), height);
      ctx.stroke();
    }
    for (let y = 1; y <= 5; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, toCanvasY(y));
      ctx.lineTo(width, toCanvasY(y));
      ctx.stroke();
    }

    // Draw Loss curve J(theta)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const xVal = minX + (px / width) * (maxX - minX);
      const yVal = lossFn(xVal);
      const cy = toCanvasY(yVal);
      if (px === 0) ctx.moveTo(px, cy);
      else ctx.lineTo(px, cy);
    }
    ctx.stroke();

    // Fill under curve
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Draw Global & Local Minimum markers
    // Local min approx at x = -1.5, global min approx at x = 2.4
    const globalX = 2.45;
    const globalY = lossFn(globalX);
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(toCanvasX(globalX), toCanvasY(globalY), 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '10px monospace';
    ctx.fillText('Global Min (Target)', toCanvasX(globalX) - 45, toCanvasY(globalY) + 20);

    // Draw history trajectory path
    if (history.length > 1) {
      ctx.strokeStyle = 'rgba(251, 146, 60, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      history.forEach((pt, i) => {
        const hx = toCanvasX(pt.theta);
        const hy = toCanvasY(pt.loss);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      });
      ctx.stroke();
    }

    // Draw Current Position Ball
    const ballX = toCanvasX(pos);
    const ballY = toCanvasY(currentLoss);

    // Tangent line showing gradient slope
    const tangentLen = 30;
    const slope = -currentGrad * 12;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ballX - tangentLen, ballY + slope);
    ctx.lineTo(ballX + tangentLen, ballY - slope);
    ctx.stroke();

    // Glow ball
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#06b6d4';
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [pos, history]);

  // Step function
  const stepGradient = () => {
    const grad = gradFn(pos);

    // Check explosion
    if (Math.abs(pos) > 5 || isNaN(pos)) {
      setIsRunning(false);
      sound.playError();
      setStatusMessage('Gradient exploded! Learning rate too high (Loss diverged to Infinity).');
      return;
    }

    // Momentum update: v = beta * v + alpha * grad; pos = pos - v
    const newV = momentum * velocity + learningRate * grad;
    const nextPos = pos - newV;
    const nextLoss = lossFn(nextPos);

    setVelocity(newV);
    setPos(nextPos);
    setHistory(prev => [...prev.slice(-40), { theta: nextPos, loss: nextLoss }]);

    // Check convergence to global minimum (x ~ 2.45, loss ~ 0.5)
    if (Math.abs(nextPos - 2.45) < 0.25 && Math.abs(grad) < 0.2) {
      setIsRunning(false);
      if (!hasWon) {
        sound.playSuccess();
        fireConfetti();
        setHasWon(true);
        onEarnXP(250, 'gradient_global_min', 'badge_gradient');
        setStatusMessage('Success! Reached Global Minimum! Optimal weights achieved.');
      }
    } else if (Math.abs(nextPos - (-1.5)) < 0.2 && Math.abs(grad) < 0.2) {
      setStatusMessage('Stuck in a Local Minimum! Increase momentum or learning rate to escape.');
    } else {
      setStatusMessage(`Step taken. Loss: ${nextLoss.toFixed(3)}, Slope: ${grad.toFixed(3)}`);
    }
  };

  // Loop runner
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        stepGradient();
      }, 70);
      return () => clearInterval(interval);
    }
  }, [isRunning, pos, velocity, learningRate, momentum]);

  const handleReset = () => {
    sound.playClick();
    setIsRunning(false);
    setPos(-2.8);
    setVelocity(0);
    setHistory([]);
    setStatusMessage('Position reset to top of ridge.');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-cyan-500/30 overflow-hidden cyber-grid">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              SECTOR 03 :: THE DESCENT OF LOSS
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Gradient Descent: <span className="text-emerald-400">Navigating the Cost Landscape</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              How does a machine actually "learn"? By calculating derivatives of the loss function and rolling down the slopes of high-dimensional calculus landscapes!
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Mission Reward</div>
            <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+250 XP</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Global Minimum Hunter</div>
          </div>
        </div>
      </div>

      {/* Interactive Simulation Sandbox */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              Real-Time Loss Landscape Sandbox
            </h2>
            <p className="text-xs text-slate-400">
              Tune Learning Rate (α) and Momentum (β). Find the Global Minimum without overshooting or getting trapped!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setIsRunning(!isRunning);
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause Descent' : 'Start Descent'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              title="Reset Position"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Canvas & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="relative border-2 border-slate-800 rounded-xl overflow-hidden shadow-xl w-full">
              <canvas
                ref={canvasRef}
                width={520}
                height={300}
                className="w-full h-[300px] block"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-black/70 backdrop-blur-sm border border-slate-700 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <span>Loss: <strong className="text-white">{currentLoss.toFixed(3)}</strong></span>
                <span>|</span>
                <span>Gradient ∇J: <strong className={currentGrad > 0 ? 'text-rose-400' : 'text-emerald-400'}>{currentGrad.toFixed(3)}</strong></span>
              </div>
            </div>

            <div className="mt-3 p-2.5 w-full rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
              <span className="text-slate-400">Status: <span className="text-cyan-300">{statusMessage}</span></span>
              {hasWon && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved!
                </span>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              {/* Learning Rate Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-semibold">Learning Rate (α):</span>
                  <span className="text-white font-bold">{learningRate.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.005"
                  max="0.30"
                  step="0.005"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.005 (Too Slow)</span>
                  <span>0.05 (Balanced)</span>
                  <span>0.30 (Explosion Hazard)</span>
                </div>
              </div>

              {/* Momentum Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-400 font-semibold">Momentum (β):</span>
                  <span className="text-white font-bold">{momentum.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.95"
                  step="0.05"
                  value={momentum}
                  onChange={(e) => setMomentum(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                  <span>0.0 (No Momentum)</span>
                  <span>0.9 (Heavy Ball Physics)</span>
                </div>
              </div>

              {/* Presets */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 mb-2">Preset Experiments:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setPos(-2.8);
                      setLearningRate(0.008);
                      setMomentum(0.0);
                      setStatusMessage('Testing slow crawling descent...');
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
                  >
                    Crawling (Stuck in Local Min)
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setPos(-2.8);
                      setLearningRate(0.28);
                      setMomentum(0.0);
                      setStatusMessage('Testing explosive divergence...');
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-900/40 cursor-pointer"
                  >
                    Overshoot Explosion
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setPos(-2.8);
                      setLearningRate(0.05);
                      setMomentum(0.85);
                      setStatusMessage('Testing momentum escape to Global Min...');
                    }}
                    className="px-2.5 py-1 text-xs rounded bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 cursor-pointer"
                  >
                    Optimal Momentum (Target)
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Math Insight */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1 font-mono">
              <div className="text-cyan-400 font-bold">The Fundamental Update Equation:</div>
              <div className="text-slate-300">θ_(t+1) = θ_t - α · ∇J(θ_t)</div>
              <p className="text-[11px] text-slate-400 font-sans mt-1">
                Notice the minus sign: because the gradient points UP towards the peak of loss,
                subtracting it pulls the model parameters down into the optimal valley.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Concepts Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GRADIENT_CONCEPTS.map(concept => (
          <div key={concept.id} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-cyan-400" />
              {concept.title}
            </h3>
            <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-xs text-amber-300 border border-slate-800">
              {concept.math}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-emerald-400">Analogy:</strong> {concept.analogy}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {concept.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { 
  ACTIVATION_FUNCTIONS, 
  LOGIC_GATES, 
  LogicGateData 
} from '../../data/neuralData';
import { sound } from '../../utils/soundFx';
import { fireConfetti } from '../../utils/confetti';
import { 
  Cpu, 
  Sliders, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Activity,
  ArrowRight
} from 'lucide-react';

interface Sector2Props {
  onEarnXP: (xp: number, questId: string, badgeId?: string) => void;
  isCompleted: boolean;
}

export const Sector2NeuralNetworks: React.FC<Sector2Props> = ({ onEarnXP, isCompleted }) => {
  // Perceptron state
  const [w1, setW1] = useState<number>(1.0);
  const [w2, setW2] = useState<number>(1.0);
  const [bias, setBias] = useState<number>(-0.5);
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'XOR'>('AND');
  const [isMlpMode, setIsMlpMode] = useState<boolean>(false);
  const [hasSolvedXOR, setHasSolvedXOR] = useState<boolean>(false);

  // Activation Function state
  const [selectedActivation, setSelectedActivation] = useState<string>('relu');
  const [inputZ, setInputZ] = useState<number>(1.5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentGateData = LOGIC_GATES.find(g => g.gate === selectedGate) || LOGIC_GATES[0];

  // Evaluate accuracy of current weights against current gate truth table
  const evaluateGate = () => {
    let correct = 0;
    currentGateData.truthTable.forEach(pt => {
      let pred = 0;
      if (isMlpMode && selectedGate === 'XOR') {
        // Simulated 2-neuron hidden layer MLP:
        // h1 = sigmoid(w_h1_1*x1 + w_h1_2*x2 + b1)
        // h2 = sigmoid(w_h2_1*x1 + w_h2_2*x2 + b2)
        // out = sigmoid(w_out_1*h1 + w_out_2*h2 + b_out)
        const h1 = (pt.x1 + pt.x2 >= 0.8) ? 1 : 0; // OR
        const h2 = (pt.x1 + pt.x2 >= 1.8) ? 1 : 0; // AND
        pred = (h1 - h2 >= 0.5) ? 1 : 0; // XOR = OR - AND
      } else {
        const z = w1 * pt.x1 + w2 * pt.x2 + bias;
        pred = z >= 0 ? 1 : 0;
      }
      if (pred === pt.y) correct++;
    });
    return { correct, total: currentGateData.truthTable.length };
  };

  const gateScore = evaluateGate();

  // Draw 2D decision boundary on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#050b14';
    ctx.fillRect(0, 0, width, height);

    // Coordinate mapping: [-0.5, 1.5] -> [0, width]
    const minX = -0.4, maxX = 1.4;
    const minY = -0.4, maxY = 1.4;

    const toCanvasX = (x: number) => ((x - minX) / (maxX - minX)) * width;
    const toCanvasY = (y: number) => height - ((y - minY) / (maxY - minY)) * height;

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 1; x += 0.5) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), 0);
      ctx.lineTo(toCanvasX(x), height);
      ctx.stroke();
    }
    for (let y = 0; y <= 1; y += 0.5) {
      ctx.beginPath();
      ctx.moveTo(0, toCanvasY(y));
      ctx.lineTo(width, toCanvasY(y));
      ctx.stroke();
    }

    // Draw decision boundary
    if (isMlpMode && selectedGate === 'XOR') {
      // Non-linear boundary representation for MLP XOR
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.beginPath();
      // Draw XOR decision regions
      const step = 4;
      for (let px = 0; px < width; px += step) {
        for (let py = 0; py < height; py += step) {
          const xVal = minX + (px / width) * (maxX - minX);
          const yVal = minY + ((height - py) / height) * (maxY - minY);
          const h1 = (xVal + yVal >= 0.8) ? 1 : 0;
          const h2 = (xVal + yVal >= 1.8) ? 1 : 0;
          const pred = (h1 - h2 >= 0.5) ? 1 : 0;
          if (pred === 1) {
            ctx.fillRect(px, py, step, step);
          }
        }
      }
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();
    } else {
      // Linear decision boundary: w1*x1 + w2*x2 + bias = 0 => x2 = (-w1*x1 - bias) / w2
      if (Math.abs(w2) > 0.001) {
        const xA = minX;
        const yA = (-w1 * xA - bias) / w2;
        const xB = maxX;
        const yB = (-w1 * xB - bias) / w2;

        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(toCanvasX(xA), toCanvasY(yA));
        ctx.lineTo(toCanvasX(xB), toCanvasY(yB));
        ctx.stroke();

        // Fill positive half-space
        ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
        ctx.beginPath();
        ctx.moveTo(toCanvasX(xA), toCanvasY(yA));
        ctx.lineTo(toCanvasX(xB), toCanvasY(yB));
        // Check normal direction
        if (w2 > 0) {
          ctx.lineTo(width, 0);
          ctx.lineTo(0, 0);
        } else {
          ctx.lineTo(width, height);
          ctx.lineTo(0, height);
        }
        ctx.closePath();
        ctx.fill();
      }
    }

    // Draw data points
    currentGateData.truthTable.forEach(pt => {
      const cx = toCanvasX(pt.x1);
      const cy = toCanvasY(pt.x2);

      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      if (pt.y === 1) {
        ctx.fillStyle = '#10b981'; // Green for Class 1
        ctx.strokeStyle = '#34d399';
      } else {
        ctx.fillStyle = '#f43f5e'; // Red for Class 0
        ctx.strokeStyle = '#fb7185';
      }
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`y=${pt.y}`, cx, cy);
    });
  }, [w1, w2, bias, selectedGate, isMlpMode]);

  const handleGateChange = (gate: 'AND' | 'OR' | 'XOR') => {
    sound.playClick();
    setSelectedGate(gate);
    setIsMlpMode(false);
    if (gate === 'AND') {
      setW1(1.0);
      setW2(1.0);
      setBias(-1.5);
    } else if (gate === 'OR') {
      setW1(1.0);
      setW2(1.0);
      setBias(-0.5);
    } else {
      setW1(0.8);
      setW2(-0.8);
      setBias(0.0);
    }
  };

  const handleSolveXORWithMLP = () => {
    sound.playSuccess();
    fireConfetti();
    setIsMlpMode(true);
    setHasSolvedXOR(true);
    onEarnXP(250, 'neural_xor', 'badge_xor');
  };

  const currentActivationObj = ACTIVATION_FUNCTIONS.find(a => a.id === selectedActivation) || ACTIVATION_FUNCTIONS[0];
  const actVal = currentActivationObj.calc(inputZ);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 border border-cyan-500/30 overflow-hidden cyber-grid">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              SECTOR 02 :: THE NEURAL FORGE
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Inside the Artificial Neuron: <span className="text-cyan-400">Weights, Biases & the XOR Crisis</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Explore how a single Perceptron calculates linear decision boundaries, discover why Minsky & Papert's
              1969 proof of the XOR problem caused the first AI Winter, and see how Multilayer Perceptrons (MLPs) solved it!
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Mission Reward</div>
            <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+250 XP</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">XOR Conqueror Badge</div>
          </div>
        </div>
      </div>

      {/* Interactive Perceptron Sandbox */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Live Perceptron Decision Boundary Lab
            </h2>
            <p className="text-xs text-slate-400">
              Tune weights $w_1, w_2$ and bias $b$ to classify boolean truth tables ($y=1$ green, $y=0$ red).
            </p>
          </div>

          {/* Logic Gate Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            {(['AND', 'OR', 'XOR'] as const).map(gate => (
              <button
                key={gate}
                onClick={() => handleGateChange(gate)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  selectedGate === gate
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {gate} Gate
              </button>
            ))}
          </div>
        </div>

        {/* Lab Grid: Canvas + Sliders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Canvas visualization */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative border-2 border-cyan-900/60 rounded-xl overflow-hidden shadow-xl shadow-cyan-950/40">
              <canvas
                ref={canvasRef}
                width={360}
                height={320}
                className="w-full max-w-[360px] h-[320px] block"
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/60 backdrop-blur-sm border border-slate-700 text-[10px] font-mono text-cyan-300">
                Formula: z = {w1.toFixed(2)}·x₁ + {w2.toFixed(2)}·x₂ + ({bias.toFixed(2)})
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between w-full max-w-[360px] text-xs px-2">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Class 1 (True)
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Class 0 (False)
              </span>
              <span className="font-mono font-bold text-cyan-400">
                Accuracy: {gateScore.correct}/{gateScore.total}
              </span>
            </div>
          </div>

          {/* Controls & Math Breakdown */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
              {/* Slider w1 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-300">Weight 1 (w₁ for x₁):</span>
                  <span className="text-white font-bold">{w1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={w1}
                  disabled={isMlpMode}
                  onChange={(e) => {
                    sound.playClick();
                    setW1(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Slider w2 */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-300">Weight 2 (w₂ for x₂):</span>
                  <span className="text-white font-bold">{w2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.1"
                  value={w2}
                  disabled={isMlpMode}
                  onChange={(e) => {
                    sound.playClick();
                    setW2(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Slider Bias */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-cyan-300">Bias Threshold (b):</span>
                  <span className="text-white font-bold">{bias.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-4.0"
                  max="4.0"
                  step="0.1"
                  value={bias}
                  disabled={isMlpMode}
                  onChange={(e) => {
                    sound.playClick();
                    setBias(parseFloat(e.target.value));
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            {/* XOR Challenge Alert & Resolution */}
            {selectedGate === 'XOR' ? (
              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-amber-300">The 1969 XOR Impossibility Barrier!</h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      Notice how (0,1) and (1,0) are diagonally opposite from (0,0) and (1,1).
                      No matter how you turn the sliders, a single straight line can at best get 3/4 correct!
                    </p>
                  </div>
                </div>

                {!isMlpMode ? (
                  <button
                    onClick={handleSolveXORWithMLP}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Deploy Hidden Layer (Multilayer Perceptron)</span>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </button>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 flex items-center justify-between">
                    <span className="text-xs text-emerald-300 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Hidden Layer Active! Non-linear boundary solved XOR (4/4)!
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">+250 XP Awarded</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-cyan-300">Gate Status: {currentGateData.description}</div>
                <div className="text-slate-400 font-mono text-[11px]">{currentGateData.explanation}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activation Functions Arena */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            Activation Functions: The Spark of Non-Linearity
          </h2>
          <p className="text-xs text-slate-400">
            Without non-linear activation functions, a 100-layer neural network collapses mathematically into a single linear regression!
          </p>
        </div>

        {/* Function selector pills */}
        <div className="flex flex-wrap gap-2">
          {ACTIVATION_FUNCTIONS.map(act => (
            <button
              key={act.id}
              onClick={() => {
                sound.playClick();
                setSelectedActivation(act.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                selectedActivation === act.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              {act.name}
            </button>
          ))}
        </div>

        {/* Card details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="space-y-4">
            <div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Formula & Range</div>
              <div className="text-base font-mono font-bold text-white mt-0.5">{currentActivationObj.formula}</div>
              <div className="text-xs font-mono text-slate-400">Output Range: <span className="text-cyan-300">{currentActivationObj.range}</span></div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-xs font-mono text-slate-400">Derivative f'(z):</div>
              <div className="text-xs font-mono text-amber-300 font-semibold">{currentActivationObj.derivative}</div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <strong className="text-emerald-400">Advantage:</strong>{' '}
                <span className="text-slate-300">{currentActivationObj.pros}</span>
              </div>
              <div>
                <strong className="text-rose-400">Limitation:</strong>{' '}
                <span className="text-slate-300">{currentActivationObj.cons}</span>
              </div>
              <div>
                <strong className="text-cyan-400">When to use:</strong>{' '}
                <span className="text-slate-300">{currentActivationObj.bestUsedFor}</span>
              </div>
            </div>
          </div>

          {/* Interactive input tester */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-slate-300">Input Logit (z):</span>
                <span className="font-mono text-base font-bold text-cyan-400">{inputZ.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-6.0"
                max="6.0"
                step="0.1"
                value={inputZ}
                onChange={(e) => setInputZ(parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>-6.0 (Strong Inhibitory)</span>
                <span>0.0</span>
                <span>+6.0 (Strong Excitatory)</span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30 text-center">
              <div className="text-xs text-slate-400 font-mono">Computed Output f(z)</div>
              <div className="text-3xl font-display font-extrabold text-emerald-400 mt-1">
                {actVal.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

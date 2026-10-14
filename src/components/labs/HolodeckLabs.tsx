import React, { useState } from 'react';
import { Sector2NeuralNetworks } from '../sectors/Sector2NeuralNetworks';
import { Sector3GradientDescent } from '../sectors/Sector3GradientDescent';
import { Sector4Transformers } from '../sectors/Sector4Transformers';
import { Sector5OWASPSecurity } from '../sectors/Sector5OWASPSecurity';
import { sound } from '../../utils/soundFx';
import { FlaskConical, Cpu, TrendingDown, Layers, ShieldAlert, Sparkles } from 'lucide-react';

interface HolodeckLabsProps {
  onEarnXP: (xp: number, questId: string, badgeId?: string) => void;
  owaspCompleted: Record<string, boolean>;
  onMarkOwaspComplete: (id: string) => void;
}

export const HolodeckLabs: React.FC<HolodeckLabsProps> = ({
  onEarnXP,
  owaspCompleted,
  onMarkOwaspComplete
}) => {
  const [activeLab, setActiveLab] = useState<'perceptron' | 'gradient' | 'attention' | 'security'>('perceptron');

  const labs = [
    { id: 'perceptron', title: 'Perceptron 2D Lab', icon: <Cpu className="w-4 h-4 text-cyan-400" />, desc: 'Weights, Biases & XOR' },
    { id: 'gradient', title: 'Gradient Descent Sandbox', icon: <TrendingDown className="w-4 h-4 text-emerald-400" />, desc: 'Loss Landscapes & Learning Rates' },
    { id: 'attention', title: 'Transformer & Attention Lab', icon: <Layers className="w-4 h-4 text-purple-400" />, desc: 'BPE Tokens, Embeddings & QKV Attention' },
    { id: 'security', title: 'OWASP Red-Team Terminal', icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, desc: 'Prompt Injection & Exploit Defense' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-700/60 text-purple-300 text-xs font-mono mb-2">
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
            HOLODECK SANDBOX LABS
          </div>
          <h1 className="text-2xl font-bold font-display text-white">
            Unrestricted AI Laboratories
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Freeform experimentation mode. Tweak hyper-parameters, test custom inputs, stress test neural networks, and simulate adversarial attacks.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap gap-2">
          {labs.map(lab => (
            <button
              key={lab.id}
              onClick={() => {
                sound.playClick();
                setActiveLab(lab.id as any);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeLab === lab.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {lab.icon}
              <span>{lab.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Render Active Lab */}
      <div>
        {activeLab === 'perceptron' && (
          <Sector2NeuralNetworks onEarnXP={onEarnXP} isCompleted={true} />
        )}
        {activeLab === 'gradient' && (
          <Sector3GradientDescent onEarnXP={onEarnXP} isCompleted={true} />
        )}
        {activeLab === 'attention' && (
          <Sector4Transformers onEarnXP={onEarnXP} isCompleted={true} />
        )}
        {activeLab === 'security' && (
          <Sector5OWASPSecurity
            onEarnXP={onEarnXP}
            owaspCompleted={owaspCompleted}
            onMarkOwaspComplete={onMarkOwaspComplete}
          />
        )}
      </div>
    </div>
  );
};

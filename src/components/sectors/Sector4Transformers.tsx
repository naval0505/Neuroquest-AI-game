import React, { useState } from 'react';
import { 
  EMBEDDING_POINTS, 
  SAMPLE_ATTENTION_SENTENCES, 
  SAMPLING_PARAMETERS,
  WordVector 
} from '../../data/transformerData';
import { sound } from '../../utils/soundFx';
import { fireConfetti } from '../../utils/confetti';
import { 
  Layers, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Cpu, 
  Sliders, 
  Binary, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface Sector4Props {
  onEarnXP: (xp: number, questId: string, badgeId?: string) => void;
  isCompleted: boolean;
}

export const Sector4Transformers: React.FC<Sector4Props> = ({ onEarnXP, isCompleted }) => {
  // Tokenizer demo
  const [inputText, setInputText] = useState<string>('Artificial intelligence empowers autonomous neural agents.');
  
  // Embedding Vector Arithmetic demo
  const [selectedWord1, setSelectedWord1] = useState<string>('King');
  const [selectedWord2, setSelectedWord2] = useState<string>('Man');
  const [selectedWord3, setSelectedWord3] = useState<string>('Woman');
  const [hasSolvedAnalogy, setHasSolvedAnalogy] = useState<boolean>(false);

  // Attention Sentence Demo
  const [selectedSentenceId, setSelectedSentenceId] = useState<string>('tired_animal');
  const currentSentence = SAMPLE_ATTENTION_SENTENCES.find(s => s.id === selectedSentenceId) || SAMPLE_ATTENTION_SENTENCES[0];
  const [activeTokenIdx, setActiveTokenIdx] = useState<number>(currentSentence.focusTokenIndex);

  // Generation parameters
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topP, setTopP] = useState<number>(0.9);

  // Simple subword token simulation
  const simulateTokens = (text: string) => {
    return text.trim().split(/\s+/).map((w, idx) => ({
      text: w,
      id: 1000 + idx * 37 + (w.length * 13) % 892,
      color: ['bg-cyan-950/80 border-cyan-500/40 text-cyan-300',
              'bg-purple-950/80 border-purple-500/40 text-purple-300',
              'bg-emerald-950/80 border-emerald-500/40 text-emerald-300',
              'bg-amber-950/80 border-amber-500/40 text-amber-300',
              'bg-rose-950/80 border-rose-500/40 text-rose-300'][idx % 5]
    }));
  };

  const tokens = simulateTokens(inputText);

  // Calculate semantic distance for analogy: King - Man + Woman = Queen
  const w1 = EMBEDDING_POINTS.find(p => p.word === selectedWord1) || EMBEDDING_POINTS[0];
  const w2 = EMBEDDING_POINTS.find(p => p.word === selectedWord2) || EMBEDDING_POINTS[2];
  const w3 = EMBEDDING_POINTS.find(p => p.word === selectedWord3) || EMBEDDING_POINTS[3];

  // Target vector: w1 - w2 + w3
  const targetX = w1.coords[0] - w2.coords[0] + w3.coords[0];
  const targetY = w1.coords[1] - w2.coords[1] + w3.coords[1];

  // Find closest word in dataset
  let closestWord = '';
  let minDistance = 999;
  EMBEDDING_POINTS.forEach(pt => {
    if (pt.word !== selectedWord1 && pt.word !== selectedWord2 && pt.word !== selectedWord3) {
      const dist = Math.hypot(pt.coords[0] - targetX, pt.coords[1] - targetY);
      if (dist < minDistance) {
        minDistance = dist;
        closestWord = pt.word;
      }
    }
  });

  const handleAnalogyCheck = () => {
    if (selectedWord1 === 'King' && selectedWord2 === 'Man' && selectedWord3 === 'Woman' && closestWord === 'Queen') {
      sound.playSuccess();
      fireConfetti();
      setHasSolvedAnalogy(true);
      onEarnXP(250, 'transformer_attention', 'badge_attention');
    } else {
      sound.playClick();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-cyan-500/30 overflow-hidden cyber-grid">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              SECTOR 04 :: THE TRANSFORMER ENGINE
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              The Architecture of LLMs: <span className="text-purple-400">Tokens, Embeddings & Self-Attention</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              How do modern Large Language Models read, reason, and generate text? Unpack Byte-Pair Encoding tokenization,
              high-dimensional vector math, and the revolutionary Multi-Head Self-Attention mechanism from "Attention Is All You Need".
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Mission Reward</div>
            <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+250 XP</span>
            </div>
            <div className="text-[10px] text-purple-400 font-mono mt-0.5">Attention Architect Badge</div>
          </div>
        </div>
      </div>

      {/* 1. Tokenizer Lab */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Binary className="w-5 h-5 text-cyan-400" />
            Byte-Pair Encoding (BPE) Tokenizer Simulator
          </h2>
          <span className="text-xs font-mono text-cyan-400">
            Tokens: {tokens.length} | Characters: {inputText.length}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          LLMs do not see human words or letters. Text is partitioned into numerical token IDs stored in an internal vocabulary dictionary (~32,000 to 128,000 tokens).
        </p>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type any sentence to see it tokenized..."
          className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
        />

        <div className="flex flex-wrap gap-2 pt-2">
          {tokens.map((tok, i) => (
            <div
              key={i}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${tok.color}`}
            >
              <span className="font-semibold">{tok.text}</span>
              <span className="text-[10px] opacity-75 font-mono">id:{tok.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Embedding Vector Arithmetic */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-purple-400" />
            Vector Embeddings: Semantic Arithmetic
          </h2>
          <p className="text-xs text-slate-400">
            In embedding space, concepts with similar meanings cluster together. You can perform linear algebra on ideas!
          </p>
        </div>

        {/* Analogy Builder */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="text-xs font-mono text-slate-400">
            Recreate the classic embedding proof:
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-sm">
            <select
              value={selectedWord1}
              onChange={(e) => setSelectedWord1(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-bold focus:outline-none"
            >
              {EMBEDDING_POINTS.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
            </select>
            <span className="text-slate-400 text-lg font-bold">-</span>
            <select
              value={selectedWord2}
              onChange={(e) => setSelectedWord2(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-bold focus:outline-none"
            >
              {EMBEDDING_POINTS.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
            </select>
            <span className="text-slate-400 text-lg font-bold">+</span>
            <select
              value={selectedWord3}
              onChange={(e) => setSelectedWord3(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-bold focus:outline-none"
            >
              {EMBEDDING_POINTS.map(p => <option key={p.word} value={p.word}>{p.word}</option>)}
            </select>
            <span className="text-slate-400 text-lg font-bold">≈</span>

            <div className="px-4 py-1.5 rounded-lg bg-purple-950 border border-purple-500/50 text-purple-300 font-bold flex items-center gap-2">
              <span>{closestWord}</span>
              <span className="text-[10px] text-purple-400 font-mono">(Distance: {minDistance.toFixed(2)})</span>
            </div>

            <button
              onClick={handleAnalogyCheck}
              className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              Verify Semantic Math
            </button>
          </div>

          {hasSolvedAnalogy && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-300 flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Correct! King - Man + Woman = Queen. Semantic gender displacement verified! +250 XP Awarded!</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. The Self-Attention Visualizer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              Self-Attention Matrix: "Attention Is All You Need"
            </h2>
            <p className="text-xs text-slate-400">
              Select a benchmark sentence and hover/click tokens to inspect how self-attention resolves ambiguous references.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {SAMPLE_ATTENTION_SENTENCES.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedSentenceId(s.id);
                  setActiveTokenIdx(s.focusTokenIndex);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  selectedSentenceId === s.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s.id === 'tired_animal' && 'Animal / Tired'}
                {s.id === 'wide_street' && 'Animal / Wide'}
                {s.id === 'bank_money' && 'Bank / Loan'}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Sentence Tokens */}
        <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {currentSentence.tokens.map((token, idx) => {
              const weight = currentSentence.attentionWeights[idx] || 0.02;
              const isFocus = idx === currentSentence.focusTokenIndex;
              const opacity = Math.max(0.15, weight);

              return (
                <div
                  key={idx}
                  onClick={() => setActiveTokenIdx(idx)}
                  className={`px-3 py-2 rounded-xl text-sm font-mono transition-all cursor-pointer border ${
                    isFocus
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-200 ring-2 ring-cyan-500/40 font-bold shadow-lg shadow-cyan-500/20'
                      : 'border-purple-500/30 text-purple-200 hover:border-purple-400'
                  }`}
                  style={{
                    backgroundColor: isFocus ? undefined : `rgba(168, 85, 247, ${opacity * 0.85})`
                  }}
                >
                  <div className="text-center">{token}</div>
                  <div className="text-[10px] text-center font-mono opacity-80 mt-1">
                    {(weight * 100).toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed">
            <strong className="text-cyan-400">Attention Head Insight:</strong> {currentSentence.insight}
          </div>
        </div>

        {/* Attention Formula Details */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono space-y-1.5">
          <div className="text-purple-400 font-bold">Scaled Dot-Product Attention Equation:</div>
          <div className="text-slate-300">Attention(Q, K, V) = softmax( (Q · K^T) / √d_k ) · V</div>
          <p className="text-[11px] text-slate-400 font-sans">
            Queries ($Q$) represent what a token is looking for; Keys ($K$) represent what a token contains;
            Values ($V$) are the information transmitted. Dividing by √d_k prevents gradient vanishing caused by huge dot products.
          </p>
        </div>
      </div>

      {/* 4. Generation Sampling Hyperparameters */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          Generation Hyperparameters: Temperature & Top-P
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-amber-400 font-semibold">Temperature (T):</span>
              <span className="text-white font-bold">{temperature.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              {temperature < 0.4 && 'Deterministic & Rigid: Always picks greedy top-1 tokens. Great for math and coding.'}
              {temperature >= 0.4 && temperature <= 0.8 && 'Balanced: High fluency with natural human variety.'}
              {temperature > 0.8 && 'High Entropy: Creative fiction or wild hallucination risks.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-cyan-400 font-semibold">Top-P (Nucleus Sampling):</span>
              <span className="text-white font-bold">{topP.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={topP}
              onChange={(e) => setTopP(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Dynamically truncates low probability tail tokens once cumulative probability reaches {Math.round(topP * 100)}%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

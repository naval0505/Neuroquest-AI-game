import React, { useState } from 'react';
import { 
  TAXONOMY_CATEGORIES, 
  TAXONOMY_ITEMS, 
  TAXONOMY_COMPARISON,
  TaxonomyItem 
} from '../../data/taxonomyData';
import { sound } from '../../utils/soundFx';
import { fireConfetti } from '../../utils/confetti';
import { 
  Brain, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface Sector1Props {
  onEarnXP: (xp: number, questId: string, badgeId?: string) => void;
  isCompleted: boolean;
}

export const Sector1Taxonomy: React.FC<Sector1Props> = ({ onEarnXP, isCompleted }) => {
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('all');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectCategory = (itemId: string, categoryId: string) => {
    sound.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [itemId]: categoryId
    }));
  };

  const handleEvaluate = () => {
    let correctCount = 0;
    TAXONOMY_ITEMS.forEach(item => {
      if (selectedAnswers[item.id] === item.correctCategory) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setShowResults(true);

    if (correctCount === TAXONOMY_ITEMS.length) {
      sound.playSuccess();
      fireConfetti();
      onEarnXP(250, 'taxonomy', 'badge_taxonomy');
    } else if (correctCount >= 5) {
      sound.playSuccess();
      onEarnXP(150, 'taxonomy');
    } else {
      sound.playError();
    }
  };

  const handleReset = () => {
    sound.playClick();
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Sector Header */}
      <div className="relative p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-500/30 overflow-hidden cyber-grid">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              SECTOR 01 :: FOUNDATIONS
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              The AI Genesis Matrix: <span className="text-cyan-400">Demystifying the Hierarchy</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Students and engineers frequently confuse AI, Machine Learning, Deep Learning, and Large Language Models.
              Here you will master their exact mathematical differences, historical evolution, and real-world classification.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-center min-w-[140px]">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Mission Reward</div>
            <div className="text-xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+250 XP</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Taxonomy Master Badge</div>
          </div>
        </div>
      </div>

      {/* Visual Hierarchy: The Russian Doll Model */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            The Nested Architecture of Modern AI
          </h2>
          <span className="text-xs text-slate-400 font-mono">Click cards to explore properties</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {TAXONOMY_CATEGORIES.map((cat, idx) => (
            <div 
              key={cat.id} 
              className={`p-4 rounded-xl border ${cat.color} transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/40 font-semibold">
                    Tier 0{idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase">{cat.shortCode}</span>
                </div>
                <h3 className="font-bold text-slate-100 text-sm mb-2">{cat.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{cat.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <span>Scope:</span>
                <span className="text-slate-200">
                  {idx === 0 && 'Superset of all intelligent systems'}
                  {idx === 1 && 'Learns weights from tabular data'}
                  {idx === 2 && 'Learns deep hierarchical features'}
                  {idx === 3 && 'Trillion-token foundation transformers'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Sorter Mini-Game */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Taxonomy Classification Challenge
            </h2>
            <p className="text-xs text-slate-400">
              Categorize each real-world system into its correct AI tier. Score 8/8 to earn full XP and the badge!
            </p>
          </div>
          {showResults && (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs">
                Score: <span className="font-bold text-cyan-400">{score}</span> / {TAXONOMY_ITEMS.length}
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {TAXONOMY_ITEMS.map((item, idx) => {
            const currentChoice = selectedAnswers[item.id];
            const isCorrect = currentChoice === item.correctCategory;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  showResults
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/50'
                      : 'bg-rose-950/20 border-rose-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-100 text-sm">{item.name}</h3>
                      {showResults && (
                        <span className="flex items-center gap-1 text-xs font-semibold">
                          {isCorrect ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> Incorrect
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    {showResults && (
                      <p className="text-xs text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-900/40 mt-2">
                        <strong>Insight:</strong> {item.explanation}
                      </p>
                    )}
                  </div>

                  {/* Category Selection Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {TAXONOMY_CATEGORIES.map((cat) => {
                      const isSelected = currentChoice === cat.id;

                      return (
                        <button
                          key={cat.id}
                          disabled={showResults}
                          onClick={() => handleSelectCategory(item.id, cat.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40'
                          }`}
                        >
                          {cat.shortCode}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Action */}
        {!showResults && (
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              onClick={handleEvaluate}
              disabled={Object.keys(selectedAnswers).length < TAXONOMY_ITEMS.length}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                Object.keys(selectedAnswers).length === TAXONOMY_ITEMS.length
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Submit & Check Classification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Deep-Dive Architectural Comparison Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold font-display text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          Technical Comparison Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="py-2.5 px-3">Dimension</th>
                <th className="py-2.5 px-3 text-amber-400">Symbolic AI</th>
                <th className="py-2.5 px-3 text-emerald-400">Traditional ML</th>
                <th className="py-2.5 px-3 text-cyan-400">Deep Learning</th>
                <th className="py-2.5 px-3 text-purple-400">LLMs & GenAI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {TAXONOMY_COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-950/40">
                  <td className="py-3 px-3 font-semibold text-slate-200">{row.dimension}</td>
                  <td className="py-3 px-3 text-slate-300">{row.symbolic}</td>
                  <td className="py-3 px-3 text-slate-300">{row.ml}</td>
                  <td className="py-3 px-3 text-slate-300">{row.dl}</td>
                  <td className="py-3 px-3 text-slate-300">{row.llm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BADGES_LIST } from '../../data/owaspData';
import { UserProgress } from '../../types';
import { sound } from '../../utils/soundFx';
import { Award, CheckCircle2, Lock, X, Zap, Brain, TrendingDown, Eye, ShieldAlert, ShieldCheck } from 'lucide-react';

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const BadgeModal: React.FC<BadgeModalProps> = ({ isOpen, onClose, progress }) => {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return <Brain className="w-6 h-6 text-cyan-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-400" />;
      case 'TrendingDown': return <TrendingDown className="w-6 h-6 text-emerald-400" />;
      case 'Eye': return <Eye className="w-6 h-6 text-purple-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-rose-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-cyan-400" />;
      default: return <Award className="w-6 h-6 text-cyan-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl shadow-cyan-950/50">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
              Hall of Achievements
            </h2>
            <p className="text-sm text-slate-400">
              Unlocked: <span className="text-cyan-400 font-bold">{progress.badges.length}</span> of {BADGES_LIST.length} Badges
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = progress.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-slate-950/80 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-950/30 border-slate-800 opacity-60'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl border flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-slate-900 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-900/50 border-slate-800 text-slate-600'
                  }`}
                >
                  {isUnlocked ? getIcon(badge.icon) : <Lock className="w-6 h-6" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold text-sm ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>
                      {badge.title}
                    </h3>
                    {isUnlocked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

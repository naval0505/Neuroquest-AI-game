import React from 'react';
import { UserProgress, SectorId } from '../../types';
import { sound } from '../../utils/soundFx';
import { 
  Brain, 
  Cpu, 
  TrendingDown, 
  Layers, 
  ShieldAlert, 
  Award, 
  Volume2, 
  VolumeX, 
  Sparkles,
  FlaskConical
} from 'lucide-react';

interface NavbarProps {
  progress: UserProgress;
  onSelectSector: (sector: SectorId) => void;
  onOpenBadges: () => void;
  onOpenCertificate: () => void;
  onToggleSound: () => void;
  onOpenLabs: () => void;
  activeView: 'sector' | 'labs';
}

export const Navbar: React.FC<NavbarProps> = ({
  progress,
  onSelectSector,
  onOpenBadges,
  onOpenCertificate,
  onToggleSound,
  onOpenLabs,
  activeView
}) => {
  const sectors: { id: SectorId; label: string; icon: React.ReactNode; num: string }[] = [
    { id: 'taxonomy', label: '1. Foundations', icon: <Brain className="w-4 h-4" />, num: '01' },
    { id: 'neural', label: '2. Neural Nets', icon: <Cpu className="w-4 h-4" />, num: '02' },
    { id: 'gradient', label: '3. Gradient Descent', icon: <TrendingDown className="w-4 h-4" />, num: '03' },
    { id: 'transformers', label: '4. Transformers', icon: <Layers className="w-4 h-4" />, num: '04' },
    { id: 'owasp', label: '5. OWASP Defense', icon: <ShieldAlert className="w-4 h-4" />, num: '05' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-cyan-900/40 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo / Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-slate-950 font-black">
            <Brain className="w-6 h-6 text-slate-950" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg tracking-wider text-cyan-400 neon-text-cyan">
                NEUROQUEST
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                AI Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Interactive AI Learning Sandbox & Red-Team Defense
            </p>
          </div>
        </div>

        {/* Sectors Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 text-xs">
          {sectors.map((sec) => {
            const isActive = activeView === 'sector' && progress.activeSector === sec.id;
            const isCompleted = progress.completedQuests[sec.id];

            return (
              <button
                key={sec.id}
                onClick={() => {
                  sound.playClick();
                  onSelectSector(sec.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                  {sec.icon}
                </span>
                <span>{sec.label}</span>
                {isCompleted && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                )}
              </button>
            );
          })}

          {/* Quick Holodeck Labs Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLabs();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
              activeView === 'labs'
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/50 shadow-sm shadow-purple-500/30'
                : 'text-purple-400 hover:text-purple-200 hover:bg-purple-950/30 border border-purple-900/40'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Holodeck Labs</span>
          </button>
        </nav>

        {/* User Stats & Tools */}
        <div className="flex items-center gap-3">
          {/* XP & Level Pill */}
          <div className="flex items-center gap-2.5 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                {progress.rank}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{progress.xp} XP</span>
              </div>
            </div>
          </div>

          {/* Badges / Trophies */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenBadges();
            }}
            title="View Achievements & Badges"
            className="relative p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer"
          >
            <Award className="w-4 h-4" />
            {progress.badges.length > 0 && (
              <span className="absolute -top-1 -right-1 px-1 rounded-full bg-cyan-500 text-[9px] font-bold text-black">
                {progress.badges.length}
              </span>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={progress.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer"
          >
            {progress.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { UserProgress, SectorId } from './types';
import { loadProgress, saveProgress, getRankForXP, INITIAL_PROGRESS } from './utils/storage';
import { sound } from './utils/soundFx';
import { Navbar } from './components/common/Navbar';
import { BadgeModal } from './components/common/BadgeModal';
import { CertificateModal } from './components/common/CertificateModal';
import { Sector1Taxonomy } from './components/sectors/Sector1Taxonomy';
import { Sector2NeuralNetworks } from './components/sectors/Sector2NeuralNetworks';
import { Sector3GradientDescent } from './components/sectors/Sector3GradientDescent';
import { Sector4Transformers } from './components/sectors/Sector4Transformers';
import { Sector5OWASPSecurity } from './components/sectors/Sector5OWASPSecurity';
import { HolodeckLabs } from './components/labs/HolodeckLabs';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  BookOpen
} from 'lucide-react';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [activeView, setActiveView] = useState<'sector' | 'labs'>('sector');
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState<boolean>(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync sound preference
  useEffect(() => {
    sound.enabled = progress.soundEnabled;
  }, [progress.soundEnabled]);

  // Persist progress changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleEarnXP = (amount: number, questId: string, badgeId?: string) => {
    setProgress(prev => {
      const newXP = prev.xp + amount;
      const newRank = getRankForXP(newXP);
      const newCompleted = { ...prev.completedQuests, [questId]: true };
      let newBadges = [...prev.badges];

      if (badgeId && !newBadges.includes(badgeId)) {
        newBadges.push(badgeId);
        sound.playLevelUp();
        showToast(`🏆 Badge Unlocked: ${badgeId.replace('badge_', '').toUpperCase()}! (+${amount} XP)`);
      } else {
        showToast(`⚡ +${amount} XP Earned!`);
      }

      if (newRank !== prev.rank) {
        sound.playLevelUp();
        showToast(`🚀 PROMOTED! You are now a ${newRank}!`);
      }

      return {
        ...prev,
        xp: newXP,
        rank: newRank,
        completedQuests: newCompleted,
        badges: newBadges
      };
    });
  };

  const handleMarkOwaspComplete = (owaspId: string) => {
    setProgress(prev => {
      const updatedOwasp = { ...prev.owaspCompleted, [owaspId]: true };
      const allCount = Object.values(updatedOwasp).filter(Boolean).length;
      let newBadges = [...prev.badges];

      if (allCount === 10 && !newBadges.includes('badge_owasp_sentinel')) {
        newBadges.push('badge_owasp_sentinel');
        sound.playLevelUp();
        showToast('🛡️ LEGENDARY BADGE: OWASP Sentinel Commander Unlocked!');
      }

      return {
        ...prev,
        owaspCompleted: updatedOwasp,
        badges: newBadges
      };
    });
  };

  const handleToggleSound = () => {
    setProgress(prev => {
      const nextSound = !prev.soundEnabled;
      sound.enabled = nextSound;
      if (nextSound) sound.playClick();
      return {
        ...prev,
        soundEnabled: nextSound
      };
    });
  };

  const handleSelectSector = (sector: SectorId) => {
    setActiveView('sector');
    setProgress(prev => ({ ...prev, activeSector: sector }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Navbar */}
      <Navbar
        progress={progress}
        onSelectSector={handleSelectSector}
        onOpenBadges={() => setIsBadgeModalOpen(true)}
        onOpenCertificate={() => setIsCertificateModalOpen(true)}
        onToggleSound={handleToggleSound}
        onOpenLabs={() => setActiveView('labs')}
        activeView={activeView}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cyan-950 border border-cyan-500/60 shadow-xl shadow-cyan-950/60 text-cyan-200 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {activeView === 'labs' ? (
          <HolodeckLabs
            onEarnXP={handleEarnXP}
            owaspCompleted={progress.owaspCompleted}
            onMarkOwaspComplete={handleMarkOwaspComplete}
          />
        ) : (
          <div>
            {progress.activeSector === 'taxonomy' && (
              <Sector1Taxonomy
                onEarnXP={handleEarnXP}
                isCompleted={!!progress.completedQuests['taxonomy']}
              />
            )}
            {progress.activeSector === 'neural' && (
              <Sector2NeuralNetworks
                onEarnXP={handleEarnXP}
                isCompleted={!!progress.completedQuests['neural_xor']}
              />
            )}
            {progress.activeSector === 'gradient' && (
              <Sector3GradientDescent
                onEarnXP={handleEarnXP}
                isCompleted={!!progress.completedQuests['gradient_global_min']}
              />
            )}
            {progress.activeSector === 'transformers' && (
              <Sector4Transformers
                onEarnXP={handleEarnXP}
                isCompleted={!!progress.completedQuests['transformer_attention']}
              />
            )}
            {progress.activeSector === 'owasp' && (
              <Sector5OWASPSecurity
                onEarnXP={handleEarnXP}
                owaspCompleted={progress.owaspCompleted}
                onMarkOwaspComplete={handleMarkOwaspComplete}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer & Progress Banner */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-slate-300">NEUROQUEST AI PROTOCOL</span>
            <span>•</span>
            <span>Rank: <strong className="text-cyan-400">{progress.rank}</strong></span>
            <span>•</span>
            <span>XP: <strong className="text-amber-400">{progress.xp}</strong></span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCertificateModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Claim Certificate</span>
            </button>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-500">
              Dockerized & Ready for GitHub
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BadgeModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
        progress={progress}
      />

      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        progress={progress}
      />
    </div>
  );
};

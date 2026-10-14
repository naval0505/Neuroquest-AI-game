import React, { useState } from 'react';
import { UserProgress } from '../../types';
import { sound } from '../../utils/soundFx';
import { Award, ShieldCheck, X, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, progress }) => {
  const [studentName, setStudentName] = useState('Cadet Student');

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playSuccess();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Certificate of AI & LLM Mastery
            </h2>
            <p className="text-xs text-slate-400">
              Official verification of foundational AI concepts & OWASP LLM defense
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter Student Name"
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print / Save</span>
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative border-4 border-double border-cyan-500/40 rounded-xl p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center cyber-grid shadow-inner">
          <div className="absolute top-3 left-3 text-cyan-500/30 text-[10px] font-mono">
            SYS::VERIFIED_HASH_7F09B
          </div>
          <div className="absolute top-3 right-3 text-cyan-500/30 text-[10px] font-mono">
            PROTOCOL::AI_DEFENSE
          </div>

          <div className="inline-flex items-center justify-center p-3 rounded-full bg-cyan-950/60 border border-cyan-500/50 mb-3 text-cyan-400">
            <Award className="w-10 h-10" />
          </div>

          <div className="font-display uppercase tracking-widest text-cyan-400 text-xs font-bold mb-1">
            Certificate of Completion
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-400 mb-2">
            NEUROQUEST AI PROTOCOL
          </h3>

          <p className="text-xs text-slate-400 mb-4">
            This is proudly awarded to acknowledge that
          </p>

          <div className="text-xl sm:text-2xl font-bold text-amber-300 font-display border-b border-amber-500/30 pb-2 max-w-sm mx-auto mb-4">
            {studentName}
          </div>

          <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed mb-6">
            has successfully mastered foundational Artificial Intelligence, Neural Network Mechanics,
            Gradient Descent Optimization, Transformer Attention Architectures, and defended against the
            <span className="text-cyan-400 font-semibold"> OWASP Top 10 Vulnerabilities for Large Language Models</span>.
          </p>

          {/* Metrics summary */}
          <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-6 text-left">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Rank Achieved</div>
              <div className="text-xs font-bold text-cyan-300 truncate">{progress.rank}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">Experience Points</div>
              <div className="text-xs font-bold text-amber-400">{progress.xp} XP</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-mono">OWASP Defenses</div>
              <div className="text-xs font-bold text-emerald-400">
                {Object.values(progress.owaspCompleted).filter(Boolean).length} / 10
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-4 px-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>CRYPTOGRAPHICALLY VERIFIED</span>
            </div>
            <div className="font-mono text-slate-500">
              DATE: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

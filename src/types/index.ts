export type SectorId = 'taxonomy' | 'neural' | 'gradient' | 'transformers' | 'owasp';

export interface UserProgress {
  xp: number;
  level: number;
  rank: string;
  completedQuests: Record<string, boolean>;
  badges: string[];
  soundEnabled: boolean;
  activeSector: SectorId;
  owaspCompleted: Record<string, boolean>;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: SectorId | 'general';
}

export interface QuizQuestion {
  id: string;
  question: string;
  explanation: string;
  codeSnippet?: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

export interface OWASPChallenge {
  id: string; // e.g., 'LLM01'
  code: string; // e.g., 'LLM01:2025'
  title: string;
  shortDesc: string;
  severity: 'Critical' | 'High' | 'Medium';
  realWorldScenario: string;
  vulnerabilityDetails: string;
  remediation: string;
  interactiveMission: {
    type: 'prompt_injection' | 'output_sanitizer' | 'data_poison' | 'dos_mitigation' | 'supply_chain' | 'sensitive_pii' | 'plugin_gate' | 'excessive_agency' | 'hallucination_rag' | 'model_theft';
    promptTemplate?: string;
    targetSecret?: string;
    challengeObjective: string;
    hint: string;
    initialPayload?: string;
  };
}

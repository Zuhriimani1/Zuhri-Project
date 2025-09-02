
export enum Page {
  LANDING,
  REGISTRATION,
  TEST,
  RESULTS,
}

export interface Candidate {
  nama: string;
  email: string;
  phone: string;
  age: number | '';
  gender: string;
  education: string;
  experience: string;
  field: string;
  city: string;
  testDate?: string;
}

export type TestAnswers = {
  [key: string]: number | string;
};

export interface Question {
  question: string;
  options?: string[];
  correct?: number;
  pattern?: string;
}

export interface InterestQuestion {
  question: string;
  optionA: string;
  optionB: string;
}

export interface PersonalityScores {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
}

export interface CognitiveScores {
    logic: number;
    numeric: number;
    verbal: number;
    visual: number;
    overall: number;
}

export interface InterestScores {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
}

export interface CompetencyScores {
    leadership: number;
    analytical: number;
    communication: number;
    creativity: number;
    teamwork: number;
}

export interface TestResults {
    personality: PersonalityScores;
    cognitive: CognitiveScores;
    interest: InterestScores;
    competencies: CompetencyScores;
    timestamp: string;
}

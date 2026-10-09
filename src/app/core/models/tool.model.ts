/**
 * EduSpark - Core Models & Scalable Schemas
 */

export type ToolCategory = 'reading' | 'spelling' | 'math' | 'geometry' | 'audio';

export interface ToolConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  icon: string;
  bgColor: string;
  accentColor: string;
  ageRange: string;
  badgeText: string;
  route: string;
  enabled: boolean;
}

export interface ProgressRecord {
  id: string;
  toolId: string;
  timestamp: number;
  score: number;
  starsEarned: number;
  wordsProcessed: number;
  accuracy: number;
  details: Record<string, any>;
}

export interface UserStats {
  totalStars: number;
  totalXp: number;
  currentStreak: number;
  wordsRead: number;
  spellingCorrect: number;
  completedTools: string[];
}

export interface TypoSnapWord {
  id: string;
  word: string;
  maskedWord: string;
  missingIndex: number;
  correctLetter: string;
  illustration: string;
  category: string;
  options: string[];
}

export interface YonReadStory {
  id: string;
  title: string;
  category: string;
  readingLevel: string;
  content: string;
}

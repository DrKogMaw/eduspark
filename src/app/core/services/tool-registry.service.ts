import { ToolConfig } from '../models/tool.model.js';

export class ToolRegistryService {
  private tools: ToolConfig[] = [
    {
      id: 'yon-read',
      name: 'YonRead',
      tagline: 'Adaptive Speed & Fluency Reader',
      description: 'Train your eyes to read faster with visual RSVP word flashing and focus letter highlights!',
      category: 'reading',
      icon: '📖',
      bgColor: '#6C5CE7',
      accentColor: '#A29BFE',
      ageRange: 'Ages 6-10',
      badgeText: 'Fluency Booster',
      route: 'yon-read',
      enabled: true
    },
    {
      id: 'typo-snap',
      name: 'TypoSnap',
      tagline: 'Visual Spelling Challenge',
      description: 'Look at the picture, spot the missing letter, and snap the correct tile into place!',
      category: 'spelling',
      icon: '🧩',
      bgColor: '#FF6B6B',
      accentColor: '#FF8E8E',
      ageRange: 'Ages 6-9',
      badgeText: 'Spelling Hero',
      route: 'typo-snap',
      enabled: true
    },
    {
      id: 'math-dash',
      name: 'MathDash',
      tagline: 'Number Quest & Speed Calculation',
      description: 'Solve fun visual math puzzles and collect magic stars before time runs out!',
      category: 'math',
      icon: '🔢',
      bgColor: '#00B894',
      accentColor: '#55E6C1',
      ageRange: 'Ages 7-10',
      badgeText: 'Coming Soon',
      route: 'math-dash',
      enabled: false
    },
    {
      id: 'audio-phonics',
      name: 'PhonicLab',
      tagline: 'Audio Sound & Letter Explorer',
      description: 'Listen to letter sounds, blend phonics, and hear stories come alive!',
      category: 'audio',
      icon: '🎧',
      bgColor: '#FDCB6E',
      accentColor: '#FFEAA7',
      ageRange: 'Ages 6-8',
      badgeText: 'Coming Soon',
      route: 'audio-phonics',
      enabled: false
    }
  ];

  /**
   * Register a new tool dynamically at runtime
   */
  registerTool(config: ToolConfig): void {
    const existingIndex = this.tools.findIndex(t => t.id === config.id);
    if (existingIndex >= 0) {
      this.tools[existingIndex] = config;
    } else {
      this.tools.push(config);
    }
  }

  getRegisteredTools(): ToolConfig[] {
    return [...this.tools];
  }

  getEnabledTools(): ToolConfig[] {
    return this.tools.filter(t => t.enabled);
  }

  getToolById(id: string): ToolConfig | undefined {
    return this.tools.find(t => t.id === id);
  }
}

export const toolRegistry = new ToolRegistryService();

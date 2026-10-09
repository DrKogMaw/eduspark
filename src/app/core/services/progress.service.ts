import { UserStats, ProgressRecord, YonReadStory, TypoSnapWord } from '../models/tool.model.js';

export class ProgressService {
  private statsKey = 'eduspark_user_stats';
  private recordsKey = 'eduspark_progress_history';
  private customStoriesKey = 'eduspark_custom_stories';

  private stats: UserStats = {
    totalStars: 48,
    totalXp: 350,
    currentStreak: 3,
    wordsRead: 420,
    spellingCorrect: 15,
    completedTools: ['yon-read', 'typo-snap']
  };

  private history: ProgressRecord[] = [];

  private defaultStories: YonReadStory[] = [
    {
      id: 'fox-story',
      title: 'The Brave Little Fox',
      category: 'Adventure',
      readingLevel: 'Beginner',
      content: `Once upon a time in a magical green forest, there lived a brave little fox named Barnaby. Barnaby loved exploring high hills and sparkling rivers. One sunlit morning, Barnaby found a golden key resting beside a giant blue flower. He picked up the key and discovered a tiny wooden chest hidden under a patch of soft moss. Inside the chest was a glowing star that granted the gift of joy to every forest creature.`
    },
    {
      id: 'space-rocket',
      title: 'Journey to the Moon',
      category: 'Science',
      readingLevel: 'Intermediate',
      content: `Astronaut Maya stepped into her shiny silver rocket. 3... 2... 1... Blast off! The rocket zoomed into the deep dark sky past sparkling stars and spinning planets. Maya looked out the window and saw planet Earth floating like a bright blue marble. She landed safely on the dusty moon crater and planted a friendly flag with a big smiling sun.`
    },
    {
      id: 'dragon-baking',
      title: 'The Dragon Who Baked Cakes',
      category: 'Fantasy',
      readingLevel: 'Fun Story',
      content: `Unlike other dragons who breathed fire to scare knights, Puff the dragon used his gentle flame to bake delicious strawberry cupcakes! Every Saturday, animal friends from across the kingdom lined up outside Puff’s warm bakery. His secret ingredient was a pinch of cosmic stardust and a big scoop of friendship.`
    }
  ];

  private defaultTypoSnapWords: TypoSnapWord[] = [
    {
      id: 'w1',
      word: 'APPLE',
      maskedWord: 'AP_LE',
      missingIndex: 2,
      correctLetter: 'P',
      illustration: '🍎',
      category: 'Fruits',
      options: ['P', 'B', 'T', 'M']
    },
    {
      id: 'w2',
      word: 'ROCKET',
      maskedWord: 'R_CKET',
      missingIndex: 1,
      correctLetter: 'O',
      illustration: '🚀',
      category: 'Space',
      options: ['O', 'A', 'E', 'U']
    },
    {
      id: 'w3',
      word: 'BUTTERFLY',
      maskedWord: 'BUTTERF_Y',
      missingIndex: 7,
      correctLetter: 'L',
      illustration: '🦋',
      category: 'Animals',
      options: ['L', 'R', 'I', 'P']
    },
    {
      id: 'w4',
      word: 'RAINBOW',
      maskedWord: 'RAI_BOW',
      missingIndex: 3,
      correctLetter: 'N',
      illustration: '🌈',
      category: 'Nature',
      options: ['N', 'M', 'V', 'K']
    },
    {
      id: 'w5',
      word: 'CASTLE',
      maskedWord: 'CAS_LE',
      missingIndex: 3,
      correctLetter: 'T',
      illustration: '🏰',
      category: 'Fantasy',
      options: ['T', 'S', 'D', 'P']
    },
    {
      id: 'w6',
      word: 'DOLPHIN',
      maskedWord: 'DOLP_IN',
      missingIndex: 4,
      correctLetter: 'H',
      illustration: '🐬',
      category: 'Ocean',
      options: ['H', 'K', 'F', 'W']
    }
  ];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const savedStats = localStorage.getItem(this.statsKey);
      if (savedStats) this.stats = JSON.parse(savedStats);

      const savedHistory = localStorage.getItem(this.recordsKey);
      if (savedHistory) this.history = JSON.parse(savedHistory);
    } catch (e) {
      console.warn('Could not load EduSpark progress from storage', e);
    }
  }

  private saveState(): void {
    try {
      localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
      localStorage.setItem(this.recordsKey, JSON.stringify(this.history));
    } catch (e) {
      console.warn('Could not save EduSpark progress to storage', e);
    }
  }

  getStats(): UserStats {
    return { ...this.stats };
  }

  recordActivity(record: Omit<ProgressRecord, 'id' | 'timestamp'>): void {
    const newRecord: ProgressRecord = {
      ...record,
      id: 'rec_' + Date.now(),
      timestamp: Date.now()
    };

    this.history.unshift(newRecord);
    this.stats.totalStars += record.starsEarned;
    this.stats.totalXp += record.score;
    this.stats.wordsRead += record.wordsProcessed || 0;
    
    if (record.toolId === 'typo-snap') {
      this.stats.spellingCorrect += record.details['correctCount'] || 1;
    }

    this.saveState();
  }

  getStoryPresets(): YonReadStory[] {
    const custom = this.getCustomStories();
    return [...custom, ...this.defaultStories];
  }

  getCustomStories(): YonReadStory[] {
    try {
      const raw = localStorage.getItem(this.customStoriesKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  addCustomStory(story: Omit<YonReadStory, 'id'>): YonReadStory {
    const custom = this.getCustomStories();
    const newStory: YonReadStory = {
      ...story,
      id: 'custom_' + Date.now()
    };
    custom.unshift(newStory);
    localStorage.setItem(this.customStoriesKey, JSON.stringify(custom));
    return newStory;
  }

  getTypoSnapWords(): TypoSnapWord[] {
    return [...this.defaultTypoSnapWords];
  }
}

export const progressService = new ProgressService();

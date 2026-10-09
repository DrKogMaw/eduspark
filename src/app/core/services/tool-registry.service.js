import { i18n } from './i18n.service.js';

export class ToolRegistryService {
  getRegisteredTools() {
    const isKa = i18n.getLang() === 'ka';

    return [
      {
        id: 'yon-read',
        name: 'YonRead',
        tagline: isKa ? 'RSVP სწრაფი კითხვის ტრენაჟორი' : 'Adaptive RSVP Speed Reader',
        description: isKa 
          ? 'განავითარე თვალის ფოკუსირება და კითხვის სიჩქარე სიტყვების სწრაფი გამოჩენითა და ფოკუსური ასოს განათებით!'
          : 'Train eye focus and reading fluency with Rapid Serial Visual Presentation and focus letter highlights!',
        category: 'reading',
        icon: '📖',
        bgColor: '#6C5CE7',
        accentColor: '#A29BFE',
        ageRange: isKa ? '6-10 წელი' : 'Ages 6-10',
        badgeText: isKa ? 'კითხვის ტრენაჟორი' : 'Fluency Booster',
        route: 'yon-read',
        enabled: true
      },
      {
        id: 'typo-snap',
        name: 'TypoSnap',
        tagline: isKa ? 'ვიზუალური მართლწერის გამოწვევა' : 'Visual Spelling Challenge',
        description: isKa 
          ? 'შეხედე სურათს, იპოვე გამოტოვებული ასო და ჩასვი სწორი ასო!'
          : 'Look at the picture, spot the missing letter, and snap the correct letter tile into place!',
        category: 'spelling',
        icon: '🧩',
        bgColor: '#FF6B6B',
        accentColor: '#FF8E8E',
        ageRange: isKa ? '6-9 წელი' : 'Ages 6-9',
        badgeText: isKa ? 'მართლწერის ოსტატი' : 'Spelling Hero',
        route: 'typo-snap',
        enabled: true
      },
      {
        id: 'guessing-snap',
        name: 'GuessingSnap',
        tagline: isKa ? 'ვიზუალური სიტყვის ამოცნობა' : 'Visual Word Identification',
        description: isKa 
          ? 'შეხედე სურათს და აირჩიე სწორი სიტყვა 4 ვარიანტიდან!'
          : 'Look at the target image/photo and select the correct word match from 4 options!',
        category: 'spelling',
        icon: '🎯',
        bgColor: '#00B894',
        accentColor: '#55E6C1',
        ageRange: isKa ? '6-10 წელი' : 'Ages 6-10',
        badgeText: isKa ? 'სიტყვათა მატჩერი' : 'Word Matcher',
        route: 'guessing-snap',
        enabled: true
      },
      {
        id: 'phonic-lab',
        name: 'PhonicLab',
        tagline: isKa ? 'აუდიო ფონეტიკა' : 'Audio Phonics & Sounds',
        description: isKa 
          ? 'მოუსმინე ბგერებს და ისწავლე სწორი გამოთქმა!'
          : 'Listen to letter sounds, blend phonics, and hear stories come alive!',
        category: 'audio',
        icon: '🎧',
        bgColor: '#FDCB6E',
        accentColor: '#FFEAA7',
        ageRange: isKa ? '6-8 წელი' : 'Ages 6-8',
        badgeText: isKa ? 'მალე დაემატება' : 'Coming Soon',
        route: 'phonic-lab',
        enabled: false
      }
    ];
  }

  getEnabledTools() {
    return this.getRegisteredTools().filter(t => t.enabled);
  }

  getToolById(id) {
    return this.getRegisteredTools().find(t => t.id === id);
  }
}

export const toolRegistry = new ToolRegistryService();

import { i18n } from './i18n.service.js';

export class ProgressService {
  constructor() {
    this.statsKey = 'eduspark_user_stats';
    this.recordsKey = 'eduspark_progress_history';
    this.customStoriesKey = 'eduspark_custom_stories';
    this.customWordsKey = 'eduspark_custom_words';

    this.stats = {
      totalStars: 48,
      totalXp: 350,
      currentStreak: 3,
      wordsRead: 420,
      spellingCorrect: 15,
      completedTools: ['yon-read', 'typo-snap', 'guessing-snap']
    };

    this.history = [];

    this.defaultStoriesEn = [
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

    this.defaultStoriesKa = [
      {
        id: 'fox-story-ka',
        title: 'პატარა მამაცი მელაკუდა',
        category: 'თავგადასავალი',
        readingLevel: 'დაწყებითი',
        content: `ერთ ხელოვან მწვანე ტყეში ცხოვრობდა პატარა მამაცი მელაკუდა სახელად ბარნაბი. ბარნაბის ძალიან უყვარდა მაღალ გორაკებსა და კაშკაშა მდინარეებზე მოგზაურობა. ერთ მზიან დილას მან გიგანტური ლურჯი ყვავილის გვერდით ოქროს გასაღები იპოვა. გასაღებით მან პატარა ხის სკივრი გახსნა, სადაც მნათობი ვარსკვლავი ედო.`
      },
      {
        id: 'space-rocket-ka',
        title: 'მოგზაურობა მთვარეზე',
        category: 'მეცნიერება',
        readingLevel: 'საშუალო',
        content: `ასტრონავტი მაია თავის ბრწყინვალე ვერცხლისფერი რაკეტაში შევიდა. 3... 2... 1... აფრენა! რაკეტა გაფრინდა ვარსკვლავებით სავსე ცაში. მაიამ ფანჯრიდან დაინახა დედამიწა, რომელიც ლურჯი ბურთივით ბრწყინავდა. იგი მშვიდობით დაეშვა მთვარეზე.`
      },
      {
        id: 'dragon-baking-ka',
        title: 'დრაკონი რომელიც ნამცხვრებს აცხობდა',
        category: 'ზღაპარი',
        readingLevel: 'სასაცილო',
        content: `სხვა დრაკონებისგან განსხვავებით, პატარა დრაკონი თავისი ნაზი ცეცხლით გემრიელ მარწყვის ნამცხვრებს აცხობდა! ყოველ შაბათს ტყის ცხოველები რიგში დგებოდნენ მის საცხობთან.`
      }
    ];

    // Master 50-Word Vocabulary Pool with English and Georgian translations!
    this.defaultTypoSnapWords = [
      { id: 'w1', word: 'APPLE', kaWord: 'ვაშლი', illustration: '🍎', category: 'Fruits' },
      { id: 'w2', word: 'ROCKET', kaWord: 'რაკეტა', illustration: '🚀', category: 'Space' },
      { id: 'w3', word: 'BUTTERFLY', kaWord: 'პეპელა', illustration: '🦋', category: 'Animals' },
      { id: 'w4', word: 'RAINBOW', kaWord: 'ცისარტყელა', illustration: '🌈', category: 'Nature' },
      { id: 'w5', word: 'CASTLE', kaWord: 'ციხესიმაგრე', illustration: '🏰', category: 'Fantasy' },
      { id: 'w6', word: 'DOLPHIN', kaWord: 'დელფინი', illustration: '🐬', category: 'Ocean' },
      { id: 'w7', word: 'UNICORN', kaWord: 'ერთრქა', illustration: '🦄', category: 'Fantasy' },
      { id: 'w8', word: 'DINOSAUR', kaWord: 'დინოზავრი', illustration: '🦖', category: 'History' },
      { id: 'w9', word: 'TELESCOPE', kaWord: 'ტელესკოპი', illustration: '🔭', category: 'Science' },
      { id: 'w10', word: 'VOLCANO', kaWord: 'ვულკანი', illustration: '🌋', category: 'Nature' },
      { id: 'w11', word: 'CHOCOLATE', kaWord: 'შოკოლადი', illustration: '🍫', category: 'Sweets' },
      { id: 'w12', word: 'BICYCLE', kaWord: 'ველოსიპედი', illustration: '🚲', category: 'Vehicles' },
      { id: 'w13', word: 'OCTOPUS', kaWord: 'რვაფეხა', illustration: '🐙', category: 'Ocean' },
      { id: 'w14', word: 'TREASURE', kaWord: 'განძი', illustration: '💎', category: 'Adventure' },
      { id: 'w15', word: 'LION', kaWord: 'ლომი', illustration: '🦁', category: 'Animals' },
      { id: 'w16', word: 'TIGER', kaWord: 'ვეფხვი', illustration: '🐯', category: 'Animals' },
      { id: 'w17', word: 'ELEPHANT', kaWord: 'სპილო', illustration: '🐘', category: 'Animals' },
      { id: 'w18', word: 'GIRAFFE', kaWord: 'ჟირაფი', illustration: '🦒', category: 'Animals' },
      { id: 'w19', word: 'MONKEY', kaWord: 'მაიმუნი', illustration: '🐵', category: 'Animals' },
      { id: 'w20', word: 'PANDA', kaWord: 'პანდა', illustration: '🐼', category: 'Animals' },
      { id: 'w21', word: 'PENGUIN', kaWord: 'პინგვინი', illustration: '🐧', category: 'Animals' },
      { id: 'w22', word: 'EAGLE', kaWord: 'არწივი', illustration: '🦅', category: 'Birds' },
      { id: 'w23', word: 'OWL', kaWord: 'ბუ', illustration: '🦉', category: 'Birds' },
      { id: 'w24', word: 'BEE', kaWord: 'ფუტკარი', illustration: '🐝', category: 'Insects' },
      { id: 'w25', word: 'LADYBUG', kaWord: 'ჭიაყელა', illustration: '🐞', category: 'Insects' },
      { id: 'w26', word: 'SUNFLOWER', kaWord: 'მზესუმზირა', illustration: '🌻', category: 'Plants' },
      { id: 'w27', word: 'PALM', kaWord: 'პალმა', illustration: '🌴', category: 'Plants' },
      { id: 'w28', word: 'PIZZA', kaWord: 'პიცა', illustration: '🍕', category: 'Food' },
      { id: 'w29', word: 'ICECREAM', kaWord: 'ნაღები', illustration: '🍦', category: 'Sweets' },
      { id: 'w30', word: 'PALETTE', kaWord: 'პალიტრა', illustration: '🎨', category: 'Art' },
      { id: 'w31', word: 'GUITAR', kaWord: 'გიტარა', illustration: '🎸', category: 'Music' },
      { id: 'w32', word: 'TRUMPET', kaWord: 'საყვირი', illustration: '🎺', category: 'Music' },
      { id: 'w33', word: 'SOCCER', kaWord: 'ფეხბურთი', illustration: '⚽', category: 'Sports' },
      { id: 'w34', word: 'BASKETBALL', kaWord: 'კალათბურთი', illustration: '🏀', category: 'Sports' },
      { id: 'w35', word: 'CAR', kaWord: 'მანქანა', illustration: '🚗', category: 'Vehicles' },
      { id: 'w36', word: 'AIRPLANE', kaWord: 'თვითმფრინავი', illustration: '✈️', category: 'Vehicles' },
      { id: 'w37', word: 'HELICOPTER', kaWord: 'ვერტმფრენი', illustration: '🚁', category: 'Vehicles' },
      { id: 'w38', word: 'BOAT', kaWord: 'ნავი', illustration: '🚤', category: 'Vehicles' },
      { id: 'w39', word: 'MOON', kaWord: 'მთვარე', illustration: '🌙', category: 'Space' },
      { id: 'w40', word: 'SUN', kaWord: 'მზე', illustration: '☀️', category: 'Space' },
      { id: 'w41', word: 'STAR', kaWord: 'ვარსკვლავი', illustration: '⭐', category: 'Space' },
      { id: 'w42', word: 'BALLOON', kaWord: 'ბუშტი', illustration: '🎈', category: 'Fun' },
      { id: 'w43', word: 'GIFT', kaWord: 'საჩუქარი', illustration: '🎁', category: 'Fun' },
      { id: 'w44', word: 'CROWN', kaWord: 'გვირგვინი', illustration: '👑', category: 'Fantasy' },
      { id: 'w45', word: 'CRYSTAL', kaWord: 'ბროლი', illustration: '🔮', category: 'Magic' },
      { id: 'w46', word: 'MOUNTAIN', kaWord: 'მთა', illustration: '🏔️', category: 'Nature' },
      { id: 'w47', word: 'ISLAND', kaWord: 'კუნძული', illustration: '🏝️', category: 'Nature' },
      { id: 'w48', word: 'CAMP', kaWord: 'ბანაკი', illustration: '🏕️', category: 'Adventure' },
      { id: 'w49', word: 'ANCHOR', kaWord: 'ღუზა', illustration: '⚓', category: 'Ocean' },
      { id: 'w50', word: 'KEY', kaWord: 'გასაღები', illustration: '🔑', category: 'Items' }
    ];

    this.loadState();
  }

  loadState() {
    try {
      const savedStats = localStorage.getItem(this.statsKey);
      if (savedStats) this.stats = JSON.parse(savedStats);

      const savedHistory = localStorage.getItem(this.recordsKey);
      if (savedHistory) this.history = JSON.parse(savedHistory);
    } catch (e) {
      console.warn('Could not load EduSpark progress from storage', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem(this.statsKey, JSON.stringify(this.stats));
      localStorage.setItem(this.recordsKey, JSON.stringify(this.history));
    } catch (e) {
      console.warn('Could not save EduSpark progress to storage', e);
    }
  }

  getStats() {
    return { ...this.stats };
  }

  recordActivity(record) {
    const newRecord = {
      ...record,
      id: 'rec_' + Date.now(),
      timestamp: Date.now()
    };

    this.history.unshift(newRecord);
    this.stats.totalStars += record.starsEarned || 0;
    this.stats.totalXp += record.score || 0;
    this.stats.wordsRead += record.wordsProcessed || 0;
    
    if (record.toolId === 'typo-snap' || record.toolId === 'guessing-snap') {
      this.stats.spellingCorrect += (record.details && record.details.correctCount) || 1;
    }

    this.saveState();
  }

  getStoryPresets() {
    const custom = this.getCustomStories();
    const presets = i18n.getLang() === 'ka' ? this.defaultStoriesKa : this.defaultStoriesEn;
    return [...custom, ...presets];
  }

  getCustomStories() {
    try {
      const raw = localStorage.getItem(this.customStoriesKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  addCustomStory(story) {
    const custom = this.getCustomStories();
    const newStory = {
      ...story,
      id: 'custom_' + Date.now()
    };
    custom.unshift(newStory);
    localStorage.setItem(this.customStoriesKey, JSON.stringify(custom));
    return newStory;
  }

  getTypoSnapWords() {
    const lang = i18n.getLang();
    return this.defaultTypoSnapWords.map(w => ({
      ...w,
      word: lang === 'ka' ? w.kaWord : w.word
    }));
  }

  getCustomWords() {
    try {
      const raw = localStorage.getItem(this.customWordsKey);
      return raw ? JSON.parse(raw) : [
        { id: 'cw1', word: 'DRAGON', illustration: '🧩', category: 'Custom' },
        { id: 'cw2', word: 'SPARK', illustration: '🧩', category: 'Custom' },
        { id: 'cw3', word: 'MAGIC', illustration: '🧩', category: 'Custom' }
      ];
    } catch (e) {
      return [];
    }
  }

  addCustomWord(wordText) {
    const words = this.getCustomWords();
    if (words.length >= 10) {
      alert('Custom deck limit reached! Max 10 custom words allowed.');
      return false;
    }
    const cleanWord = (typeof wordText === 'string' ? wordText : wordText.word).toUpperCase().trim();
    if (!cleanWord) return false;

    const newWord = {
      id: 'cw_' + Date.now(),
      word: cleanWord,
      illustration: '🧩',
      category: 'Custom'
    };

    words.unshift(newWord);
    localStorage.setItem(this.customWordsKey, JSON.stringify(words));
    return newWord;
  }

  deleteCustomWord(id) {
    let words = this.getCustomWords();
    words = words.filter(w => w.id !== id);
    localStorage.setItem(this.customWordsKey, JSON.stringify(words));
  }
}

export const progressService = new ProgressService();

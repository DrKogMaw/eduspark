export class I18nService {
  constructor() {
    this.langKey = 'eduspark_lang';
    this.currentLang = localStorage.getItem(this.langKey) || 'en'; // 'en' | 'ka'

    this.translations = {
      en: {
        appTitle: 'EduSpark',
        appSub: 'Ages 6-10 Learning Realm',
        stars: 'Stars',
        streak: 'Days',
        parentMode: '🔒 Parent Mode',
        heroTitle: 'Hi Explorer! Ready to Learn? 🚀',
        heroSub: 'Pick a magic learning tool below to boost your reading speed & word power!',
        startBtn: '▶️ Start',
        unlocksSoon: '🔒 Unlocks Soon',
        backToDash: '← Back to Dashboard',
        switchMode: '⚙️ Switch Mode',
        chooseMode: 'Choose Game Mode',
        standardMode: 'Standard (15 Words)',
        standardDesc: 'Digestible 15-word practice run. Calm, untimed, and perfect for daily mastery!',
        timeAttackMode: 'Time Attack (60s)',
        timeAttackDesc: 'Fast 60-second speed challenge! 5s penalty for wrong answers!',
        start15Session: '▶️ Start 15-Word Session',
        start60Challenge: '⚡ Start 60s Challenge',
        timeAttackComplete: 'Time Attack Complete!',
        finalScore: 'Final Score:',
        freshSlate: 'Fresh Slate Practice - Ready to beat your score?',
        replayTimeAttack: '⚡ Replay 60s Time Attack',
        switchStandard: '🎯 Switch to Standard Mode',
        sessionComplete: '15-Word Session Complete!',
        replayStandard: '🔄 Replay (New 15 Words)',
        tryTimeAttack: '⚡ Try 60s Time Attack',
        word: 'Word',
        of: 'of',
        streakText: '🔥 Streak:',
        scoreText: '⭐ Score:',
        category: 'Category:',
        amazingJob: '🎉 Amazing Job! Correct!',
        tryAnother: '❌ Oops! Try another choice!',
        listenWord: '🔊 Listen Word',
        matchImage: 'Match the Spoken Word!',
        matchImageHeader: 'Match the Image!',
        customWordsTab: '✏️ Custom Words (TypoSnap)',
        customStoriesTab: '📖 Custom Stories (YonRead)',
        addCustomWord: 'Add Custom Word',
        enterWordPlaceholder: 'Enter custom word (e.g. ELEPHANT)',
        addWordBtn: '➕ Add Word',
        parentGateTitle: 'Parent Control Gate',
        parentGateSub: 'Please answer the security math equation to enter Parent Control Mode.',
        unlockParentBtn: '🔓 Unlock Parent Mode',
        wpm: 'WPM',
        wordsPerMin: 'Words / Min',
        play: '▶️ Play',
        pause: '⏸️ Pause',
        reset: '🔄 Reset',
        chooseStory: 'Select Story:',
        uploadTxt: '📤 Parent Upload Story (.txt)'
      },
      ka: {
        appTitle: 'EduSpark',
        appSub: '6-10 წლის სასწავლო სამყარო',
        stars: 'ვარსკვლავი',
        streak: 'დღე',
        parentMode: '🔒 მშობლის რეჟიმი',
        heroTitle: 'გამარჯობა მკვლევარო! მზად ხარ სწავლისთვის? 🚀',
        heroSub: 'აირჩიე ჯადოსნური სასწავლო ინსტრუმენტი კითხვისა და სიტყვათა მარაგის გასაუმჯობესებლად!',
        startBtn: '▶️ დაწყება',
        unlocksSoon: '🔒 მალე დაემატება',
        backToDash: '← მთავარ გვერდზე დაბრუნება',
        switchMode: '⚙️ რეჟიმის შეცვლა',
        chooseMode: 'აირჩიე თამაშის რეჟიმი',
        standardMode: 'სტანდარტული (15 სიტყვა)',
        standardDesc: '15 სიტყვიანი სავარჯიშო ტური. მშვიდი, უდროო და იდეალური ყოველდღიური ვარჯიშისთვის!',
        timeAttackMode: 'დროითი შეჯიბრი (60წმ)',
        timeAttackDesc: 'სწრაფი 60-წამიანი გამოწვევა! შეცდომაზე აკლდება 5 წამი!',
        start15Session: '▶️ 15-სიტყვიანი ტურის დაწყება',
        start60Challenge: '⚡ 60წმ შეჯიბრის დაწყება',
        timeAttackComplete: 'დროითი შეჯიბრი დასრულდა!',
        finalScore: 'საბოლოო ქულა:',
        freshSlate: 'ახალი სავარჯიშო - მზად ხარ რეკორდის მოსახსნელად?',
        replayTimeAttack: '⚡ 60წმ შეჯიბრის განმეორება',
        switchStandard: '🎯 სტანდარტულ რეჟიმზე გადასვლა',
        sessionComplete: '15-სიტყვიანი ტური დასრულდა!',
        replayStandard: '🔄 ხელახლა დაწყება (ახალი 15 სიტყვა)',
        tryTimeAttack: '⚡ 60წმ შეჯიბრის სცადე',
        word: 'სიტყვა',
        of: 'სულ',
        streakText: '🔥 სერია:',
        scoreText: '⭐ ქულა:',
        category: 'კატეგორია:',
        amazingJob: '🎉 ყოჩაღ! სწორია!',
        tryAnother: '❌ უი! სცადე სხვა ასო!',
        listenWord: '🔊 მოსმენა',
        matchImage: 'იპოვე სწორი სიტყვა!',
        matchImageHeader: 'შეუსაბამე სურათს!',
        customWordsTab: '✏️ ჩემი სიტყვები (TypoSnap)',
        customStoriesTab: '📖 ჩემი ტექსტები (YonRead)',
        addCustomWord: 'საკუთარი სიტყვის დამატება',
        enterWordPlaceholder: 'შეიყვანე სიტყვა (მაგ. სპილო)',
        addWordBtn: '➕ დამატება',
        parentGateTitle: 'მშობლის კონტროლი',
        parentGateSub: 'გთხოვთ ამოხსნათ მათემატიკური ამოცანა მშობლის რეჟიმში შესასვლელად.',
        unlockParentBtn: '🔓 განბლოკვა',
        wpm: 'სიჩქარე',
        wordsPerMin: 'სიტყვა / წუთში',
        play: '▶️ დაწყება',
        pause: '⏸️ პაუზა',
        reset: '🔄 თავიდან',
        chooseStory: 'აირჩიე ტექსტი:',
        uploadTxt: '📤 ტექსტის ატვირთვა (.txt)'
      }
    };
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang === 'en' || lang === 'ka') {
      this.currentLang = lang;
      localStorage.setItem(this.langKey, lang);
    }
  }

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations['en'];
    return dict[key] || this.translations['en'][key] || key;
  }
}

export const i18n = new I18nService();

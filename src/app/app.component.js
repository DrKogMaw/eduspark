import { progressService } from './core/services/progress.service.js';
import { soundService } from './core/services/sound.service.js';
import { i18n } from './core/services/i18n.service.js';
import { DashboardComponent } from './components/dashboard/dashboard.component.js';
import { YonReadComponent } from './components/yon-read/yon-read.component.js';
import { TypoSnapComponent } from './components/typo-snap/typo-snap.component.js';
import { GuessingSnapComponent } from './components/guessing-snap/guessing-snap.component.js';
import { ParentModalComponent } from './components/parent-modal/parent-modal.component.js';

export class AppComponent {
  constructor() {
    this.currentRoute = 'dashboard';
    this.dashboardComp = new DashboardComponent();
    this.yonReadComp = null;
    this.typoSnapComp = null;
    this.guessingSnapComp = null;
    this.parentModalComp = null;

    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    window.appChangeLanguage = (lang) => {
      soundService.playPop();
      i18n.setLang(lang);
      
      // Refresh current component state if active
      if (this.currentRoute === 'yon-read' && this.yonReadComp) {
        this.yonReadComp = new YonReadComponent();
      } else if (this.currentRoute === 'typo-snap' && this.typoSnapComp) {
        this.typoSnapComp = new TypoSnapComponent();
      } else if (this.currentRoute === 'guessing-snap' && this.guessingSnapComp) {
        this.guessingSnapComp = new GuessingSnapComponent();
      }

      this.render();
    };

    window.appNavigateHome = () => {
      soundService.playPop();
      if (this.typoSnapComp) this.typoSnapComp.stopTimer();
      if (this.guessingSnapComp) this.guessingSnapComp.stopTimer();

      this.currentRoute = 'dashboard';
      if (this.yonReadComp) {
        clearInterval(this.yonReadComp.timer);
        this.yonReadComp.isPlaying = false;
      }
      this.render();
    };

    window.appLaunchTool = (route, enabled) => {
      if (!enabled) return;
      soundService.playPop();
      this.currentRoute = route;

      if (route === 'yon-read') {
        this.yonReadComp = new YonReadComponent();
      } else if (route === 'typo-snap') {
        this.typoSnapComp = new TypoSnapComponent();
      } else if (route === 'guessing-snap') {
        this.guessingSnapComp = new GuessingSnapComponent();
      }

      this.render();
    };

    window.appRenderCurrentView = () => {
      this.render();
    };

    // YonRead Handlers
    window.appToggleYonReadPlay = () => {
      if (!this.yonReadComp) return;
      soundService.playPop();
      this.yonReadComp.isPlaying = !this.yonReadComp.isPlaying;

      if (this.yonReadComp.isPlaying) {
        const intervalMs = Math.round((60 / this.yonReadComp.wpm) * 1000);
        this.yonReadComp.timer = setInterval(() => {
          if (!this.yonReadComp) return;
          if (this.yonReadComp.currentIndex + 1 < this.yonReadComp.words.length) {
            this.yonReadComp.currentIndex += 1;
            this.render();
          } else {
            clearInterval(this.yonReadComp.timer);
            this.yonReadComp.isPlaying = false;
            this.yonReadComp.isCompleted = true;
            this.yonReadComp.starsEarned = Math.round(this.yonReadComp.words.length / 10) + 5;
            soundService.playVictoryFanfare();
            progressService.recordActivity({
              toolId: 'yon-read',
              score: 150,
              starsEarned: this.yonReadComp.starsEarned,
              wordsProcessed: this.yonReadComp.words.length,
              accuracy: 100,
              details: { storyTitle: this.yonReadComp.selectedStory.title, wpm: this.yonReadComp.wpm }
            });
            this.render();
          }
        }, intervalMs);
      } else {
        clearInterval(this.yonReadComp.timer);
      }

      this.render();
    };

    window.appResetYonRead = () => {
      if (!this.yonReadComp) return;
      soundService.playPop();
      clearInterval(this.yonReadComp.timer);
      this.yonReadComp.isPlaying = false;
      this.yonReadComp.currentIndex = 0;
      this.yonReadComp.isCompleted = false;
      this.render();
    };

    window.appChangeStory = (storyId) => {
      if (!this.yonReadComp) return;
      soundService.playPop();
      const story = this.yonReadComp.stories.find(s => s.id === storyId);
      if (story) {
        this.yonReadComp.selectedStory = story;
        this.yonReadComp.parseStoryText(story.content);
        this.render();
      }
    };

    window.appChangeYonReadWpm = (val) => {
      if (!this.yonReadComp) return;
      this.yonReadComp.wpm = Number(val);
      if (this.yonReadComp.isPlaying) {
        clearInterval(this.yonReadComp.timer);
        this.yonReadComp.isPlaying = false;
        window.appToggleYonReadPlay();
      }
      this.render();
    };

    window.appChangeYonReadFont = (delta) => {
      if (!this.yonReadComp) return;
      soundService.playPop();
      this.yonReadComp.fontSize = Math.max(32, Math.min(84, this.yonReadComp.fontSize + delta));
      this.render();
    };

    // TypoSnap Handlers
    window.appSetTypoSnapSource = (source) => {
      if (!this.typoSnapComp) return;
      this.typoSnapComp.setDeckSource(source);
    };

    window.appSelectTypoSnapMode = (mode) => {
      if (!this.typoSnapComp) return;
      this.typoSnapComp.selectMode(mode);
    };

    window.appSelectTypoSnapLetter = (letter) => {
      if (!this.typoSnapComp) return;
      this.typoSnapComp.selectLetter(letter);
    };

    window.appResetTypoSnap = () => {
      if (!this.typoSnapComp) return;
      soundService.playPop();
      this.typoSnapComp = new TypoSnapComponent();
      this.render();
    };

    // GuessingSnap Handlers
    window.appSelectGuessingSnapMode = (mode) => {
      if (!this.guessingSnapComp) return;
      this.guessingSnapComp.selectMode(mode);
    };

    window.appSelectGuessingSnapOption = (wordChoice) => {
      if (!this.guessingSnapComp) return;
      this.guessingSnapComp.selectWordOption(wordChoice);
    };

    window.appSpeakCurrentGuessingWord = () => {
      if (!this.guessingSnapComp) return;
      this.guessingSnapComp.speakCurrentTargetWord();
    };

    // Parent Mode Handlers
    window.appOpenParentModal = () => {
      soundService.playPop();
      this.parentModalComp = new ParentModalComponent();
      this.render();
    };

    window.appCloseParentModal = () => {
      this.parentModalComp = null;
      this.render();
    };

    window.appSelectParentTab = (tab) => {
      soundService.playPop();
      if (this.parentModalComp) {
        this.parentModalComp.activeTab = tab;
        this.render();
      }
    };

    window.appVerifyParentPin = () => {
      if (!this.parentModalComp) return;
      const pinInput = document.getElementById('parent-pin-input')?.value;
      const userAns = Number(pinInput);

      if (userAns === this.parentModalComp.targetAnswer) {
        soundService.playSuccessChime();
        this.parentModalComp.isUnlocked = true;
        this.render();
      } else {
        soundService.playErrorBuzz();
        const hintText = `${this.parentModalComp.num1} ${this.parentModalComp.operator} ${this.parentModalComp.num2} = ${this.parentModalComp.targetAnswer}`;
        alert(`Incorrect answer! Hint: ${hintText}`);
        this.parentModalComp.generateRandomEquation();
        this.render();
      }
    };

    window.appSubmitCustomWord = (e) => {
      e.preventDefault();
      const wordInput = document.getElementById('custom-word-input');
      const word = wordInput?.value;

      if (!word) return;

      const added = progressService.addCustomWord(word);
      if (added) {
        soundService.playSuccessChime();
        if (wordInput) wordInput.value = '';
        this.render();
      }
    };

    window.appDeleteCustomWord = (id) => {
      soundService.playPop();
      progressService.deleteCustomWord(id);
      this.render();
    };

    window.appHandleTxtFileUpload = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        const titleInput = document.getElementById('custom-story-title');
        const contentInput = document.getElementById('custom-story-content');

        if (titleInput && !titleInput.value) {
          titleInput.value = file.name.replace('.txt', '');
        }
        if (contentInput) {
          contentInput.value = text;
        }
      };
      reader.readAsText(file);
    };

    window.appSubmitCustomStory = (e) => {
      e.preventDefault();
      const title = document.getElementById('custom-story-title')?.value;
      const content = document.getElementById('custom-story-content')?.value;

      if (!title || !content) return;

      const newStory = progressService.addCustomStory({
        title,
        content,
        category: 'Custom Story',
        readingLevel: 'Custom'
      });

      soundService.playSuccessChime();
      alert(`Story "${title}" saved successfully!`);
      this.parentModalComp = null;

      this.currentRoute = 'yon-read';
      this.yonReadComp = new YonReadComponent();
      this.yonReadComp.selectedStory = newStory;
      this.yonReadComp.parseStoryText(newStory.content);
      this.render();
    };
  }

  render() {
    const stats = progressService.getStats();
    const currentLang = i18n.getLang();
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    appContainer.innerHTML = `
      <!-- Top Navbar -->
      <nav class="navbar">
        <div class="container navbar-inner">
          <a href="#" class="brand-logo" onclick="window.appNavigateHome(); return false;">
            <div class="brand-icon-box">🐲</div>
            <div>
              <div class="brand-title">Edu<span>Spark</span></div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-purple);">${i18n.t('appSub')}</div>
            </div>
          </a>

          <div class="header-stats" style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- Language Selector Pill (English / Georgian) -->
            <div style="display: flex; background: #E2E8F0; padding: 3px; border-radius: var(--radius-full);">
              <button 
                onclick="window.appChangeLanguage('en')" 
                style="border: none; padding: 0.35rem 0.8rem; border-radius: var(--radius-full); font-family: var(--font-heading); font-size: 0.85rem; cursor: pointer; background: ${currentLang === 'en' ? 'var(--color-purple)' : 'transparent'}; color: ${currentLang === 'en' ? '#fff' : 'var(--color-dark-muted)'};"
              >
                🇬🇧 EN
              </button>
              <button 
                onclick="window.appChangeLanguage('ka')" 
                style="border: none; padding: 0.35rem 0.8rem; border-radius: var(--radius-full); font-family: var(--font-heading); font-size: 0.85rem; cursor: pointer; background: ${currentLang === 'ka' ? 'var(--color-purple)' : 'transparent'}; color: ${currentLang === 'ka' ? '#fff' : 'var(--color-dark-muted)'};"
              >
                🇬🇪 GE
              </button>
            </div>

            <div class="stat-chip stars">
              <span>⭐</span>
              <span>${stats.totalStars} ${i18n.t('stars')}</span>
            </div>

            <div class="stat-chip streak">
              <span>🔥</span>
              <span>${stats.currentStreak} ${i18n.t('streak')}</span>
            </div>

            <button class="btn-parent-mode" onclick="window.appOpenParentModal()">
              ${i18n.t('parentMode')}
            </button>
          </div>
        </div>
      </nav>

      <!-- Dynamic Active Tool View -->
      <main>
        ${this.currentRoute === 'dashboard' ? this.dashboardComp.render() : ''}
        ${this.currentRoute === 'yon-read' && this.yonReadComp ? this.yonReadComp.render() : ''}
        ${this.currentRoute === 'typo-snap' && this.typoSnapComp ? this.typoSnapComp.render() : ''}
        ${this.currentRoute === 'guessing-snap' && this.guessingSnapComp ? this.guessingSnapComp.render() : ''}
      </main>

      <!-- Parent Modal Overlay -->
      ${this.parentModalComp ? this.parentModalComp.render() : ''}
    `;
  }
}

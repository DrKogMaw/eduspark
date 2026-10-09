import { progressService } from './core/services/progress.service.js';
import { soundService } from './core/services/sound.service.js';
import { DashboardComponent } from './components/dashboard/dashboard.component.js';
import { YonReadComponent } from './components/yon-read/yon-read.component.js';
import { TypoSnapComponent } from './components/typo-snap/typo-snap.component.js';
import { ParentModalComponent } from './components/parent-modal/parent-modal.component.js';

export class AppComponent {
  currentRoute: string = 'dashboard';
  dashboardComp: DashboardComponent;
  yonReadComp: YonReadComponent | null = null;
  typoSnapComp: TypoSnapComponent | null = null;
  parentModalComp: ParentModalComponent | null = null;

  constructor() {
    this.dashboardComp = new DashboardComponent();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers(): void {
    window.appNavigateHome = () => {
      soundService.playPop();
      this.currentRoute = 'dashboard';
      if (this.yonReadComp) {
        clearInterval(this.yonReadComp.timer);
        this.yonReadComp.isPlaying = false;
      }
      this.render();
    };

    window.appLaunchTool = (route: string, enabled: boolean) => {
      if (!enabled) return;
      soundService.playPop();
      this.currentRoute = route;

      if (route === 'yon-read') {
        this.yonReadComp = new YonReadComponent();
      } else if (route === 'typo-snap') {
        this.typoSnapComp = new TypoSnapComponent();
      }

      this.render();
    };

    window.appRenderCurrentView = () => {
      this.render();
    };

    // YonRead Global Handlers
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

    window.appChangeStory = (storyId: string) => {
      if (!this.yonReadComp) return;
      soundService.playPop();
      const story = this.yonReadComp.stories.find(s => s.id === storyId);
      if (story) {
        this.yonReadComp.selectedStory = story;
        this.yonReadComp.parseStoryText(story.content);
        this.render();
      }
    };

    window.appChangeYonReadWpm = (val: number) => {
      if (!this.yonReadComp) return;
      this.yonReadComp.wpm = Number(val);
      if (this.yonReadComp.isPlaying) {
        clearInterval(this.yonReadComp.timer);
        this.yonReadComp.isPlaying = false;
        window.appToggleYonReadPlay();
      }
      this.render();
    };

    window.appChangeYonReadFont = (delta: number) => {
      if (!this.yonReadComp) return;
      soundService.playPop();
      this.yonReadComp.fontSize = Math.max(32, Math.min(84, this.yonReadComp.fontSize + delta));
      this.render();
    };

    // TypoSnap Global Handlers
    window.appSelectTypoSnapLetter = (letter: string) => {
      if (!this.typoSnapComp) return;
      this.typoSnapComp.selectLetter(letter);
    };

    window.appResetTypoSnap = () => {
      if (!this.typoSnapComp) return;
      soundService.playPop();
      this.typoSnapComp = new TypoSnapComponent();
      this.render();
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

    window.appVerifyParentPin = () => {
      const pinInput = (document.getElementById('parent-pin-input') as HTMLInputElement)?.value;
      if (pinInput === '7') {
        soundService.playSuccessChime();
        if (this.parentModalComp) this.parentModalComp.isUnlocked = true;
        this.render();
      } else {
        soundService.playErrorBuzz();
        alert('Incorrect pin! Hint: 4 + 3 = 7');
      }
    };

    window.appHandleTxtFileUpload = (event: any) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const titleInput = document.getElementById('custom-story-title') as HTMLInputElement;
        const contentInput = document.getElementById('custom-story-content') as HTMLTextAreaElement;

        if (titleInput && !titleInput.value) {
          titleInput.value = file.name.replace('.txt', '');
        }
        if (contentInput) {
          contentInput.value = text;
        }
      };
      reader.readAsText(file);
    };

    window.appSubmitCustomStory = (e: Event) => {
      e.preventDefault();
      const title = (document.getElementById('custom-story-title') as HTMLInputElement).value;
      const content = (document.getElementById('custom-story-content') as HTMLTextAreaElement).value;

      if (!title || !content) return;

      const newStory = progressService.addCustomStory({
        title,
        content,
        category: 'Custom Story',
        readingLevel: 'Custom'
      });

      soundService.playSuccessChime();
      alert(`Story "${title}" uploaded successfully to YonRead!`);
      this.parentModalComp = null;

      // Switch to YonRead with new story
      this.currentRoute = 'yon-read';
      this.yonReadComp = new YonReadComponent();
      this.yonReadComp.selectedStory = newStory;
      this.yonReadComp.parseStoryText(newStory.content);
      this.render();
    };
  }

  render(): void {
    const stats = progressService.getStats();
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
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-purple);">Ages 6-10 Learning Realm</div>
            </div>
          </a>

          <div class="header-stats">
            <div class="stat-chip stars">
              <span>⭐</span>
              <span>${stats.totalStars}</span>
            </div>
            <div class="stat-chip streak">
              <span>🔥</span>
              <span>${stats.currentStreak} Days</span>
            </div>
            <button class="btn-parent-mode" onclick="window.appOpenParentModal()">
              🔒 Parent Mode
            </button>
          </div>
        </div>
      </nav>

      <!-- Dynamic Active Tool View -->
      <main>
        ${this.currentRoute === 'dashboard' ? this.dashboardComp.render() : ''}
        ${this.currentRoute === 'yon-read' && this.yonReadComp ? this.yonReadComp.render() : ''}
        ${this.currentRoute === 'typo-snap' && this.typoSnapComp ? this.typoSnapComp.render() : ''}
      </main>

      <!-- Parent Modal Overlay -->
      ${this.parentModalComp ? this.parentModalComp.render() : ''}
    `;
  }
}

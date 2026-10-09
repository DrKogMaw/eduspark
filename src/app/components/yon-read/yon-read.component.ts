import { progressService } from '../../core/services/progress.service.js';
import { soundService } from '../../core/services/sound.service.js';
import { YonReadStory } from '../../core/models/tool.model.js';

export class YonReadComponent {
  stories: YonReadStory[] = [];
  selectedStory: YonReadStory;
  words: string[] = [];
  currentIndex: number = 0;
  isPlaying: boolean = false;
  wpm: number = 90; // Suitable kid starting speed (words per minute)
  fontSize: number = 52; // Large kid readable text
  timer: any = null;
  isCompleted: boolean = false;
  starsEarned: number = 0;

  constructor() {
    this.stories = progressService.getStoryPresets();
    this.selectedStory = this.stories[0];
    this.parseStoryText(this.selectedStory.content);
  }

  parseStoryText(text: string): void {
    this.words = text
      .trim()
      .replace(/[\r\n]+/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 0);
    this.currentIndex = 0;
    this.isCompleted = false;
  }

  getOptimalRecognitionPoint(word: string): { left: string; focus: string; right: string } {
    if (!word) return { left: '', focus: '', right: '' };
    const len = word.length;
    let focusIndex = 0;

    if (len === 1) focusIndex = 0;
    else if (len >= 2 && len <= 5) focusIndex = 1;
    else if (len >= 6 && len <= 9) focusIndex = 2;
    else if (len >= 10 && len <= 13) focusIndex = 3;
    else focusIndex = 4;

    return {
      left: word.substring(0, focusIndex),
      focus: word.substring(focusIndex, focusIndex + 1),
      right: word.substring(focusIndex + 1)
    };
  }

  render(): string {
    const currentWord = this.words[this.currentIndex] || '';
    const orp = this.getOptimalRecognitionPoint(currentWord);
    const progressPercent = this.words.length > 0 ? Math.round(((this.currentIndex + 1) / this.words.length) * 100) : 0;

    return `
      <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
        <!-- Top Back Navigation -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
          <button class="btn-parent-mode" onclick="window.appNavigateHome()" style="font-size: 1rem; padding: 0.6rem 1.2rem; cursor: pointer;">
            ← Back to Dashboard
          </button>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-purple);">📖 YonRead RSVP</span>
            <span style="background: #6C5CE720; color: var(--color-purple); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.85rem;">
              Speed Reader
            </span>
          </div>
        </div>

        ${this.isCompleted ? `
          <!-- Celebration Completion Screen -->
          <div style="background: var(--color-surface); padding: 3.5rem 2rem; border-radius: var(--radius-lg); text-align: center; box-shadow: var(--shadow-card); max-width: 680px; margin: 0 auto;">
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounceAvatar 1.5s infinite;">🎉 🌟 🐲</div>
            <h1 style="color: var(--color-purple); font-size: 2.5rem; margin-bottom: 0.5rem;">Super Reader Badge Earned!</h1>
            <p style="font-size: 1.15rem; color: var(--color-dark-muted); margin-bottom: 1.5rem;">
              You finished <strong>"${this.selectedStory.title}"</strong> at <strong>${this.wpm} WPM</strong>!
            </p>

            <div style="background: #FFFDF0; border: 3px dashed var(--color-yellow); padding: 1.5rem; border-radius: var(--radius-md); display: inline-flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
              <div style="font-size: 2.5rem;">⭐</div>
              <div style="text-align: left;">
                <div style="font-family: var(--font-heading); font-size: 1.6rem; color: #B7791F;">+${this.starsEarned} Magic Stars</div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-dark-muted);">Great Eye Focus & Fluency!</div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-play" style="background: var(--color-purple); max-width: 220px;" onclick="window.appResetYonRead()">
                🔄 Read Again
              </button>
              <button class="btn-play" style="background: var(--color-mint-dark); max-width: 220px;" onclick="window.appNavigateHome()">
                🚀 Next Challenge
              </button>
            </div>
          </div>
        ` : `
          <!-- Main RSVP Reader Display -->
          <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); margin-bottom: 2rem;">
            <!-- Story Picker & Custom Ingestion Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #F0F0F0;">
              <div>
                <label style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); display: block; margin-bottom: 0.3rem;">Select Story Preset:</label>
                <select id="yon-story-select" class="form-control" style="font-family: var(--font-heading); font-size: 1rem; font-weight: 600; padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: 2px solid #E2E8F0;" onchange="window.appChangeStory(this.value)">
                  ${this.stories.map(s => `<option value="${s.id}" ${s.id === this.selectedStory.id ? 'selected' : ''}>${s.title} (${s.category})</option>`).join('')}
                </select>
              </div>

              <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button class="btn-parent-mode" onclick="window.appOpenParentModal()" style="cursor: pointer; background: var(--color-purple)15; color: var(--color-purple); font-size: 0.9rem;">
                  📤 Upload Custom .TXT Story
                </button>
              </div>
            </div>

            <!-- Focus RSVP Flashing Display Box -->
            <div style="position: relative; height: 200px; background: #FAF9FE; border: 3px solid var(--color-purple)30; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 2rem; box-shadow: inset 0 2px 8px rgba(0,0,0,0.04);">
              <!-- Center ORP Target Indicator Guides -->
              <div style="position: absolute; top: 0; bottom: 0; left: 50%; width: 2px; background: rgba(108, 92, 231, 0.15); transform: translateX(-50%);"></div>
              <div style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); font-size: 0.8rem; color: var(--color-purple); font-weight: 800;">▲ FOCUS POINT ▲</div>

              <!-- Flashing Word Display with Highlighted Center Letter -->
              <div style="font-family: var(--font-heading); font-size: ${this.fontSize}px; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: center;">
                <span style="color: var(--color-dark); opacity: 0.85; text-align: right; min-width: 140px;">${orp.left}</span>
                <span style="color: var(--color-pink); font-weight: 800; background: #FFD16640; padding: 0 4px; border-radius: 4px; border-bottom: 4px solid var(--color-pink); font-size: 1.1em;">${orp.focus}</span>
                <span style="color: var(--color-dark); opacity: 0.85; text-align: left; min-width: 140px;">${orp.right}</span>
              </div>

              <!-- Context Pill (Word Counter) -->
              <div style="position: absolute; bottom: 12px; right: 16px; font-size: 0.85rem; font-weight: 700; color: var(--color-dark-muted); background: #fff; padding: 0.3rem 0.8rem; border-radius: var(--radius-full); border: 1px solid #E0E0E0;">
                Word ${this.currentIndex + 1} of ${this.words.length}
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); margin-bottom: 0.4rem;">
                <span>Reading Progress</span>
                <span>${progressPercent}%</span>
              </div>
              <div style="width: 100%; height: 16px; background: #E2E8F0; border-radius: var(--radius-full); overflow: hidden;">
                <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--color-purple), var(--color-mint)); transition: width 0.2s ease;"></div>
              </div>
            </div>

            <!-- Interactive Player Controls -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; align-items: center;">
              <!-- Play / Pause / Reset -->
              <div style="display: flex; gap: 0.75rem; justify-content: center;">
                <button class="btn-play" style="background: ${this.isPlaying ? 'var(--color-pink)' : 'var(--color-mint-dark)'}; flex: 1; font-size: 1.1rem;" onclick="window.appToggleYonReadPlay()">
                  ${this.isPlaying ? '⏸️ Pause' : '▶️ Start Reading'}
                </button>
                <button class="btn-play" style="background: #636E72; width: 60px;" onclick="window.appResetYonRead()" title="Reset to Beginning">
                  🔄
                </button>
              </div>

              <!-- Kid WPM Speed Slider -->
              <div style="background: #F7F9FC; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 2px solid #E2E8F0;">
                <div style="display: flex; justify-content: space-between; font-family: var(--font-heading); font-size: 0.88rem; margin-bottom: 0.4rem; color: var(--color-purple);">
                  <span>⚡ Reading Speed (WPM)</span>
                  <span style="font-size: 1rem; color: var(--color-pink);">${this.wpm} WPM</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="250" 
                  step="10" 
                  value="${this.wpm}" 
                  style="width: 100%; accent-color: var(--color-purple); cursor: pointer;"
                  oninput="window.appChangeYonReadWpm(this.value)"
                >
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-dark-muted); margin-top: 0.2rem;">
                  <span>🐢 40 (Slow)</span>
                  <span>🐇 250 (Fast)</span>
                </div>
              </div>

              <!-- Font Size Adjustment -->
              <div style="background: #F7F9FC; padding: 1rem 1.25rem; border-radius: var(--radius-md); border: 2px solid #E2E8F0;">
                <div style="display: flex; justify-content: space-between; font-family: var(--font-heading); font-size: 0.88rem; margin-bottom: 0.4rem; color: var(--color-purple);">
                  <span>🔍 Font Sizing</span>
                  <span>${this.fontSize}px</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn-parent-mode" style="flex: 1; cursor: pointer; text-align: center;" onclick="window.appChangeYonReadFont(-6)">A- Smaller</button>
                  <button class="btn-parent-mode" style="flex: 1; cursor: pointer; text-align: center;" onclick="window.appChangeYonReadFont(6)">A+ Larger</button>
                </div>
              </div>
            </div>
          </div>
        `}
      </div>
    `;
  }
}

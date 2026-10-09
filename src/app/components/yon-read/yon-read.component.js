import { progressService } from '../../core/services/progress.service.js';
import { soundService } from '../../core/services/sound.service.js';
import { i18n } from '../../core/services/i18n.service.js';

export class YonReadComponent {
  constructor() {
    this.stories = progressService.getStoryPresets();
    this.selectedStory = this.stories[0];
    this.words = [];
    this.currentIndex = 0;
    this.wpm = 120;
    this.fontSize = 54;
    this.isPlaying = false;
    this.isCompleted = false;
    this.starsEarned = 0;
    this.timer = null;

    this.parseStoryText(this.selectedStory.content);
  }

  parseStoryText(text) {
    if (!text) {
      this.words = [];
      this.currentIndex = 0;
      return;
    }
    this.words = text.trim().split(' ').map(w => w.trim()).filter(w => w.length > 0);
    this.currentIndex = 0;
  }

  getOptimalRecognitionPoint(word) {
    const len = word.length;
    let orpIndex = 0;

    if (len === 1) orpIndex = 0;
    else if (len >= 2 && len <= 5) orpIndex = 1;
    else if (len >= 6 && len <= 9) orpIndex = 2;
    else orpIndex = 3;

    orpIndex = Math.min(orpIndex, len - 1);

    const prefix = word.substring(0, orpIndex);
    const focusChar = word[orpIndex];
    const suffix = word.substring(orpIndex + 1);

    return { prefix, focusChar, suffix };
  }

  getProgressPercent() {
    const total = this.words.length > 0 ? this.words.length : 1;
    return Math.min(100, Math.round(((this.currentIndex + 1) * 100) / total));
  }

  render() {
    this.stories = progressService.getStoryPresets();
    const currentWord = this.words[this.currentIndex] || '';
    const { prefix, focusChar, suffix } = this.getOptimalRecognitionPoint(currentWord);
    const progressPercent = this.getProgressPercent();

    return `
      <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
        <!-- Top Navigation -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn-parent-mode" onclick="window.appNavigateHome()" style="font-size: 1rem; padding: 0.6rem 1.2rem; cursor: pointer;">
            ${i18n.t('backToDash')}
          </button>

          <div style="display: flex; align-items: center; gap: 1rem;">
            <span style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-purple);">📖 YonRead RSVP</span>
          </div>
        </div>

        <!-- Main RSVP Reader Card -->
        <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); max-width: 860px; margin: 0 auto; text-align: center;">
          
          <!-- Story Preset Selector -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
            <label style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-dark-muted);">${i18n.t('chooseStory')}</label>
            <select 
              style="padding: 0.6rem 1.2rem; border-radius: var(--radius-md); border: 2px solid var(--color-purple)40; font-family: var(--font-heading); font-size: 1rem; outline: none; cursor: pointer; background: #fff;"
              onchange="window.appChangeStory(this.value)"
            >
              ${this.stories.map(s => `
                <option value="${s.id}" ${s.id === this.selectedStory.id ? 'selected' : ''}>
                  ${s.title} (${s.readingLevel || 'Story'})
                </option>
              `).join('')}
            </select>
          </div>

          ${this.isCompleted ? `
            <!-- Completion Celebration Banner -->
            <div style="padding: 3rem 1.5rem; text-align: center; animation: bounceAvatar 0.6s;">
              <div style="font-size: 5rem; margin-bottom: 1rem;">🎉 🏆 ⭐</div>
              <h2 style="color: var(--color-mint-dark); font-size: 2.5rem; margin-bottom: 0.5rem;">${i18n.getLang() === 'ka' ? 'გილოცავ! წაკითხულია!' : 'Great Reading Adventure!'}</h2>
              <p style="font-size: 1.2rem; color: var(--color-dark-muted); margin-bottom: 2rem;">
                ${i18n.getLang() === 'ka' ? `შენ წაიკითხე ${this.words.length} სიტყვა!` : `You read ${this.words.length} words with amazing focus!`}
              </p>
              <button class="btn-play" style="background: var(--color-mint-dark); max-width: 260px; margin: 0 auto;" onclick="window.appResetYonRead()">
                ${i18n.t('reset')}
              </button>
            </div>
          ` : `
            <!-- Active RSVP Word Display Box -->
            <div style="background: #FAF6FF; border: 4px dashed var(--color-purple)30; border-radius: var(--radius-lg); height: 220px; display: flex; align-items: center; justify-content: center; margin-bottom: 2rem; position: relative; overflow: hidden;">
              <!-- Top/Bottom Focus Aim Lines -->
              <div style="position: absolute; top: 15px; left: 50%; transform: translateX(-50%); width: 4px; height: 16px; background: var(--color-pink); border-radius: 2px;"></div>
              <div style="position: absolute; bottom: 15px; left: 50%; transform: translateX(-50%); width: 4px; height: 16px; background: var(--color-pink); border-radius: 2px;"></div>

              <div style="font-family: var(--font-heading); font-size: ${this.fontSize}px; font-weight: 700; color: var(--color-dark); letter-spacing: 0.02em;">
                <span>${prefix}</span><span style="color: var(--color-pink); font-size: 1.1em; font-weight: 800; border-bottom: 3px solid var(--color-pink);">${focusChar}</span><span>${suffix}</span>
              </div>
            </div>

            <!-- Reading Progress Bar -->
            <div style="margin-bottom: 2rem;">
              <div style="display: flex; justify-content: space-between; font-family: var(--font-heading); font-size: 0.95rem; color: var(--color-dark-muted); margin-bottom: 0.5rem;">
                <span>${i18n.t('word')} ${this.currentIndex + 1} ${i18n.t('of')} ${this.words.length}</span>
                <span>${progressPercent}%</span>
              </div>
              <div style="background: #E2E8F0; height: 14px; border-radius: var(--radius-full); overflow: hidden;">
                <div style="background: linear-gradient(90deg, var(--color-purple), var(--color-pink)); height: 100%; width: ${progressPercent}%; transition: width 0.1s linear;"></div>
              </div>
            </div>

            <!-- RSVP Control Bar -->
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; background: #F7F9FC; padding: 1.5rem; border-radius: var(--radius-md);">
              
              <!-- Play / Pause Controls -->
              <div style="display: flex; gap: 0.75rem;">
                <button class="btn-play" style="background: ${this.isPlaying ? 'var(--color-yellow)' : 'var(--color-mint-dark)'}; padding: 0.8rem 1.8rem;" onclick="window.appToggleYonReadPlay()">
                  ${this.isPlaying ? i18n.t('pause') : i18n.t('play')}
                </button>
                <button class="btn-parent-mode" style="font-size: 0.9rem;" onclick="window.appResetYonRead()">
                  ${i18n.t('reset')}
                </button>
              </div>

              <!-- Speed WPM Slider -->
              <div style="display: flex; align-items: center; gap: 1rem; flex: 1; max-width: 320px;">
                <span style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); min-width: 70px;">
                  ⚡ ${this.wpm} ${i18n.t('wpm')}
                </span>
                <input 
                  type="range" 
                  min="40" 
                  max="300" 
                  step="10" 
                  value="${this.wpm}" 
                  style="width: 100%; accent-color: var(--color-purple); cursor: pointer;"
                  onchange="window.appChangeYonReadWpm(this.value)"
                >
              </div>

              <!-- Font Sizer -->
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="btn-parent-mode" style="padding: 0.4rem 0.8rem;" onclick="window.appChangeYonReadFont(-6)">A-</button>
                <span style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted);">${this.fontSize}px</span>
                <button class="btn-parent-mode" style="padding: 0.4rem 0.8rem;" onclick="window.appChangeYonReadFont(6)">A+</button>
              </div>
            </div>
          `}
        </div>
      </div>
    `;
  }
}

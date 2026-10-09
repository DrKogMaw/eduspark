import { progressService } from '../../core/services/progress.service.js';
import { soundService } from '../../core/services/sound.service.js';
import { TypoSnapWord } from '../../core/models/tool.model.js';

export class TypoSnapComponent {
  words: TypoSnapWord[] = [];
  currentIndex: number = 0;
  selectedLetter: string | null = null;
  isCorrect: boolean | null = null;
  streak: number = 0;
  score: number = 0;
  starsEarned: number = 0;
  isCompleted: boolean = false;

  constructor() {
    this.words = progressService.getTypoSnapWords();
  }

  getCurrentWord(): TypoSnapWord {
    return this.words[this.currentIndex] || this.words[0];
  }

  selectLetter(letter: string): void {
    if (this.isCorrect !== null) return; // Prevent double clicking during transition

    const current = this.getCurrentWord();
    this.selectedLetter = letter;

    if (letter === current.correctLetter) {
      this.isCorrect = true;
      this.streak += 1;
      this.score += 100 * (1 + Math.floor(this.streak / 3));
      this.starsEarned += 2;
      soundService.playSuccessChime();

      // Record activity progress
      progressService.recordActivity({
        toolId: 'typo-snap',
        score: 100,
        starsEarned: 2,
        wordsProcessed: 1,
        accuracy: 100,
        details: { correctCount: 1, word: current.word }
      });

      // Auto advance to next word after celebration pause
      setTimeout(() => {
        if (this.currentIndex + 1 < this.words.length) {
          this.currentIndex += 1;
          this.selectedLetter = null;
          this.isCorrect = null;
          window.appRenderCurrentView();
        } else {
          this.isCompleted = true;
          soundService.playVictoryFanfare();
          window.appRenderCurrentView();
        }
      }, 1200);

    } else {
      this.isCorrect = false;
      this.streak = 0;
      soundService.playErrorBuzz();

      // Reset selection state after short shake feedback
      setTimeout(() => {
        this.selectedLetter = null;
        this.isCorrect = null;
        window.appRenderCurrentView();
      }, 800);
    }

    window.appRenderCurrentView();
  }

  render(): string {
    const current = this.getCurrentWord();
    const progressPercent = Math.round(((this.currentIndex + 1) / this.words.length) * 100);

    return `
      <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
        <!-- Navigation Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
          <button class="btn-parent-mode" onclick="window.appNavigateHome()" style="font-size: 1rem; padding: 0.6rem 1.2rem; cursor: pointer;">
            ← Back to Dashboard
          </button>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-pink);">🧩 TypoSnap</span>
            <span style="background: #FF6B6B20; color: var(--color-pink); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.85rem;">
              Spelling Hero
            </span>
          </div>
        </div>

        ${this.isCompleted ? `
          <!-- Game Completion Celebration Screen -->
          <div style="background: var(--color-surface); padding: 3.5rem 2rem; border-radius: var(--radius-lg); text-align: center; box-shadow: var(--shadow-card); max-width: 680px; margin: 0 auto;">
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounceAvatar 1.5s infinite;">🏆 🧩 ⭐</div>
            <h1 style="color: var(--color-pink); font-size: 2.5rem; margin-bottom: 0.5rem;">Spelling Master!</h1>
            <p style="font-size: 1.15rem; color: var(--color-dark-muted); margin-bottom: 1.5rem;">
              You completed all <strong>${this.words.length} spelling challenges</strong> with <strong>${this.score} XP</strong>!
            </p>

            <div style="background: #FFFDF0; border: 3px dashed var(--color-yellow); padding: 1.5rem; border-radius: var(--radius-md); display: inline-flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
              <div style="font-size: 2.8rem;">⭐</div>
              <div style="text-align: left;">
                <div style="font-family: var(--font-heading); font-size: 1.6rem; color: #B7791F;">+${this.starsEarned} Magic Stars Earned</div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-dark-muted);">Streak Bonus Active!</div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-play" style="background: var(--color-pink); max-width: 220px;" onclick="window.appResetTypoSnap()">
                🔄 Play Again
              </button>
              <button class="btn-play" style="background: var(--color-mint-dark); max-width: 220px;" onclick="window.appNavigateHome()">
                🚀 Next Tool
              </button>
            </div>
          </div>
        ` : `
          <!-- Main TypoSnap Card -->
          <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); max-width: 780px; margin: 0 auto; text-align: center;">
            
            <!-- Streak & Score Header -->
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div style="background: #FFF5F5; padding: 0.4rem 1rem; border-radius: var(--radius-full); border: 2px solid var(--color-pink); font-family: var(--font-heading); font-weight: 700; color: var(--color-pink-dark);">
                🔥 Streak: ${this.streak}x
              </div>

              <div style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-dark-muted);">
                Word ${this.currentIndex + 1} of ${this.words.length}
              </div>

              <div style="background: #FFFDF0; padding: 0.4rem 1rem; border-radius: var(--radius-full); border: 2px solid var(--color-yellow); font-family: var(--font-heading); font-weight: 700; color: #B7791F;">
                ⭐ Score: ${this.score}
              </div>
            </div>

            <!-- Target Object Graphic Illustration -->
            <div style="background: #FAF6FF; border: 3px solid var(--color-purple)20; border-radius: var(--radius-md); padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 6rem; line-height: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1)); animation: floatIcon 3s ease-in-out infinite alternate;">
                ${current.illustration}
              </div>
              <div style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-purple); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.08em;">
                Category: ${current.category}
              </div>
            </div>

            <!-- Misspelled / Incomplete Word Display -->
            <div style="margin-bottom: 2.5rem;">
              <div style="font-family: var(--font-heading); font-size: 3rem; letter-spacing: 0.15em; display: flex; justify-content: center; align-items: center; gap: 0.4rem;">
                ${current.word.split('').map((char, idx) => {
                  if (idx === current.missingIndex) {
                    const isSelected = this.selectedLetter !== null;
                    const letterToShow = isSelected ? this.selectedLetter : '_';
                    let slotBg = '#FFF3BF';
                    let slotBorder = 'var(--color-yellow)';
                    let slotColor = '#B7791F';

                    if (this.isCorrect === true) {
                      slotBg = '#D3F9D8';
                      slotBorder = 'var(--color-mint-dark)';
                      slotColor = 'var(--color-mint-dark)';
                    } else if (this.isCorrect === false) {
                      slotBg = '#FFE3E3';
                      slotBorder = 'var(--color-pink-dark)';
                      slotColor = 'var(--color-pink-dark)';
                    }

                    return `
                      <span style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 72px; background: ${slotBg}; border: 4px solid ${slotBorder}; border-radius: 12px; color: ${slotColor}; font-weight: 800; transform: scale(1.1); box-shadow: var(--shadow-sm);">
                        ${letterToShow}
                      </span>
                    `;
                  }
                  return `<span style="color: var(--color-dark); min-width: 40px;">${char}</span>`;
                }).join('')}
              </div>
            </div>

            <!-- Feedback Mascot Message -->
            ${this.isCorrect === true ? `
              <div style="background: #D3F9D8; color: var(--color-mint-dark); padding: 0.8rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 1.5rem; animation: bounceAvatar 0.5s;">
                🎉 Amazing Job! "${current.word}" is Correct! +100 XP!
              </div>
            ` : ''}

            ${this.isCorrect === false ? `
              <div style="background: #FFE3E3; color: var(--color-pink-dark); padding: 0.8rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 1.5rem;">
                ❌ Oops! Try another letter!
              </div>
            ` : ''}

            <!-- Interactive Letter Choice Buttons (Large Touch Targets) -->
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${current.options.map(letter => `
                <button 
                  class="btn-play" 
                  style="width: 72px; height: 72px; border-radius: 20px; font-size: 2rem; background: var(--color-purple); box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);"
                  onclick="window.appSelectTypoSnapLetter('${letter}')"
                >
                  ${letter}
                </button>
              `).join('')}
            </div>

            <!-- Level Progress Bar -->
            <div style="margin-top: 2.5rem; width: 100%; height: 12px; background: #E2E8F0; border-radius: var(--radius-full); overflow: hidden;">
              <div style="width: ${progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--color-pink), var(--color-yellow)); transition: width 0.3s ease;"></div>
            </div>
          </div>
        `}
      </div>
    `;
  }
}

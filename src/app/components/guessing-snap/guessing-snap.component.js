import { progressService } from '../../core/services/progress.service.js';
import { soundService } from '../../core/services/sound.service.js';
import { i18n } from '../../core/services/i18n.service.js';

export class GuessingSnapComponent {
  constructor() {
    this.rawWords = progressService.getTypoSnapWords();
    this.gameMode = 'select'; // 'select' | 'standard' | 'time-attack'

    // Standard Mode State
    this.words = [];
    this.currentIndex = 0;
    this.selectedOption = null;
    this.isCorrect = null;
    this.score = 0;
    this.starsEarned = 0;
    this.isCompleted = false;

    // Time Attack Mode State
    this.timeRemaining = 60;
    this.timeAttackScore = 0;
    this.wordsSolved = 0;
    this.timerInterval = null;
    this.isTimeAttackFinished = false;
    this.showPenaltyFlash = false;
  }

  selectMode(mode) {
    soundService.playPop();
    this.gameMode = mode;
    this.rawWords = progressService.getTypoSnapWords();

    if (mode === 'standard') {
      const fullList = this.shuffleAndProcessChoices(this.rawWords);
      this.words = fullList.slice(0, Math.min(15, fullList.length));
      this.currentIndex = 0;
      this.selectedOption = null;
      this.isCorrect = null;
      this.score = 0;
      this.isCompleted = false;
    } else if (mode === 'time-attack') {
      this.startTimeAttack();
    }

    window.appRenderCurrentView();
  }

  startTimeAttack() {
    this.rawWords = progressService.getTypoSnapWords();
    this.words = this.shuffleAndProcessChoices(this.rawWords);
    this.currentIndex = 0;
    this.selectedOption = null;
    this.isCorrect = null;
    this.timeRemaining = 60;
    this.timeAttackScore = 0;
    this.wordsSolved = 0;
    this.isTimeAttackFinished = false;
    this.showPenaltyFlash = false;

    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining -= 1;
        const timeEl = document.getElementById('guessing-time-clock');
        if (timeEl) {
          timeEl.textContent = `⏱️ ${this.timeRemaining}s`;
        }
      } else {
        this.finishTimeAttack();
      }
    }, 1000);
  }

  finishTimeAttack() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isTimeAttackFinished = true;
    soundService.playVictoryFanfare();
    window.appRenderCurrentView();
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  shuffleAndProcessChoices(wordList) {
    const shuffled = [...wordList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.map(item => this.generateWordChoices(item, wordList));
  }

  generateWordChoices(targetItem, allWords) {
    const correctWord = targetItem.word;
    const distractors = new Set();

    while (distractors.size < 3 && allWords.length > 1) {
      const randomItem = allWords[Math.floor(Math.random() * allWords.length)];
      const candidate = randomItem.word;
      if (candidate !== correctWord) {
        distractors.add(candidate);
      }
    }

    const options = [correctWord, ...Array.from(distractors)];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      ...targetItem,
      correctWord,
      options
    };
  }

  getCurrentWord() {
    return this.words[this.currentIndex] || this.words[0];
  }

  speakCurrentTargetWord() {
    const current = this.getCurrentWord();
    if (current && current.correctWord) {
      soundService.speakWord(current.correctWord, 0.9);
    }
  }

  selectWordOption(optionWord) {
    if (this.isCorrect !== null) return;

    soundService.speakWord(optionWord, 0.9);

    const current = this.getCurrentWord();
    this.selectedOption = optionWord;

    if (this.gameMode === 'time-attack') {
      if (optionWord === current.correctWord) {
        this.isCorrect = true;
        this.timeAttackScore += 100;
        this.wordsSolved += 1;
        soundService.playSuccessChime();

        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.words.length;
          this.words[this.currentIndex] = this.generateWordChoices(this.words[this.currentIndex], this.rawWords);
          this.selectedOption = null;
          this.isCorrect = null;
          window.appRenderCurrentView();
        }, 350);

      } else {
        this.isCorrect = false;
        this.showPenaltyFlash = true;
        this.timeRemaining = Math.max(0, this.timeRemaining - 5);
        soundService.playErrorBuzz();

        setTimeout(() => {
          this.selectedOption = null;
          this.isCorrect = null;
          this.showPenaltyFlash = false;
          window.appRenderCurrentView();
        }, 600);
      }
      window.appRenderCurrentView();

    } else {
      // Standard Mode
      if (optionWord === current.correctWord) {
        this.isCorrect = true;
        this.score += 100;
        this.starsEarned += 2;
        soundService.playSuccessChime();

        progressService.recordActivity({
          toolId: 'guessing-snap',
          score: 100,
          starsEarned: 2,
          wordsProcessed: 1,
          accuracy: 100,
          details: { word: current.word }
        });

        setTimeout(() => {
          if (this.currentIndex + 1 < this.words.length) {
            this.currentIndex += 1;
            this.words[this.currentIndex] = this.generateWordChoices(this.words[this.currentIndex], this.rawWords);
            this.selectedOption = null;
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
        soundService.playErrorBuzz();

        setTimeout(() => {
          this.selectedOption = null;
          this.isCorrect = null;
          window.appRenderCurrentView();
        }, 800);
      }
      window.appRenderCurrentView();
    }
  }

  render() {
    const current = this.getCurrentWord();

    return `
      <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
        <!-- Top Navigation Bar -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn-parent-mode" onclick="window.appNavigateHome()" style="font-size: 1rem; padding: 0.6rem 1.2rem; cursor: pointer;">
            ${i18n.t('backToDash')}
          </button>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-mint-dark);">🎯 GuessingSnap</span>
            ${this.gameMode !== 'select' ? `
              <button class="btn-parent-mode" onclick="window.appSelectGuessingSnapMode('select')" style="font-size: 0.85rem; cursor: pointer; background: #E6FFFA; color: var(--color-mint-dark);">
                ${i18n.t('switchMode')}
              </button>
            ` : ''}
          </div>
        </div>

        ${this.gameMode === 'select' ? `
          <!-- Mode Selection Screen -->
          <div style="max-width: 780px; margin: 0 auto; text-align: center;">
            <h1 style="color: var(--color-mint-dark); font-size: 2.5rem; margin-bottom: 0.5rem;">${i18n.t('chooseMode')} 🎯</h1>
            <p style="color: var(--color-dark-muted); font-size: 1.1rem; margin-bottom: 2.5rem;">
              ${i18n.getLang() === 'ka' ? 'ისწავლე 50 სიტყვა ვიზუალური ამოცნობითა და ხმოვანი გამოთქმით!' : 'Master 50 core vocabulary words with visual matching & native speech audio!'}
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              <!-- Standard 15-Word Practice Card -->
              <div 
                style="background: var(--color-surface); border: 4px solid var(--color-mint-dark); border-radius: var(--radius-lg); padding: 2.5rem 1.5rem; text-align: center; box-shadow: var(--shadow-card); cursor: pointer;"
                onclick="window.appSelectGuessingSnapMode('standard')"
              >
                <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounceAvatar 2s infinite;">🎯 🔊</div>
                <h3 style="color: var(--color-mint-dark); font-size: 1.8rem; margin-bottom: 0.5rem;">${i18n.t('standardMode')}</h3>
                <p style="color: var(--color-dark-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                  ${i18n.getLang() === 'ka' ? 'შეუსაბამე სურათები გაჟღერებულ სიტყვებს 15-სიტყვიან ტურში!' : 'Match images with spoken words across a 15-word practice run!'}
                </p>
                <button class="btn-play" style="background: var(--color-mint-dark); font-size: 1.1rem;">
                  ${i18n.t('start15Session')}
                </button>
              </div>

              <!-- Time Attack Card -->
              <div 
                style="background: var(--color-surface); border: 4px solid var(--color-pink); border-radius: var(--radius-lg); padding: 2.5rem 1.5rem; text-align: center; box-shadow: var(--shadow-card); cursor: pointer;"
                onclick="window.appSelectGuessingSnapMode('time-attack')"
              >
                <div style="font-size: 4rem; margin-bottom: 1rem; animation: floatIcon 2.5s ease-in-out infinite alternate;">⚡ ⏱️</div>
                <h3 style="color: var(--color-pink); font-size: 1.8rem; margin-bottom: 0.5rem;">${i18n.t('timeAttackMode')}</h3>
                <p style="color: var(--color-dark-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                  ${i18n.t('timeAttackDesc')}
                </p>
                <button class="btn-play" style="background: var(--color-pink); font-size: 1.1rem;">
                  ${i18n.t('start60Challenge')}
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'time-attack' && this.isTimeAttackFinished ? `
          <!-- Time Attack Summary Screen -->
          <div style="background: var(--color-surface); padding: 3.5rem 2rem; border-radius: var(--radius-lg); text-align: center; box-shadow: var(--shadow-card); max-width: 680px; margin: 0 auto;">
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounceAvatar 1.5s infinite;">⏱️ ⚡ 🏆</div>
            <h1 style="color: var(--color-pink); font-size: 2.5rem; margin-bottom: 0.5rem;">${i18n.t('timeAttackComplete')}</h1>
            <p style="font-size: 1.15rem; color: var(--color-dark-muted); margin-bottom: 1.5rem;">
              ${i18n.getLang() === 'ka' ? `შენ შეუსაბამე <strong>${this.wordsSolved} სურათი</strong> 60 წამში!` : `You matched <strong>${this.wordsSolved} target images</strong> in 60 seconds!`}
            </p>

            <div style="background: #FFFDF0; border: 3px dashed var(--color-yellow); padding: 1.5rem; border-radius: var(--radius-md); display: inline-flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
              <div style="font-size: 2.8rem;">⚡</div>
              <div style="text-align: left;">
                <div style="font-family: var(--font-heading); font-size: 1.8rem; color: #B7791F;">${i18n.t('finalScore')} ${this.timeAttackScore} XP</div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-dark-muted);">${i18n.t('freshSlate')}</div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-play" style="background: var(--color-pink); max-width: 260px;" onclick="window.appSelectGuessingSnapMode('time-attack')">
                ${i18n.t('replayTimeAttack')}
              </button>
              <button class="btn-play" style="background: var(--color-mint-dark); max-width: 240px;" onclick="window.appSelectGuessingSnapMode('standard')">
                ${i18n.t('switchStandard')}
              </button>
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'time-attack' && !this.isTimeAttackFinished ? `
          <!-- Active Time Attack Card -->
          <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); max-width: 780px; margin: 0 auto; text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div id="guessing-time-clock" style="background: #FFF5F5; padding: 0.5rem 1.2rem; border-radius: var(--radius-full); border: 3px solid var(--color-pink); font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--color-pink-dark);">
                ⏱️ ${this.timeRemaining}s
              </div>

              <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-mint-dark); font-weight: 700;">
                ${i18n.getLang() === 'ka' ? 'შეუსაბამე' : 'Matched'}: ${this.wordsSolved}
              </div>

              <div style="background: #FFFDF0; padding: 0.5rem 1.2rem; border-radius: var(--radius-full); border: 3px solid var(--color-yellow); font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: #B7791F;">
                ⚡ ${i18n.t('scoreText')} ${this.timeAttackScore}
              </div>
            </div>

            ${this.showPenaltyFlash ? `
              <div style="background: var(--color-pink-dark); color: #fff; padding: 0.5rem 1rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 1rem; animation: bounceAvatar 0.3s;">
                ⚠️ ${i18n.getLang() === 'ka' ? '5 წამის ჯარიმა!' : '5-Second Penalty Deducted!'}
              </div>
            ` : ''}

            <!-- Target Object Image/Graphic Display with Pronunciation Speaker -->
            <div style="position: relative; background: #E6FFFA; border: 3px solid var(--color-mint-dark); border-radius: var(--radius-md); padding: 2.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <button 
                onclick="window.appSpeakCurrentGuessingWord()" 
                style="position: absolute; top: 12px; right: 16px; background: #fff; border: 2px solid var(--color-mint-dark); color: var(--color-mint-dark); padding: 0.4rem 0.8rem; border-radius: var(--radius-full); font-family: var(--font-heading); font-size: 0.85rem; cursor: pointer;"
              >
                ${i18n.t('listenWord')}
              </button>

              <div style="font-size: 6.5rem; line-height: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));">
                ${current.illustration}
              </div>
              <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-mint-dark); margin-top: 0.75rem;">
                ${i18n.t('matchImage')}
              </div>
            </div>

            <!-- 4 Word Choice Buttons -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; max-width: 600px; margin: 0 auto;">
              ${current.options.map(wordChoice => {
                let btnStyle = 'background: var(--color-mint-dark); color: #fff;';
                if (this.selectedOption === wordChoice) {
                  btnStyle = this.isCorrect ? 'background: var(--color-mint-dark); color: #fff; transform: scale(1.05);' : 'background: var(--color-pink-dark); color: #fff;';
                }
                return `
                  <button 
                    class="btn-play" 
                    style="${btnStyle} font-size: 1.3rem; padding: 1.2rem 1rem; border-radius: var(--radius-md);"
                    onclick="window.appSelectGuessingSnapOption('${wordChoice}')"
                  >
                    🔊 ${wordChoice}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'standard' && this.isCompleted ? `
          <!-- Standard Mode Summary Screen -->
          <div style="background: var(--color-surface); padding: 3.5rem 2rem; border-radius: var(--radius-lg); text-align: center; box-shadow: var(--shadow-card); max-width: 680px; margin: 0 auto;">
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounceAvatar 1.5s infinite;">🏆 🎯 ⭐</div>
            <h1 style="color: var(--color-mint-dark); font-size: 2.5rem; margin-bottom: 0.5rem;">${i18n.t('sessionComplete')}</h1>
            <p style="font-size: 1.15rem; color: var(--color-dark-muted); margin-bottom: 1.5rem;">
              ${i18n.getLang() === 'ka' ? `შენ შეუსაბამე 15 სურათი <strong>${this.score} ქულით</strong>!` : `You matched 15 target images with <strong>${this.score} XP</strong>!`}
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-play" style="background: var(--color-mint-dark); max-width: 260px;" onclick="window.appSelectGuessingSnapMode('standard')">
                ${i18n.t('replayStandard')}
              </button>
              <button class="btn-play" style="background: var(--color-pink); max-width: 240px;" onclick="window.appSelectGuessingSnapMode('time-attack')">
                ${i18n.t('tryTimeAttack')}
              </button>
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'standard' && !this.isCompleted ? `
          <!-- Active Standard Mode Card -->
          <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); max-width: 780px; margin: 0 auto; text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-dark-muted);">
                ${i18n.t('word')} ${this.currentIndex + 1} ${i18n.t('of')} ${this.words.length}
              </div>

              <div style="background: #FFFDF0; padding: 0.4rem 1rem; border-radius: var(--radius-full); border: 2px solid var(--color-yellow); font-family: var(--font-heading); font-weight: 700; color: #B7791F;">
                ${i18n.t('scoreText')} ${this.score}
              </div>
            </div>

            <!-- Target Object Image Display with Speaker -->
            <div style="position: relative; background: #E6FFFA; border: 3px solid var(--color-mint-dark); border-radius: var(--radius-md); padding: 2.5rem; margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <button 
                onclick="window.appSpeakCurrentGuessingWord()" 
                style="position: absolute; top: 12px; right: 16px; background: #fff; border: 2px solid var(--color-mint-dark); color: var(--color-mint-dark); padding: 0.4rem 0.8rem; border-radius: var(--radius-full); font-family: var(--font-heading); font-size: 0.85rem; cursor: pointer;"
              >
                ${i18n.t('listenWord')}
              </button>

              <div style="font-size: 6.5rem; line-height: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));">
                ${current.illustration}
              </div>
              <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-mint-dark); margin-top: 0.75rem;">
                ${i18n.t('matchImage')}
              </div>
            </div>

            <!-- Feedback Toast -->
            ${this.isCorrect === true ? `
              <div style="background: #D3F9D8; color: var(--color-mint-dark); padding: 0.8rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 1.5rem; animation: bounceAvatar 0.5s;">
                🎉 ${i18n.t('amazingJob')} "${current.word}" +100 XP!
              </div>
            ` : ''}

            ${this.isCorrect === false ? `
              <div style="background: #FFE3E3; color: var(--color-pink-dark); padding: 0.8rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 1.5rem;">
                ${i18n.t('tryAnother')}
              </div>
            ` : ''}

            <!-- 4 Word Choice Buttons -->
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem; max-width: 600px; margin: 0 auto;">
              ${current.options.map(wordChoice => {
                let btnStyle = 'background: var(--color-mint-dark); color: #fff;';
                if (this.selectedOption === wordChoice) {
                  btnStyle = this.isCorrect ? 'background: var(--color-mint-dark); color: #fff; transform: scale(1.05);' : 'background: var(--color-pink-dark); color: #fff;';
                }
                return `
                  <button 
                    class="btn-play" 
                    style="${btnStyle} font-size: 1.3rem; padding: 1.2rem 1rem; border-radius: var(--radius-md);"
                    onclick="window.appSelectGuessingSnapOption('${wordChoice}')"
                  >
                    🔊 ${wordChoice}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }
}

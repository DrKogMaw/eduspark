import { progressService } from '../../core/services/progress.service.js';
import { soundService } from '../../core/services/sound.service.js';
import { i18n } from '../../core/services/i18n.service.js';

export class TypoSnapComponent {
  constructor() {
    this.deckSource = 'default';
    this.rawWords = progressService.getTypoSnapWords();
    this.gameMode = 'select'; // 'select' | 'standard' | 'time-attack'

    // Standard Mode State (15-word digestible session deck)
    this.words = [];
    this.currentIndex = 0;
    this.selectedLetter = null;
    this.isCorrect = null;
    this.streak = 0;
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

  setDeckSource(source) {
    soundService.playPop();
    this.deckSource = source;
    if (source === 'custom') {
      const custom = progressService.getCustomWords();
      this.rawWords = custom.length > 0 ? custom : progressService.getTypoSnapWords();
    } else {
      this.rawWords = progressService.getTypoSnapWords();
    }

    if (this.gameMode !== 'select') {
      this.selectMode(this.gameMode);
    } else {
      window.appRenderCurrentView();
    }
  }

  selectMode(mode) {
    soundService.playPop();
    this.gameMode = mode;
    this.rawWords = progressService.getTypoSnapWords();

    if (mode === 'standard') {
      const fullList = this.shuffleAndProcessWords(this.rawWords);
      this.words = fullList.slice(0, Math.min(15, fullList.length));
      this.currentIndex = 0;
      this.selectedLetter = null;
      this.isCorrect = null;
      this.streak = 0;
      this.score = 0;
      this.isCompleted = false;
    } else if (mode === 'time-attack') {
      this.startTimeAttack();
    }

    window.appRenderCurrentView();
  }

  startTimeAttack() {
    this.rawWords = progressService.getTypoSnapWords();
    this.words = this.shuffleAndProcessWords(this.rawWords);
    this.currentIndex = 0;
    this.selectedLetter = null;
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
        const timeEl = document.getElementById('time-attack-clock');
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

  shuffleAndProcessWords(wordList) {
    const shuffled = [...wordList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.map(item => this.generateRandomMaskedChallenge(item));
  }

  generateRandomMaskedChallenge(item) {
    const isKa = i18n.getLang() === 'ka';
    const word = item.word;
    const len = word.length;

    const missingIndex = Math.floor(Math.random() * len);
    const correctLetter = word[missingIndex];
    const maskedWord = word.substring(0, missingIndex) + '_' + word.substring(missingIndex + 1);

    const vowels = isKa 
      ? ['ა', 'ე', 'ი', 'ო', 'უ']
      : ['A', 'E', 'I', 'O', 'U'];
    
    const consonants = isKa
      ? ['ბ', 'გ', 'დ', 'ვ', 'ზ', 'თ', 'კ', 'ლ', 'მ', 'ნ', 'პ', 'ჟ', 'რ', 'ს', 'ტ', 'ფ', 'ქ', 'ღ', 'ყ', 'შ', 'ჩ', 'ც', 'ძ', 'წ', 'ჭ', 'ხ', 'ჯ', 'ჰ']
      : ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

    const isVowel = vowels.includes(correctLetter);
    const pool = isVowel ? vowels : consonants;
    const distractors = new Set();

    while (distractors.size < 3 && pool.length > 1) {
      const randomPick = pool[Math.floor(Math.random() * pool.length)];
      if (randomPick !== correctLetter) {
        distractors.add(randomPick);
      }
    }

    const options = [correctLetter, ...Array.from(distractors)];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    return {
      ...item,
      maskedWord,
      missingIndex,
      correctLetter,
      options
    };
  }

  getCurrentWord() {
    return this.words[this.currentIndex] || this.words[0];
  }

  selectLetter(letter) {
    if (this.isCorrect !== null) return;

    const current = this.getCurrentWord();
    this.selectedLetter = letter;

    if (this.gameMode === 'time-attack') {
      if (letter === current.correctLetter) {
        this.isCorrect = true;
        this.timeAttackScore += 100;
        this.wordsSolved += 1;
        soundService.playSuccessChime();

        setTimeout(() => {
          this.currentIndex = (this.currentIndex + 1) % this.words.length;
          this.words[this.currentIndex] = this.generateRandomMaskedChallenge(this.rawWords.find(w => w.id === this.words[this.currentIndex].id) || this.words[this.currentIndex]);
          this.selectedLetter = null;
          this.isCorrect = null;
          window.appRenderCurrentView();
        }, 250);

      } else {
        this.isCorrect = false;
        this.showPenaltyFlash = true;
        this.timeRemaining = Math.max(0, this.timeRemaining - 5);
        soundService.playErrorBuzz();

        setTimeout(() => {
          this.selectedLetter = null;
          this.isCorrect = null;
          this.showPenaltyFlash = false;
          window.appRenderCurrentView();
        }, 500);
      }
      window.appRenderCurrentView();

    } else {
      // Standard Mode
      if (letter === current.correctLetter) {
        this.isCorrect = true;
        this.streak += 1;
        this.score += 100 * (1 + Math.floor(this.streak / 3));
        this.starsEarned += 2;
        soundService.playSuccessChime();

        progressService.recordActivity({
          toolId: 'typo-snap',
          score: 100,
          starsEarned: 2,
          wordsProcessed: 1,
          accuracy: 100,
          details: { correctCount: 1, word: current.word }
        });

        setTimeout(() => {
          if (this.currentIndex + 1 < this.words.length) {
            this.currentIndex += 1;
            this.words[this.currentIndex] = this.generateRandomMaskedChallenge(this.rawWords.find(w => w.id === this.words[this.currentIndex].id) || this.words[this.currentIndex]);
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

        setTimeout(() => {
          this.selectedLetter = null;
          this.isCorrect = null;
          window.appRenderCurrentView();
        }, 800);
      }
      window.appRenderCurrentView();
    }
  }

  render() {
    const current = this.getCurrentWord();
    const customCount = progressService.getCustomWords().length;

    return `
      <div class="container" style="padding-top: 2rem; padding-bottom: 4rem;">
        <!-- Top Navigation Bar & Source Toggle -->
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem;">
          <button class="btn-parent-mode" onclick="window.appNavigateHome()" style="font-size: 1rem; padding: 0.6rem 1.2rem; cursor: pointer;">
            ${i18n.t('backToDash')}
          </button>

          <!-- Source Toggle Pill -->
          <div style="display: flex; background: #E2E8F0; padding: 4px; border-radius: var(--radius-full);">
            <button 
              onclick="window.appSetTypoSnapSource('default')" 
              style="border: none; padding: 0.4rem 1rem; border-radius: var(--radius-full); font-family: var(--font-heading); font-size: 0.85rem; cursor: pointer; background: ${this.deckSource === 'default' ? 'var(--color-purple)' : 'transparent'}; color: ${this.deckSource === 'default' ? '#fff' : 'var(--color-dark-muted)'};"
            >
              📚 ${i18n.getLang() === 'ka' ? 'ძირითადი ბაზა' : 'Default Deck'} (50)
            </button>
            <button 
              onclick="window.appSetTypoSnapSource('custom')" 
              style="border: none; padding: 0.4rem 1rem; border-radius: var(--radius-full); font-family: var(--font-heading); font-size: 0.85rem; cursor: pointer; background: ${this.deckSource === 'custom' ? 'var(--color-purple)' : 'transparent'}; color: ${this.deckSource === 'custom' ? '#fff' : 'var(--color-dark-muted)'};"
            >
              ✏️ ${i18n.getLang() === 'ka' ? 'ჩემი სიტყვები' : 'My Words'} (${customCount})
            </button>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-family: var(--font-heading); font-size: 1.2rem; color: var(--color-pink);">🧩 TypoSnap</span>
            ${this.gameMode !== 'select' ? `
              <button class="btn-parent-mode" onclick="window.appSelectTypoSnapMode('select')" style="font-size: 0.85rem; cursor: pointer; background: #FFF5F5; color: var(--color-pink-dark);">
                ${i18n.t('switchMode')}
              </button>
            ` : ''}
          </div>
        </div>

        ${this.gameMode === 'select' ? `
          <!-- Mode Selection Screen -->
          <div style="max-width: 780px; margin: 0 auto; text-align: center;">
            <h1 style="color: var(--color-purple); font-size: 2.5rem; margin-bottom: 0.5rem;">${i18n.t('chooseMode')} 🧩</h1>
            <p style="color: var(--color-dark-muted); font-size: 1.1rem; margin-bottom: 2.5rem;">
              ${i18n.getLang() === 'ka' ? 'ივარჯიშე 50 სიტყვაში დინამიური გამოტოვებული ასოებით!' : 'Practice 50 words with dynamic missing letters!'}
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
              <!-- Standard 15-Word Practice Card -->
              <div 
                style="background: var(--color-surface); border: 4px solid var(--color-mint-dark); border-radius: var(--radius-lg); padding: 2.5rem 1.5rem; text-align: center; box-shadow: var(--shadow-card); cursor: pointer;"
                onclick="window.appSelectTypoSnapMode('standard')"
              >
                <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounceAvatar 2s infinite;">🎯 📖</div>
                <h3 style="color: var(--color-mint-dark); font-size: 1.8rem; margin-bottom: 0.5rem;">${i18n.t('standardMode')}</h3>
                <p style="color: var(--color-dark-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                  ${i18n.t('standardDesc')}
                </p>
                <button class="btn-play" style="background: var(--color-mint-dark); font-size: 1.1rem;">
                  ${i18n.t('start15Session')}
                </button>
              </div>

              <!-- Time Attack Card -->
              <div 
                style="background: var(--color-surface); border: 4px solid var(--color-pink); border-radius: var(--radius-lg); padding: 2.5rem 1.5rem; text-align: center; box-shadow: var(--shadow-card); cursor: pointer;"
                onclick="window.appSelectTypoSnapMode('time-attack')"
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
              ${i18n.getLang() === 'ka' ? `შენ ამოხსენი <strong>${this.wordsSolved} სიტყვა</strong> 60 წამში!` : `You solved <strong>${this.wordsSolved} spelling words</strong> in 60 seconds!`}
            </p>

            <div style="background: #FFFDF0; border: 3px dashed var(--color-yellow); padding: 1.5rem; border-radius: var(--radius-md); display: inline-flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;">
              <div style="font-size: 2.8rem;">⚡</div>
              <div style="text-align: left;">
                <div style="font-family: var(--font-heading); font-size: 1.8rem; color: #B7791F;">${i18n.t('finalScore')} ${this.timeAttackScore} XP</div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-dark-muted);">${i18n.t('freshSlate')}</div>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-play" style="background: var(--color-pink); max-width: 260px;" onclick="window.appSelectTypoSnapMode('time-attack')">
                ${i18n.t('replayTimeAttack')}
              </button>
              <button class="btn-play" style="background: var(--color-purple); max-width: 240px;" onclick="window.appSelectTypoSnapMode('standard')">
                ${i18n.t('switchStandard')}
              </button>
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'time-attack' && !this.isTimeAttackFinished ? `
          <!-- Active Time Attack Card -->
          <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); max-width: 780px; margin: 0 auto; text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div id="time-attack-clock" style="background: #FFF5F5; padding: 0.5rem 1.2rem; border-radius: var(--radius-full); border: 3px solid var(--color-pink); font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--color-pink-dark);">
                ⏱️ ${this.timeRemaining}s
              </div>

              <div style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-purple); font-weight: 700;">
                ${i18n.getLang() === 'ka' ? 'ამოხსნილი' : 'Solved'}: ${this.wordsSolved}
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

            <!-- Target Graphic Illustration -->
            <div style="background: #FAF6FF; border: 3px solid var(--color-purple)20; border-radius: var(--radius-md); padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 6rem; line-height: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));">
                ${current.illustration}
              </div>
              <div style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-purple); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.08em;">
                ${i18n.t('category')} ${current.category}
              </div>
            </div>

            <!-- Incomplete Word Display -->
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

            <!-- Letter Choice Buttons -->
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              ${current.options.map(letter => `
                <button 
                  class="btn-play" 
                  style="width: 72px; height: 72px; border-radius: 20px; font-size: 2rem; background: var(--color-pink); box-shadow: 0 6px 16px rgba(255, 107, 107, 0.3);"
                  onclick="window.appSelectTypoSnapLetter('${letter}')"
                >
                  ${letter}
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'standard' && this.isCompleted ? `
          <!-- Standard Mode Summary Screen -->
          <div style="background: var(--color-surface); padding: 3.5rem 2rem; border-radius: var(--radius-lg); text-align: center; box-shadow: var(--shadow-card); max-width: 680px; margin: 0 auto;">
            <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounceAvatar 1.5s infinite;">🏆 🎯 🧩</div>
            <h1 style="color: var(--color-mint-dark); font-size: 2.5rem; margin-bottom: 0.5rem;">${i18n.t('sessionComplete')}</h1>
            <p style="font-size: 1.15rem; color: var(--color-dark-muted); margin-bottom: 1.5rem;">
              ${i18n.getLang() === 'ka' ? `შენ დაასრულე 15-სიტყვიანი ტური <strong>${this.score} ქულით</strong>!` : `You finished a 15-word practice run with <strong>${this.score} XP</strong>!`}
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button class="btn-play" style="background: var(--color-mint-dark); max-width: 260px;" onclick="window.appSelectTypoSnapMode('standard')">
                ${i18n.t('replayStandard')}
              </button>
              <button class="btn-play" style="background: var(--color-pink); max-width: 240px;" onclick="window.appSelectTypoSnapMode('time-attack')">
                ${i18n.t('tryTimeAttack')}
              </button>
            </div>
          </div>
        ` : ''}

        ${this.gameMode === 'standard' && !this.isCompleted ? `
          <!-- Active Standard Mode Card -->
          <div style="background: var(--color-surface); border-radius: var(--radius-lg); padding: 2.5rem; box-shadow: var(--shadow-card); max-width: 780px; margin: 0 auto; text-align: center;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
              <div style="background: #FFF5F5; padding: 0.4rem 1rem; border-radius: var(--radius-full); border: 2px solid var(--color-pink); font-family: var(--font-heading); font-weight: 700; color: var(--color-pink-dark);">
                ${i18n.t('streakText')} ${this.streak}x
              </div>

              <div style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-dark-muted);">
                ${i18n.t('word')} ${this.currentIndex + 1} ${i18n.t('of')} ${this.words.length}
              </div>

              <div style="background: #FFFDF0; padding: 0.4rem 1rem; border-radius: var(--radius-full); border: 2px solid var(--color-yellow); font-family: var(--font-heading); font-weight: 700; color: #B7791F;">
                ${i18n.t('scoreText')} ${this.score}
              </div>
            </div>

            <!-- Target Graphic Illustration -->
            <div style="background: #FAF6FF; border: 3px solid var(--color-purple)20; border-radius: var(--radius-md); padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <div style="font-size: 6rem; line-height: 1; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.1));">
                ${current.illustration}
              </div>
              <div style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-purple); margin-top: 0.5rem; text-transform: uppercase; letter-spacing: 0.08em;">
                ${i18n.t('category')} ${current.category}
              </div>
            </div>

            <!-- Incomplete Word Display -->
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

            <!-- Letter Options -->
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
          </div>
        ` : ''}
      </div>
    `;
  }
}

import { progressService } from '../../core/services/progress.service.js';
import { i18n } from '../../core/services/i18n.service.js';

export class ParentModalComponent {
  constructor() {
    this.isUnlocked = false;
    this.activeTab = 'words'; // 'words' | 'stories'
    
    // Generate fresh random math equation on modal initialization
    this.generateRandomEquation();
  }

  generateRandomEquation() {
    const isAddition = Math.random() > 0.3; // 70% addition, 30% subtraction
    if (isAddition) {
      const num1 = Math.floor(Math.random() * 50) + 15;
      const num2 = Math.floor(Math.random() * 40) + 10;
      this.num1 = num1;
      this.num2 = num2;
      this.operator = '+';
      this.targetAnswer = num1 + num2;
    } else {
      const num1 = Math.floor(Math.random() * 50) + 40;
      const num2 = Math.floor(Math.random() * 30) + 10;
      this.num1 = num1;
      this.num2 = num2;
      this.operator = '-';
      this.targetAnswer = num1 - num2;
    }

    this.equationText = `${this.num1} ${this.operator} ${this.num2} = ?`;
  }

  render() {
    const customWords = progressService.getCustomWords();

    return `
      <div class="modal-backdrop" id="parent-modal">
        <div class="modal-box" style="max-width: 650px;">
          <button class="modal-close" onclick="window.appCloseParentModal()">✕</button>

          ${!this.isUnlocked ? `
            <!-- Parent Gate Security Verification -->
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔒</div>
              <h2 style="color: var(--color-purple); font-size: 1.8rem; margin-bottom: 0.5rem;">${i18n.t('parentGateTitle')}</h2>
              <p style="color: var(--color-dark-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">${i18n.t('parentGateSub')}</p>

              <div style="background: #F7F9FC; border: 2px solid #E2E8F0; padding: 1.25rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.8rem; color: var(--color-purple); margin-bottom: 1.5rem; letter-spacing: 0.05em;">
                ${i18n.getLang() === 'ka' ? 'რას უდრის' : 'What is'} ${this.equationText}
              </div>

              <input 
                type="number" 
                id="parent-pin-input" 
                placeholder="${i18n.getLang() === 'ka' ? 'შეიყვანეთ პასუხი' : 'Enter answer'} (e.g. 99)" 
                style="width: 100%; padding: 0.9rem; border-radius: var(--radius-md); border: 2px solid #E2E8F0; font-family: var(--font-heading); font-size: 1.2rem; text-align: center; outline: none; margin-bottom: 1.25rem;"
              >

              <button class="btn-play" style="background: var(--color-purple);" onclick="window.appVerifyParentPin()">
                ${i18n.t('unlockParentBtn')}
              </button>
            </div>
          ` : `
            <!-- Unlocked Parent Control Center -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 2px solid #F0F0F0;">
                <h2 style="color: var(--color-purple); font-size: 1.6rem;">⚙️ ${i18n.getLang() === 'ka' ? 'მშობლის მართვის პანელი' : 'Parent Content Engine'}</h2>
                <span style="background: var(--color-mint)20; color: var(--color-mint-dark); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
                  Unlocked Mode
                </span>
              </div>

              <!-- Tab Navigation Bar -->
              <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
                <button 
                  onclick="window.appSelectParentTab('words')" 
                  style="flex: 1; padding: 0.6rem; border-radius: var(--radius-sm); border: 2px solid var(--color-purple); font-family: var(--font-heading); font-size: 0.95rem; cursor: pointer; background: ${this.activeTab === 'words' ? 'var(--color-purple)' : '#fff'}; color: ${this.activeTab === 'words' ? '#fff' : 'var(--color-purple)'};"
                >
                  ${i18n.t('customWordsTab')}
                </button>
                <button 
                  onclick="window.appSelectParentTab('stories')" 
                  style="flex: 1; padding: 0.6rem; border-radius: var(--radius-sm); border: 2px solid var(--color-purple); font-family: var(--font-heading); font-size: 0.95rem; cursor: pointer; background: ${this.activeTab === 'stories' ? 'var(--color-purple)' : '#fff'}; color: ${this.activeTab === 'stories' ? '#fff' : 'var(--color-purple)'};"
                >
                  ${i18n.t('customStoriesTab')}
                </button>
              </div>

              ${this.activeTab === 'words' ? `
                <!-- Custom Words Panel (Up to 10 Words, Word Only) -->
                <div>
                  <h3 style="font-size: 1.2rem; color: var(--color-purple); margin-bottom: 0.5rem;">${i18n.t('addCustomWord')} (${customWords.length} / 10 Max)</h3>
                  <p style="font-size: 0.85rem; color: var(--color-dark-muted); margin-bottom: 1.25rem;">
                    ${i18n.getLang() === 'ka' ? 'შეიყვანეთ საკუთარი სიტყვები TypoSnap-ის სავარჯიშოდ!' : 'Input custom target words for TypoSnap spelling practice!'}
                  </p>

                  <form onsubmit="window.appSubmitCustomWord(event)" style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
                    <input 
                      type="text" 
                      id="custom-word-input" 
                      required 
                      placeholder="${i18n.t('enterWordPlaceholder')}" 
                      style="flex: 1; padding: 0.8rem; border-radius: var(--radius-sm); border: 2px solid #E2E8F0; font-family: var(--font-heading); font-size: 1rem;"
                    >
                    <button type="submit" class="btn-play" style="background: var(--color-mint-dark); padding: 0.8rem 1.5rem; font-size: 1rem;">
                      ${i18n.t('addWordBtn')}
                    </button>
                  </form>

                  <!-- Custom Word List Table -->
                  <div style="max-height: 220px; overflow-y: auto; border: 2px solid #E2E8F0; border-radius: var(--radius-md); padding: 0.5rem;">
                    ${customWords.length === 0 ? `
                      <div style="text-align: center; color: var(--color-dark-muted); padding: 1rem; font-size: 0.9rem;">
                        ${i18n.getLang() === 'ka' ? 'სიტყვები ჯერ არ არის დამატებული.' : 'No custom words added yet. Add up to 10 custom words above!'}
                      </div>
                    ` : `
                      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${customWords.map(w => `
                          <div style="display: flex; align-items: center; justify-content: space-between; background: #F7F9FC; padding: 0.6rem 1rem; border-radius: var(--radius-sm);">
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                              <span style="font-size: 1.2rem;">🧩</span>
                              <strong style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--color-purple);">${w.word}</strong>
                            </div>
                            <button onclick="window.appDeleteCustomWord('${w.id}')" style="background: #FFE3E3; color: var(--color-pink-dark); border: none; padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); cursor: pointer; font-weight: 700; font-size: 0.8rem;">
                              🗑️ ${i18n.getLang() === 'ka' ? 'წაშლა' : 'Delete'}
                            </button>
                          </div>
                        `).join('')}
                      </div>
                    `}
                  </div>
                </div>
              ` : `
                <!-- Custom Story Uploader Panel -->
                <form onsubmit="window.appSubmitCustomStory(event)">
                  <div style="margin-bottom: 1rem;">
                    <label style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); display: block; margin-bottom: 0.4rem;">${i18n.getLang() === 'ka' ? 'ტექსტის სათაური:' : 'Story Title:'}</label>
                    <input type="text" id="custom-story-title" required placeholder="e.g. Grandma's Garden Adventure" style="width: 100%; padding: 0.8rem; border-radius: var(--radius-sm); border: 2px solid #E2E8F0; font-family: var(--font-body);">
                  </div>

                  <div style="margin-bottom: 1rem;">
                    <label style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); display: block; margin-bottom: 0.4rem;">${i18n.t('uploadTxt')}:</label>
                    <input type="file" accept=".txt" onchange="window.appHandleTxtFileUpload(event)" style="margin-bottom: 0.75rem; width: 100%;">
                    
                    <textarea id="custom-story-content" rows="6" required placeholder="Paste story text here..." style="width: 100%; padding: 0.8rem; border-radius: var(--radius-sm); border: 2px solid #E2E8F0; font-family: var(--font-body); outline: none;"></textarea>
                  </div>

                  <button type="submit" class="btn-play" style="background: var(--color-mint-dark);">
                    💾 ${i18n.getLang() === 'ka' ? 'შენახვა YonRead-ში' : 'Save Story to YonRead Reader'}
                  </button>
                </form>
              `}
            </div>
          `}
        </div>
      </div>
    `;
  }
}

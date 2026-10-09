import { progressService } from '../../core/services/progress.service.js';
import { soundService } from '../../core/services/sound.service.js';

export class ParentModalComponent {
  isUnlocked: boolean = false;
  pinInput: string = '';
  storyTitle: string = '';
  storyContent: string = '';
  category: string = 'Custom Parent Story';
  readingLevel: string = 'Custom';

  render(): string {
    return `
      <div class="modal-backdrop" id="parent-modal">
        <div class="modal-box">
          <button class="modal-close" onclick="window.appCloseParentModal()">✕</button>

          ${!this.isUnlocked ? `
            <!-- Parent Gate Security Verification -->
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔒</div>
              <h2 style="color: var(--color-purple); font-size: 1.8rem; margin-bottom: 0.5rem;">Parent Control Gate</h2>
              <p style="color: var(--color-dark-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">Please answer the security math problem to enter Parent Control Mode.</p>

              <div style="background: #F7F9FC; border: 2px solid #E2E8F0; padding: 1.25rem; border-radius: var(--radius-md); font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-purple); margin-bottom: 1.5rem;">
                What is 4 + 3 = ?
              </div>

              <input 
                type="number" 
                id="parent-pin-input" 
                placeholder="Enter answer (e.g. 7)" 
                style="width: 100%; padding: 0.9rem; border-radius: var(--radius-md); border: 2px solid #E2E8F0; font-family: var(--font-heading); font-size: 1.2rem; text-align: center; outline: none; margin-bottom: 1.25rem;"
              >

              <button class="btn-play" style="background: var(--color-purple);" onclick="window.appVerifyParentPin()">
                🔓 Unlock Parent Mode
              </button>
            </div>
          ` : `
            <!-- Parent Control Content Uploader -->
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
                <h2 style="color: var(--color-purple); font-size: 1.6rem;">📤 Upload Custom Story for YonRead</h2>
                <span style="background: var(--color-mint)20; color: var(--color-mint-dark); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
                  Unlocked Mode
                </span>
              </div>

              <form onsubmit="window.appSubmitCustomStory(event)">
                <div style="margin-bottom: 1rem;">
                  <label style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); display: block; margin-bottom: 0.4rem;">Story Title:</label>
                  <input type="text" id="custom-story-title" required placeholder="e.g. Grandma's Garden Adventure" style="width: 100%; padding: 0.8rem; border-radius: var(--radius-sm); border: 2px solid #E2E8F0; font-family: var(--font-body);">
                </div>

                <div style="margin-bottom: 1rem;">
                  <label style="font-family: var(--font-heading); font-size: 0.9rem; color: var(--color-dark-muted); display: block; margin-bottom: 0.4rem;">Select .TXT File OR Paste Content:</label>
                  <input type="file" accept=".txt" onchange="window.appHandleTxtFileUpload(event)" style="margin-bottom: 0.75rem; width: 100%;">
                  
                  <textarea id="custom-story-content" rows="6" required placeholder="Paste story text here..." style="width: 100%; padding: 0.8rem; border-radius: var(--radius-sm); border: 2px solid #E2E8F0; font-family: var(--font-body); outline: none;"></textarea>
                </div>

                <button type="submit" class="btn-play" style="background: var(--color-mint-dark);">
                  💾 Save Story to YonRead Reader
                </button>
              </form>
            </div>
          `}
        </div>
      </div>
    `;
  }
}

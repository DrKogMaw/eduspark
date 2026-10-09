import { toolRegistry } from '../../core/services/tool-registry.service.js';
import { progressService } from '../../core/services/progress.service.js';
import { i18n } from '../../core/services/i18n.service.js';

export class DashboardComponent {
  constructor() {
    this.tools = toolRegistry.getRegisteredTools();
    this.stats = progressService.getStats();
  }

  render() {
    this.tools = toolRegistry.getRegisteredTools();
    this.stats = progressService.getStats();

    return `
      <div class="dashboard-hero">
        <div class="container">
          <div class="mascot-banner">
            <div class="mascot-text">
              <h1>${i18n.t('heroTitle')}</h1>
              <p>${i18n.t('heroSub')}</p>
            </div>
            <div class="mascot-avatar">🐲</div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="tools-grid">
          ${this.tools.map(tool => `
            <div class="tool-card" style="border-color: ${tool.enabled ? tool.bgColor : '#E2E8F0'};" onclick="window.appLaunchTool('${tool.route}', ${tool.enabled})">
              <span class="tool-badge" style="background: ${tool.bgColor}15; color: ${tool.bgColor};">
                ${tool.badgeText}
              </span>

              <div>
                <div class="tool-icon-circle" style="background: ${tool.bgColor}20; color: ${tool.bgColor};">
                  ${tool.icon}
                </div>
                <h2 class="tool-title" style="color: ${tool.bgColor};">${tool.name}</h2>
                <div class="tool-tagline">${tool.tagline}</div>
                <p class="tool-desc">${tool.description}</p>
              </div>

              <div>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-dark-muted); margin-bottom: 0.75rem;">
                  🎯 ${tool.ageRange}
                </div>
                <button class="btn-play" style="background: ${tool.enabled ? tool.bgColor : '#CBD5E1'}; cursor: ${tool.enabled ? 'pointer' : 'not-allowed'};">
                  ${tool.enabled ? i18n.t('startBtn') : i18n.t('unlocksSoon')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Kid Progress Quick Summary Banner -->
        <div style="background: var(--color-surface); padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 4rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="font-size: 3rem;">🏆</div>
            <div>
              <h3 style="font-size: 1.4rem; color: var(--color-purple);">${i18n.getLang() === 'ka' ? 'შენი სასწავლო პროგრესი' : 'Your Reading Journey'}</h3>
              <p style="color: var(--color-dark-muted); font-size: 0.95rem;">
                ${i18n.getLang() === 'ka' 
                  ? `შენ უკვე წაიკითხე <strong>${this.stats.wordsRead} სიტყვა</strong> და ამოხსენი <strong>${this.stats.spellingCorrect} მართლწერის სიტყვა</strong>!`
                  : `You've read <strong>${this.stats.wordsRead} words</strong> and solved <strong>${this.stats.spellingCorrect} spelling words</strong>!`}
              </p>
            </div>
          </div>
          <div style="display: flex; gap: 1rem;">
            <div style="text-align: center; background: #FFFDF0; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); border: 2px solid var(--color-yellow);">
              <div style="font-family: var(--font-heading); font-size: 1.5rem; color: #B7791F;">⭐ ${this.stats.totalStars}</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-dark-muted);">${i18n.t('stars')}</div>
            </div>
            <div style="text-align: center; background: #FFF5F5; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); border: 2px solid var(--color-pink);">
              <div style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-pink-dark);">🔥 ${this.stats.currentStreak} ${i18n.t('streak')}</div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-dark-muted);">${i18n.getLang() === 'ka' ? 'ყოველდღიური სერია' : 'Daily Streak'}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

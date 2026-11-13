/**
 * @file theme.js
 * @description Manages dark/light theme state, system preference detection,
 * and keyboard/palette theme toggling.
 */

const STORAGE_KEY = 'george_portfolio_theme';

export function getActiveTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // Ignore storage restriction
  }
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

export function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage restriction
  }

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    const labelSpan = toggleBtn.querySelector('.theme-toggle-label');
    if (labelSpan) {
      labelSpan.textContent = next === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
    toggleBtn.setAttribute('aria-label', `Switch to ${next === 'dark' ? 'light' : 'dark'} theme`);
  }
}

export function toggleTheme() {
  const current = getActiveTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme() {
  applyTheme(getActiveTheme());
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }
  window.addEventListener('portfolio:toggle-theme', () => {
    toggleTheme();
  });
}


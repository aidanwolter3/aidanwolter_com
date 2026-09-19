/**
 * app.js - Responsive view switcher & layout coordination
 */

(function () {
  const modeButtons = document.querySelectorAll('.mode-btn');

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getSavedPreference() {
    try {
      return localStorage.getItem('aw_view_mode_choice');
    } catch (e) {
      return null;
    }
  }

  function savePreference(mode) {
    try {
      localStorage.setItem('aw_view_mode_choice', mode);
    } catch (e) {}
  }

  function setViewMode(mode, userInitiated = false) {
    // If mobile and split was chosen, fall back to raycast
    if (isMobile() && mode === 'split') {
      mode = 'raycast';
    }

    document.body.classList.remove('view-split', 'view-terminal', 'view-raycast');
    document.body.classList.add(`view-${mode}`);

    modeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-view') === mode);
    });

    if (userInitiated) {
      savePreference(mode);
    }

    // Auto-focus terminal input if terminal is visible and not on mobile (avoids unwanted keyboard pop on phones)
    if (mode === 'terminal' && !isMobile()) {
      const termInput = document.getElementById('terminal-input');
      if (termInput) {
        setTimeout(() => termInput.focus(), 50);
      }
    }
  }

  // Determine initial mode:
  // 1. If user previously chose a mode, use it (adapting split -> raycast on mobile)
  // 2. Otherwise: Desktop defaults to 'terminal', Mobile defaults to 'raycast'
  function determineInitialMode() {
    const saved = getSavedPreference();
    if (saved && ['terminal', 'raycast', 'split'].includes(saved)) {
      return (isMobile() && saved === 'split') ? 'raycast' : saved;
    }
    return isMobile() ? 'raycast' : 'terminal';
  }

  // Set initial view
  setViewMode(determineInitialMode(), false);

  // Button click handlers
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-view');
      setViewMode(mode, true);
    });
  });

  // Dynamically respond to resize if user hasn't explicitly locked a mode
  let lastWasMobile = isMobile();
  window.addEventListener('resize', () => {
    const currentIsMobile = isMobile();
    if (currentIsMobile !== lastWasMobile) {
      lastWasMobile = currentIsMobile;
      // If no explicit user choice, automatically flip default
      if (!getSavedPreference()) {
        setViewMode(currentIsMobile ? 'raycast' : 'terminal', false);
      } else if (currentIsMobile && getSavedPreference() === 'split') {
        setViewMode('raycast', false);
      }
    }
  });

  // Global keyboard shortcuts: Alt+1 for Terminal, Alt+2 for Spotlight, Alt+3 for Split
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === '1') {
      setViewMode('terminal', true);
    } else if (e.altKey && e.key === '2') {
      setViewMode('raycast', true);
    } else if (e.altKey && e.key === '3') {
      setViewMode('split', true);
    }
  });
})();

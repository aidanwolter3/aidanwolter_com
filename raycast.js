/**
 * raycast.js - Option 2: Raycast / Spotlight Command Palette
 */

(function () {
  const triggerBar = document.getElementById('raycast-trigger-bar');
  const modalOverlay = document.getElementById('raycast-modal-overlay');
  const searchInput = document.getElementById('raycast-input');
  const resultsContainer = document.getElementById('raycast-results');
  const closeBtn = document.getElementById('raycast-close-btn');

  const detailModal = document.getElementById('detail-modal');
  const detailTitle = document.getElementById('detail-modal-title');
  const detailContent = document.getElementById('detail-modal-content');
  const detailClose = document.getElementById('detail-modal-close');

  let selectedIndex = 0;
  let filteredItems = [];
  let soundEnabled = true;

  // Web Audio Context for synthesized tactile mechanical clicks
  let audioCtx = null;
  function playKeyClick(type = 'click') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'select') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else {
        // Subtle tactile thud
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140 + Math.random() * 40, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.025);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.03);
      }
    } catch (e) {
      // Audio might be restricted until user interaction
    }
  }

  // Registry of commands and items
  const PALETTE_ITEMS = [
    {
      section: 'Career & Background',
      id: 'view-experience',
      icon: '🏢',
      title: 'Work Experience & History',
      subtitle: 'Google (Staff L6, 10+ yrs), Tyler JC, Garmin',
      badge: 'Timeline',
      action: () => openExperienceModal()
    },
    {
      section: 'Career & Background',
      id: 'view-education',
      icon: '🎓',
      title: 'Education & Degrees',
      subtitle: 'MS Electrical Eng & BS Computer Eng • LeTourneau',
      badge: 'Degrees',
      action: () => openEducationModal()
    },
    {
      section: 'Career & Background',
      id: 'view-skills',
      icon: '🛠️',
      title: 'Skills & Build Systems',
      subtitle: 'Rust, Go, C++, Python • GN, Ninja, Bazel',
      badge: 'Stack',
      action: () => openSkillsModal()
    },
    {
      section: 'Career & Background',
      id: 'read-bio',
      icon: '👤',
      title: 'About Aidan Wolter',
      subtitle: 'Staff Software Engineer @ Google • Boulder, CO',
      badge: 'Modal',
      action: () => openBioModal()
    },
    {
      section: 'Quick Actions',
      id: 'open-linkedin',
      icon: '💼',
      title: 'Open LinkedIn Profile',
      subtitle: 'linkedin.com/in/aidan-wolter-5218a46b',
      badge: 'External',
      action: () => window.open('https://www.linkedin.com/in/aidan-wolter-5218a46b/', '_blank')
    },
    {
      section: 'Quick Actions',
      id: 'open-github',
      icon: '🐙',
      title: 'Open GitHub Profile',
      subtitle: 'github.com/aidanwolter3',
      badge: 'External',
      action: () => window.open('https://github.com/aidanwolter3', '_blank')
    },
    {
      section: 'Quick Actions',
      id: 'copy-url',
      icon: '📋',
      title: 'Copy Profile URL',
      subtitle: 'https://aidanwolter.com',
      badge: 'Clipboard',
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        showTemporaryToast('Copied aidanwolter.com to clipboard!');
      }
    },
    {
      section: 'Projects',
      id: 'proj-fx-worktree',
      icon: '🦀',
      title: 'fx-worktree',
      subtitle: 'Rust • Fuchsia worktree manager for multi-checkout workflows',
      badge: 'Repo',
      action: () => openProjectModal('fx-worktree', 'Rust', 'https://github.com/aidanwolter3/fx-worktree', 
        `Fuchsia Worktree Manager written in Rust.<br><br>
        • Accelerates developer workflow by managing multiple isolated worktrees.<br>
        • Integrates with Fuchsia's build and checkout tools.`)
    },
    {
      section: 'Projects',
      id: 'proj-ticket',
      icon: '🎫',
      title: 'ticket',
      subtitle: 'Go • Agentic ticket management & CLI productivity utility',
      badge: 'Repo',
      action: () => openProjectModal('ticket', 'Go', 'https://github.com/aidanwolter3/ticket', 
        `Agentic ticket management utility written in Go.<br><br>
        • Streamlines bug tracking and task context directly within developer workspaces.<br>
        • Fast terminal-first interactions and lightweight state storage.`)
    },
    {
      section: 'Projects',
      id: 'proj-atlas-emu',
      icon: '🎮',
      title: 'atlas-emu',
      subtitle: 'C++ • Cross-platform NES emulator',
      badge: 'Repo',
      action: () => openProjectModal('atlas-emu', 'C++', 'https://github.com/aidanwolter3/atlas-emu', 
        `Cross-platform NES emulator developed in C++ as a side project.`)
    },
    {
      section: 'Preferences & Fun',
      id: 'toggle-sound',
      icon: '🔊',
      title: 'Toggle Key Click Sounds',
      subtitle: 'Synthesized mechanical switch audio',
      badge: 'Toggle',
      action: () => {
        soundEnabled = !soundEnabled;
        showTemporaryToast(`Tactile sound effects ${soundEnabled ? 'enabled' : 'disabled'}`);
      }
    },
    {
      section: 'Preferences & Fun',
      id: 'theme-dracula',
      icon: '🧛',
      title: 'Switch to Dracula Theme',
      subtitle: 'Classic purple & cyan palette',
      badge: 'Theme',
      action: () => {
        document.body.classList.remove('theme-matrix');
        document.body.classList.toggle('theme-dracula');
      }
    },
    {
      section: 'Preferences & Fun',
      id: 'theme-matrix',
      icon: '🟩',
      title: 'Switch to Matrix Cyberpunk Theme',
      subtitle: 'High contrast phosphor green',
      badge: 'Theme',
      action: () => {
        document.body.classList.remove('theme-dracula');
        document.body.classList.toggle('theme-matrix');
      }
    }
  ];

  // Open Raycast Modal
  function openPalette() {
    modalOverlay.classList.remove('hidden');
    searchInput.value = '';
    renderResults('');
    searchInput.focus();
    playKeyClick('select');
  }

  // Close Raycast Modal
  function closePalette() {
    modalOverlay.classList.add('hidden');
  }

  // Render search results
  function renderResults(query) {
    const cleanQuery = query.toLowerCase().trim();
    resultsContainer.innerHTML = '';

    if (!cleanQuery) {
      filteredItems = [...PALETTE_ITEMS];
    } else {
      filteredItems = PALETTE_ITEMS.filter(item => {
        return item.title.toLowerCase().includes(cleanQuery) ||
               item.subtitle.toLowerCase().includes(cleanQuery) ||
               item.section.toLowerCase().includes(cleanQuery);
      });
    }

    if (filteredItems.length === 0) {
      resultsContainer.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.88rem;">
          No matching commands for "${escapeHtml(query)}"
        </div>`;
      return;
    }

    if (selectedIndex >= filteredItems.length) {
      selectedIndex = 0;
    }

    // Group items by section
    let currentSection = '';
    filteredItems.forEach((item, index) => {
      if (item.section !== currentSection) {
        currentSection = item.section;
        const sectionLabel = document.createElement('div');
        sectionLabel.className = 'result-section-label';
        sectionLabel.innerText = currentSection;
        resultsContainer.appendChild(sectionLabel);
      }

      const row = document.createElement('div');
      row.className = `result-item ${index === selectedIndex ? 'selected' : ''}`;
      row.innerHTML = `
        <div class="result-left">
          <span class="result-icon">${item.icon}</span>
          <div>
            <span class="result-title">${escapeHtml(item.title)}</span>
            <span class="result-sub">${escapeHtml(item.subtitle)}</span>
          </div>
        </div>
        <span class="result-badge">${escapeHtml(item.badge)}</span>
      `;

      row.addEventListener('click', () => {
        playKeyClick('select');
        executeItem(item);
      });

      row.addEventListener('mouseenter', () => {
        selectedIndex = index;
        updateSelectedHighlight();
      });

      resultsContainer.appendChild(row);
    });

    scrollSelectedItemIntoView();
  }

  function updateSelectedHighlight() {
    const rows = resultsContainer.querySelectorAll('.result-item');
    rows.forEach((r, idx) => {
      r.classList.toggle('selected', idx === selectedIndex);
    });
    scrollSelectedItemIntoView();
  }

  function scrollSelectedItemIntoView() {
    const selected = resultsContainer.querySelector('.result-item.selected');
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' });
    }
  }

  function executeItem(item) {
    closePalette();
    if (item && item.action) {
      item.action();
    }
  }

  // Modals for details
  function openBioModal() {
    detailTitle.innerText = 'About Aidan Wolter';
    detailContent.innerHTML = `
      <p style="margin-bottom: 12px;">
        I'm a Staff Software Engineer at Google based in Boulder, Colorado.
      </p>
      <p style="margin-bottom: 12px;">
        Over the past 10+ years at Google, my work has centered on core platform infrastructure and developer productivity tooling across <strong>fuchsia.dev</strong>, <strong>chromium.org</strong>, and <strong>source.android.com</strong>.
      </p>
      <p style="margin-bottom: 12px;">
        <strong>Core Stack:</strong> Rust, Go, C++, Python.
      </p>
      <p style="margin-bottom: 12px;">
        <strong>Build Systems:</strong> GN, Ninja, Bazel.
      </p>
      <p style="margin-bottom: 16px;">
        <strong>Focus Areas:</strong> Systems programming & infrastructure, developer tooling & workflows, and open source contributions.
      </p>
      <div style="display: flex; gap: 16px; margin-top: 10px; flex-wrap: wrap;">
        <a href="https://github.com/aidanwolter3" target="_blank" class="subtle-link" style="font-weight: 600;">
          GitHub (@aidanwolter3) →
        </a>
        <a href="https://www.linkedin.com/in/aidan-wolter-5218a46b/" target="_blank" class="subtle-link" style="font-weight: 600;">
          LinkedIn Profile →
        </a>
      </div>
    `;
    detailModal.classList.remove('hidden');
  }

  function openSkillsModal() {
    detailTitle.innerText = 'Technical Skills & Focus Areas';
    detailContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; line-height: 1.5;">
        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">Programming Languages</div>
          <div style="color: var(--accent-green); font-size: 0.88rem; font-family: var(--font-mono); margin-top: 2px;">
            Rust, Go, C++, Python
          </div>
        </div>

        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">Build Systems</div>
          <div style="color: var(--accent-cyan); font-size: 0.88rem; font-family: var(--font-mono); margin-top: 2px;">
            GN, Ninja, Bazel
          </div>
        </div>

        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">Platforms & Infrastructure</div>
          <div style="color: var(--accent-amber); font-size: 0.85rem; margin-top: 2px;">
            fuchsia.dev, chromium.org, source.android.com, Linux
          </div>
        </div>

        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.95rem;">Focus Areas</div>
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">
            Systems programming & infrastructure, developer tooling & workflows, open source contributions.
          </div>
        </div>
      </div>
    `;
    detailModal.classList.remove('hidden');
  }

  function openExperienceModal() {
    detailTitle.innerText = 'Work Experience & History';
    detailContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 18px; line-height: 1.5;">
        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.98rem;">Google</div>
          <div style="color: var(--accent-green); font-size: 0.85rem; font-family: var(--font-mono);">Staff Software Engineer (L6) • Aug 2016 – Present</div>
          <div style="color: var(--text-secondary); font-size: 0.82rem; margin-top: 4px;">
            Platform infrastructure & developer tooling across <strong>fuchsia.dev</strong>, <strong>chromium.org</strong>, and <strong>source.android.com</strong>.
          </div>
        </div>

        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.98rem;">Tyler Junior College</div>
          <div style="color: var(--accent-cyan); font-size: 0.85rem; font-family: var(--font-mono);">Adjunct Professor (Part-time) • Jan 2022 – May 2023</div>
          <div style="color: var(--text-secondary); font-size: 0.82rem; margin-top: 4px;">
            Tyler, Texas, United States.
          </div>
        </div>

        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.98rem;">Garmin International</div>
          <div style="color: var(--accent-amber); font-size: 0.85rem; font-family: var(--font-mono);">Software Engineering Intern • May 2014 – Dec 2015</div>
          <div style="color: var(--text-secondary); font-size: 0.82rem; margin-top: 4px;">
            Fitness software platforms (low-power wearable drivers, embedded C) & Aviation flight control systems servos.
          </div>
        </div>

        <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 4px;">
          <div style="font-weight: 600; color: #fff; font-size: 0.95rem; margin-bottom: 8px;">Education & Degrees</div>
          <div style="margin-bottom: 8px;">
            <div style="color: var(--accent-cyan); font-weight: 500; font-size: 0.88rem;">M.S. in Electrical Engineering (2015 – 2016)</div>
            <div style="color: var(--text-secondary); font-size: 0.8rem;">LeTourneau University</div>
          </div>
          <div>
            <div style="color: var(--accent-cyan); font-weight: 500; font-size: 0.88rem;">B.S. in Computer Engineering (2011 – 2015)</div>
            <div style="color: var(--text-secondary); font-size: 0.8rem;">LeTourneau University</div>
          </div>
        </div>
      </div>
    `;
    detailModal.classList.remove('hidden');
  }

  function openEducationModal() {
    detailTitle.innerText = 'Education & Degrees';
    detailContent.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; line-height: 1.5;">
        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.98rem;">M.S. in Electrical Engineering</div>
          <div style="color: var(--accent-green); font-size: 0.85rem; font-family: var(--font-mono);">2015 – 2016</div>
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">LeTourneau University</div>
        </div>

        <div>
          <div style="font-weight: 600; color: #fff; font-size: 0.98rem;">B.S. in Computer Engineering</div>
          <div style="color: var(--accent-cyan); font-size: 0.85rem; font-family: var(--font-mono);">2011 – 2015</div>
          <div style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 2px;">LeTourneau University</div>
        </div>
      </div>
    `;
    detailModal.classList.remove('hidden');
  }

  function openProjectModal(name, lang, url, desc) {
    detailTitle.innerText = `${name} [${lang}]`;
    detailContent.innerHTML = `
      <div style="margin-bottom: 16px; line-height: 1.6;">${desc}</div>
      <a href="${url}" target="_blank" class="subtle-link" style="font-weight: 600; font-size: 0.9rem;">
        View on GitHub (${url.replace('https://github.com/', '')}) →
      </a>
    `;
    detailModal.classList.remove('hidden');
  }

  function showTemporaryToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #1e2436;
      border: 1px solid var(--accent-cyan);
      color: #fff;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.85rem;
      box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      z-index: 300;
      animation: modal-enter 0.2s ease;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Keyboard navigation
  searchInput.addEventListener('input', (e) => {
    playKeyClick('type');
    selectedIndex = 0;
    renderResults(e.target.value);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      playKeyClick('type');
      if (filteredItems.length > 0) {
        selectedIndex = (selectedIndex + 1) % filteredItems.length;
        updateSelectedHighlight();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playKeyClick('type');
      if (filteredItems.length > 0) {
        selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
        updateSelectedHighlight();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        playKeyClick('select');
        executeItem(filteredItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      closePalette();
    }
  });

  // Global keyboard shortcuts (Cmd+K or Ctrl+K)
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modalOverlay.classList.contains('hidden')) {
        openPalette();
      } else {
        closePalette();
      }
    } else if (e.key === 'Escape') {
      closePalette();
      detailModal.classList.add('hidden');
    }
  });

  // Click listeners
  triggerBar.addEventListener('click', openPalette);
  closeBtn.addEventListener('click', closePalette);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closePalette();
  });

  detailClose.addEventListener('click', () => {
    detailModal.classList.add('hidden');
  });
  detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) detailModal.classList.add('hidden');
  });

  // Pinned cards click listeners
  const miniCards = document.querySelectorAll('.project-mini-card');
  miniCards.forEach(card => {
    card.addEventListener('click', () => {
      const repo = card.getAttribute('data-repo');
      const item = PALETTE_ITEMS.find(i => i.id === `proj-${repo}`);
      if (item) {
        item.action();
      }
    });
  });

})();

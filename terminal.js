/**
 * terminal.js - Option 1: Modern Unix Terminal
 */

(function () {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const matrixCanvas = document.getElementById('matrix-canvas');
  const matrixBtn = document.getElementById('term-matrix-btn');
  const copyBtn = document.getElementById('term-copy-btn');
  const quickPills = document.querySelectorAll('.pane-terminal .pill');

  // Command History
  const history = [];
  let historyIndex = -1;

  // Matrix Rain State
  let matrixRunning = false;
  let matrixInterval = null;

  // Available Commands & Auto-complete list
  const COMMANDS = [
    'help',
    'whoami',
    'experience',
    'education',
    'neofetch',
    'projects',
    'skills',
    'github',
    'linkedin',
    'contact',
    'theme',
    'matrix',
    'date',
    'clear',
    'history',
    'sudo',
    'echo'
  ];

  // Initial Welcome Banner
  function printWelcome() {
    const welcomeHtml = `
<div class="term-entry">
  <div class="term-result">
<span class="term-cyan term-bold">Welcome to Aidan Wolter's Workstation v2.4 (darwin-arm64)</span>
Type <span class="term-yellow term-bold">'help'</span> to see available commands or click the quick pills below.
Try <span class="term-green term-bold">'experience'</span> or <span class="term-green term-bold">'projects'</span> for an overview.
  </div>
</div>`;
    terminalOutput.innerHTML = welcomeHtml;
  }

  // Handle Command Execution
  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add to history
    history.push(trimmed);
    historyIndex = history.length;

    // Echo command line
    const echoDiv = document.createElement('div');
    echoDiv.className = 'term-entry';
    echoDiv.innerHTML = `
      <div class="term-command-echo">
        <span class="term-prompt-prefix">aidan@workstation ~ %</span>
        <span class="term-command-text">${escapeHtml(trimmed)}</span>
      </div>
    `;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const resultDiv = document.createElement('div');
    resultDiv.className = 'term-result';

    switch (cmd) {
      case 'help':
        resultDiv.innerHTML = `
<span class="term-cyan term-bold">AVAILABLE COMMANDS:</span>
  <span class="term-yellow">whoami</span>       - Professional summary & focus
  <span class="term-yellow">experience</span>   - Career history & platforms (Google, Garmin)
  <span class="term-yellow">education</span>    - Degrees & academic background (BS/MS LeTourneau)
  <span class="term-yellow">projects</span>     - Selected open-source & engineering projects
  <span class="term-yellow">skills</span>       - Languages, build systems & domains
  <span class="term-yellow">neofetch</span>     - System specs & developer summary
  <span class="term-yellow">linkedin</span>     - Open Aidan's LinkedIn profile
  <span class="term-yellow">github</span>       - Open Aidan's GitHub profile (@aidanwolter3)
  <span class="term-yellow">contact</span>      - Professional links
  <span class="term-yellow">matrix</span>       - Toggle interactive digital rain canvas
  <span class="term-yellow">theme</span>        - Change theme (<span class="term-dim">default | dracula | matrix</span>)
  <span class="term-yellow">clear</span>        - Clear terminal screen
  <span class="term-yellow">date</span>         - Display current local time`;
        break;

      case 'whoami':
        resultDiv.innerHTML = `
<span class="term-bold term-green">Aidan Wolter</span>
Staff Software Engineer at Google (Remote / Boulder, Colorado).
10+ years working across Google platform infrastructure: fuchsia.dev, chromium.org, source.android.com.
Focus: Systems programming & infrastructure, developer tooling & workflows, open source contributions.
Education: MS Electrical Eng & BS Computer Eng (LeTourneau University).
GitHub: <a class="term-link" href="https://github.com/aidanwolter3" target="_blank">@aidanwolter3</a> • LinkedIn: <a class="term-link" href="https://www.linkedin.com/in/aidan-wolter-5218a46b/" target="_blank">in/aidan-wolter</a>`;
        break;

      case 'experience':
        resultDiv.innerHTML = `
<span class="term-cyan term-bold">CAREER & WORK EXPERIENCE:</span>

• <span class="term-bold term-yellow">Google</span> (Aug 2016 – Present • 10+ yrs)
  <span class="term-green">Staff Software Engineer (L6)</span> • Remote / Boulder, CO
  Engineering across core Google platform infrastructure:
  - <span class="term-cyan">fuchsia.dev</span> (Fuchsia operating system)
  - <span class="term-cyan">chromium.org</span> (Chromium browser engine)
  - <span class="term-cyan">source.android.com</span> (Android Open Source Project)

• <span class="term-bold term-yellow">Tyler Junior College</span> (Jan 2022 – May 2023)
  <span class="term-green">Adjunct Professor</span> (Part-time) • Tyler, Texas

• <span class="term-bold term-yellow">Garmin International</span> (May 2015 – Dec 2015)
  <span class="term-green">Software Engineering Intern</span> • Fitness Software Platforms
  Embedded C development for wearable platforms, sensor and low-power memory drivers.

• <span class="term-bold term-yellow">Garmin International</span> (May 2014 – Aug 2014)
  <span class="term-green">Software Engineering Intern</span> • Aviation Servos (AFCS)
  Embedded C module testing & Windows tools in C and C++.

• <span class="term-bold term-yellow">Education & Degrees</span>:
  - <span class="term-green">M.S. in Electrical Engineering</span> (2015 – 2016) • LeTourneau University
  - <span class="term-green">B.S. in Computer Engineering</span> (2011 – 2015) • LeTourneau University
  - <span class="term-dim">Math Lab Tutor, Achievement Center (2013)</span>`;
        break;

      case 'education':
        resultDiv.innerHTML = `
<span class="term-cyan term-bold">EDUCATION & DEGREES:</span>

• <span class="term-bold term-yellow">M.S. in Electrical Engineering</span> (2015 – 2016)
  <span class="term-green">LeTourneau University</span>

• <span class="term-bold term-yellow">B.S. in Computer Engineering</span> (2011 – 2015)
  <span class="term-green">LeTourneau University</span>`;
        break;

      case 'neofetch':
      case 'fastfetch':
        resultDiv.innerHTML = `
<span class="term-cyan">
       /\\         <span class="term-bold term-yellow">aidan</span><span class="term-dim">@</span><span class="term-bold term-yellow">workstation</span>
      /  \\        --------------------
     / /\\ \\       <span class="term-green">Role:</span> Staff Software Engineer (L6) @ Google
    / /__\\ \\      <span class="term-green">Location:</span> Boulder, Colorado
   /_/    \\_\\     <span class="term-green">Tenure:</span> 10+ years at Google
                  <span class="term-green">Platforms:</span> fuchsia.dev, chromium.org, source.android.com
                  <span class="term-green">Languages:</span> Rust, Go, C++, Python
                  <span class="term-green">Build Systems:</span> GN, Ninja, Bazel
                  <span class="term-green">Focus:</span> Systems, Infrastructure, Tooling
                  <span class="term-green">GitHub:</span> <a class="term-link" href="https://github.com/aidanwolter3" target="_blank">aidanwolter3</a>
                  <span class="term-green">LinkedIn:</span> <a class="term-link" href="https://www.linkedin.com/in/aidan-wolter-5218a46b/" target="_blank">in/aidan-wolter</a>
</span>`;
        break;

      case 'projects':
        resultDiv.innerHTML = `
<span class="term-cyan term-bold">FEATURED OPEN SOURCE & PROJECTS:</span>

1. <a class="term-link term-bold" href="https://github.com/aidanwolter3/fx-worktree" target="_blank">fx-worktree</a> <span class="term-yellow">[Rust]</span>
   Fuchsia worktree manager designed for isolated multi-checkout development workflows.

2. <a class="term-link term-bold" href="https://github.com/aidanwolter3/ticket" target="_blank">ticket</a> <span class="term-green">[Go]</span>
   Agentic ticket management & CLI productivity utility.

3. <a class="term-link term-bold" href="https://github.com/aidanwolter3/atlas-emu" target="_blank">atlas-emu</a> <span class="term-cyan">[C++]</span>
   Cross-platform NES emulator written in C++ (side project).

<span class="term-dim">Explore all repositories at <a class="term-link" href="https://github.com/aidanwolter3" target="_blank">github.com/aidanwolter3</a></span>`;
        break;

      case 'skills':
        resultDiv.innerHTML = `
<span class="term-cyan term-bold">TECHNICAL SKILLS & FOCUS AREAS:</span>
  • <span class="term-bold term-yellow">Languages:</span>      Rust, Go, C++, Python
  • <span class="term-bold term-cyan">Build Systems:</span>  GN, Ninja, Bazel
  • <span class="term-bold term-green">Platforms:</span>      fuchsia.dev, chromium.org, source.android.com, Linux
  • <span class="term-bold term-purple">Focus Areas:</span>    Systems programming & infrastructure, developer tooling & workflows, open source`;
        break;

      case 'github':
        resultDiv.innerHTML = `Opening GitHub profile in a new tab...`;
        window.open('https://github.com/aidanwolter3', '_blank');
        break;

      case 'linkedin':
        resultDiv.innerHTML = `Opening LinkedIn profile in a new tab...`;
        window.open('https://www.linkedin.com/in/aidan-wolter-5218a46b/', '_blank');
        break;

      case 'contact':
        resultDiv.innerHTML = `
<span class="term-cyan term-bold">GET IN TOUCH:</span>
  • LinkedIn: <a class="term-link" href="https://www.linkedin.com/in/aidan-wolter-5218a46b/" target="_blank">linkedin.com/in/aidan-wolter-5218a46b</a>
  • GitHub:   <a class="term-link" href="https://github.com/aidanwolter3" target="_blank">github.com/aidanwolter3</a>
  • Website:  <a class="term-link" href="https://aidanwolter.com" target="_blank">aidanwolter.com</a>`;
        break;

      case 'matrix':
        toggleMatrixRain();
        resultDiv.innerHTML = matrixRunning
          ? `<span class="term-green">Matrix digital rain engaged. Click 'Matrix' or type 'matrix' to toggle off.</span>`
          : `<span class="term-dim">Matrix digital rain disabled.</span>`;
        break;

      case 'theme':
        if (args.length > 0) {
          const target = args[0].toLowerCase();
          document.body.classList.remove('theme-matrix', 'theme-dracula');
          if (target === 'matrix') {
            document.body.classList.add('theme-matrix');
            resultDiv.innerHTML = `Switched theme to <span class="term-green">matrix</span>.`;
          } else if (target === 'dracula') {
            document.body.classList.add('theme-dracula');
            resultDiv.innerHTML = `Switched theme to <span class="term-purple">dracula</span>.`;
          } else {
            resultDiv.innerHTML = `Switched theme to <span class="term-cyan">default</span>.`;
          }
        } else {
          resultDiv.innerHTML = `Current themes available: <span class="term-cyan">default</span>, <span class="term-purple">dracula</span>, <span class="term-green">matrix</span>.\nUsage: theme [name]`;
        }
        break;

      case 'date':
        resultDiv.innerHTML = new Date().toLocaleString();
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        return;

      case 'history':
        resultDiv.innerHTML = history.map((h, i) => `  ${i + 1}  ${escapeHtml(h)}`).join('\n');
        break;

      case 'sudo':
        resultDiv.innerHTML = `<span class="term-red">aidan is not in the sudoers file. This incident will be reported.</span>`;
        break;

      case 'echo':
        resultDiv.innerHTML = escapeHtml(args.join(' '));
        break;

      default:
        resultDiv.innerHTML = `<span class="term-red">zsh: command not found: ${escapeHtml(cmd)}</span>. Type <span class="term-yellow">'help'</span> for available commands.`;
        break;
    }

    echoDiv.appendChild(resultDiv);
    terminalOutput.appendChild(echoDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Keyboard Navigation & Auto-complete
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex] || '';
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = terminalInput.value.trim();
      if (current) {
        const match = COMMANDS.find(c => c.startsWith(current));
        if (match) {
          terminalInput.value = match;
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      terminalOutput.innerHTML = '';
    }
  });

  // Keep focus on input when clicking terminal window
  terminalBody.addEventListener('click', (e) => {
    if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
      terminalInput.focus();
    }
  });

  // Quick pills click handler
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });

  // Title bar button actions
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const text = terminalOutput.innerText;
      navigator.clipboard.writeText(text).then(() => {
        const oldText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => { copyBtn.innerText = oldText; }, 1500);
      });
    });
  }

  if (matrixBtn) {
    matrixBtn.addEventListener('click', () => {
      toggleMatrixRain();
    });
  }

  // Matrix Rain Implementation
  function toggleMatrixRain() {
    matrixRunning = !matrixRunning;
    if (matrixRunning) {
      matrixCanvas.classList.remove('hidden');
      startMatrix();
      matrixBtn.style.color = 'var(--accent-green)';
    } else {
      matrixCanvas.classList.add('hidden');
      stopMatrix();
      matrixBtn.style.color = '';
    }
  }

  function startMatrix() {
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = terminalBody.clientWidth;
    matrixCanvas.height = terminalBody.clientHeight;

    const chars = '01AIDANWOLTER0101SYSTEMSRUSTGOC++';
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) drops[i] = 1;

    matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(13, 15, 23, 0.08)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

      ctx.fillStyle = '#34d399';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }, 45);
  }

  function stopMatrix() {
    if (matrixInterval) clearInterval(matrixInterval);
    const ctx = matrixCanvas.getContext('2d');
    ctx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  }

  // Initialize
  printWelcome();
})();

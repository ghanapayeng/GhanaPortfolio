/**
 * GHANA_OS // INTERACTIVE TERMINAL CLI & AUDIO SYNTHESIZER
 * Author: Ghana Kanta Payeng
 */

(function () {
  'use strict';

  // State Management
  const TerminalState = {
    history: [],
    historyIndex: -1,
    audioEnabled: false,
    audioContext: null,
    theme: 'cyber',
    activeProjects: {
      'blood-bridge': {
        name: 'Blood Bridge',
        type: 'Emergency Blood Donation & Inventory Network',
        tech: 'Java Spring Boot, MySQL, React, WebSocket',
        github: 'https://github.com/ghanapayeng/blood-bridge',
        status: 'PRODUCTION READY // 100% ONLINE',
        description: 'Connects blood donors, urgent patient requests, and hospital blood banks in real-time with emergency SMS/alert broadcasts and geolocation.'
      },
      'url-shortener': {
        name: 'URL Shortener Microservice',
        type: 'High-Concurrency Distributed Hash Redirection',
        tech: 'Java Spring Boot, Spring Data JPA, MySQL, Redis, React',
        github: 'https://github.com/ghanapayeng/url-shortener',
        status: 'BENCHMARKED // 12ms Latency',
        description: 'Engineered sub-15ms URL redirection service with Base62 encoding, custom aliases, QR generation, and real-time click geographic analytics.'
      }
    }
  };

  // Sound Synthesizer using Web Audio API (No external sound files required)
  function initAudio() {
    if (!TerminalState.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        TerminalState.audioContext = new AudioCtx();
      }
    }
    if (TerminalState.audioContext && TerminalState.audioContext.state === 'suspended') {
      TerminalState.audioContext.resume();
    }
  }

  function playKeyClickSound() {
    if (!TerminalState.audioEnabled || !TerminalState.audioContext) return;
    try {
      const ctx = TerminalState.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420 + Math.random() * 80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio error suppressed
    }
  }

  function playSuccessBeep() {
    if (!TerminalState.audioEnabled || !TerminalState.audioContext) return;
    try {
      const ctx = TerminalState.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      // Audio error suppressed
    }
  }

  // DOM Elements
  let terminalBody;
  let terminalHistory;
  let terminalInput;
  let audioToggleBtn;

  // Initialize Terminal on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    terminalBody = document.getElementById('terminal-body');
    terminalHistory = document.getElementById('terminal-history');
    terminalInput = document.getElementById('terminal-input');
    audioToggleBtn = document.getElementById('toggle-sound-btn');

    if (!terminalInput) return;

    // Terminal Input Event Listener
    terminalInput.addEventListener('keydown', handleTerminalKeydown);
    terminalInput.addEventListener('input', () => playKeyClickSound());

    // Click anywhere in terminal body to focus input
    if (terminalBody) {
      terminalBody.addEventListener('click', () => {
        terminalInput.focus();
      });
    }

    // Audio Toggle Handler
    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', toggleAudio);
    }

    // Mobile shortcut chips
    document.querySelectorAll('.shortcut-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const cmd = e.currentTarget.getAttribute('data-cmd');
        if (cmd) {
          executeCommand(cmd);
          terminalInput.focus();
        }
      });
    });

    // Theme selector buttons if present
    document.querySelectorAll('[data-theme-choice]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = e.currentTarget.getAttribute('data-theme-choice');
        setTheme(theme);
      });
    });
  });

  function toggleAudio() {
    initAudio();
    TerminalState.audioEnabled = !TerminalState.audioEnabled;
    if (audioToggleBtn) {
      audioToggleBtn.innerHTML = TerminalState.audioEnabled 
        ? '<i class="fas fa-volume-up"></i> SFX [ON]' 
        : '<i class="fas fa-volume-mute"></i> SFX [OFF]';
      audioToggleBtn.style.color = TerminalState.audioEnabled ? 'var(--term-green)' : '#fff';
    }
    if (TerminalState.audioEnabled) {
      playSuccessBeep();
    }
  }

  function setTheme(themeName) {
    const validThemes = ['cyber', 'matrix', 'amber', 'hacker', 'blood'];
    if (!validThemes.includes(themeName)) return false;
    document.body.setAttribute('data-theme', themeName);
    TerminalState.theme = themeName;
    return true;
  }

  function handleTerminalKeydown(e) {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();
      if (command) {
        TerminalState.history.push(command);
        TerminalState.historyIndex = TerminalState.history.length;
      }
      executeCommand(command);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (TerminalState.history.length > 0 && TerminalState.historyIndex > 0) {
        TerminalState.historyIndex--;
        terminalInput.value = TerminalState.history[TerminalState.historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (TerminalState.historyIndex < TerminalState.history.length - 1) {
        TerminalState.historyIndex++;
        terminalInput.value = TerminalState.history[TerminalState.historyIndex] || '';
      } else {
        TerminalState.historyIndex = TerminalState.history.length;
        terminalInput.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    }
  }

  function handleTabCompletion() {
    const current = terminalInput.value.trim().toLowerCase();
    const commands = ['help', 'projects', 'skills', 'about', 'clear', 'neofetch', 'contact', 'run blood-bridge', 'run url-shortener', 'theme', 'history', 'sudo hire-me'];
    const match = commands.find(c => c.startsWith(current));
    if (match) {
      terminalInput.value = match;
    }
  }

  function sanitizeCommand(raw) {
    if (!raw) return '';
    let s = raw.trim();
    // Strip leading shell prompt characters if user copied "$ help" or "> help" or "./help"
    s = s.replace(/^(\$|>|#|\.\/)\s*/, '');
    // Strip outer enclosing quotes e.g. 'help' or "help" or `help`
    s = s.replace(/^['"`]+|['"`]+$/g, '').trim();
    return s;
  }

  function executeCommand(rawCommand) {
    const rawClean = rawCommand ? rawCommand.trim() : '';
    if (!rawClean) return;

    // Sanitize to handle quotes like 'help' or "projects" or '$ help'
    const cmd = sanitizeCommand(rawClean);

    // Render command entry in history
    const entryEl = document.createElement('div');
    entryEl.className = 'terminal-entry';

    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-command-line';
    cmdLine.innerHTML = `<span class="prompt-user">ghana@portfolio</span>:<span class="prompt-dir">~$</span> <span class="prompt-char">${escapeHtml(cmd)}</span>`;
    entryEl.appendChild(cmdLine);

    const outputEl = document.createElement('div');
    outputEl.className = 'terminal-output';

    // Parse command tokens and strip individual token quotes
    const parts = cmd.split(/\s+/).map(p => p.replace(/^['"`]+|['"`]+$/g, '').trim()).filter(Boolean);
    const root = (parts[0] || '').toLowerCase().replace(/\(\)$/, ''); // Also handle help()
    const args = parts.slice(1);

    switch (root) {
      case 'help':
        outputEl.innerHTML = `
<div style="color: var(--accent); font-weight: 700; margin-bottom: 6px;">[ AVAILABLE SYSTEM COMMANDS ] (Click any command to execute)</div>
<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
  <tr><td style="width: 190px; padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('help')">help</code></td><td>Display this interactive command manual</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('projects')">projects, ls</code></td><td>List all software projects with direct links</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('run blood-bridge')">run blood-bridge</code></td><td>Execute Blood Bridge live simulation & GitHub repo</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('run url-shortener')">run url-shortener</code></td><td>Benchmark URL Shortener microservice</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('skills')">skills</code></td><td>Print technical stack matrix & proficiencies</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('about')">about, cat bio.txt</code></td><td>Display developer background & vision</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('neofetch')">neofetch</code></td><td>Display Ghana OS system architecture & hardware info</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('contact')">contact</code></td><td>Jump to connection terminal & send a transmission</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('theme matrix')">theme &lt;name&gt;</code></td><td>Switch visual theme (cyber, matrix, amber, hacker, blood)</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('sudo hire-me')">sudo hire-me</code></td><td>Send an expedited hire inquiry directly</td></tr>
  <tr><td style="padding: 3px 0;"><code style="color: var(--term-green); font-weight: 700; cursor: pointer; text-decoration: underline;" onclick="GhanaTerminal.execute('clear')">clear</code></td><td>Flush terminal buffer</td></tr>
</table>
        `;
        break;

      case 'clear':
        terminalHistory.innerHTML = '';
        return;

      case 'projects':
      case 'ls':
        outputEl.innerHTML = `
<div style="color: var(--accent); font-weight: 700; margin-bottom: 8px;">DIRECTORY: /usr/ghana/projects/ (2 Featured Systems)</div>
<div style="margin-bottom: 10px;">
  <span style="color: var(--term-green); font-weight: 700;">[1] blood-bridge/</span> 
  <span style="color: #cbd5e1;">- Emergency Blood Donation & Inventory Management</span><br>
  <span style="color: var(--text-muted); font-size: 0.78rem;">Stack: Java Spring Boot + MySQL + React + WebSocket</span><br>
  <span style="font-size: 0.8rem;">Action: Run <code style="color: var(--accent); cursor: pointer;" onclick="document.getElementById('terminal-input').value='run blood-bridge'; document.getElementById('terminal-input').focus();">run blood-bridge</code> | <a href="https://github.com/ghanapayeng/blood-bridge" target="_blank" style="color: var(--term-cyan); text-decoration: underline;">GitHub Repo [↗]</a></span>
</div>
<div style="margin-bottom: 10px;">
  <span style="color: var(--term-green); font-weight: 700;">[2] url-shortener/</span> 
  <span style="color: #cbd5e1;">- High-Concurrency Distributed URL Redirection Service</span><br>
  <span style="color: var(--text-muted); font-size: 0.78rem;">Stack: Java Spring Boot + MySQL + Redis + Base62</span><br>
  <span style="font-size: 0.8rem;">Action: Run <code style="color: var(--accent); cursor: pointer;" onclick="document.getElementById('terminal-input').value='run url-shortener'; document.getElementById('terminal-input').focus();">run url-shortener</code> | <a href="https://github.com/ghanapayeng/url-shortener" target="_blank" style="color: var(--term-cyan); text-decoration: underline;">GitHub Repo [↗]</a></span>
</div>
<div style="color: var(--text-dim); font-size: 0.75rem;">Tip: Type <code>run &lt;project-name&gt;</code> to test execution!</div>
        `;
        break;

      case 'run':
        const target = args[0] ? args[0].toLowerCase() : '';
        if (target === 'blood-bridge' || target === 'blood') {
          outputEl.className += ' output-success';
          outputEl.innerHTML = `
<div style="color: var(--term-red); font-weight: 700;">[EXECUTING: BLOOD BRIDGE BACKEND & CLIENT]</div>
<div style="color: #cbd5e1; font-size: 0.84rem; margin: 6px 0;">
  > Initializing Spring Boot Data JPA (MySQL) connection... [CONNECTED]<br>
  > Loading Blood Banks in Radius: 15 hospitals verified.<br>
  > WebSocket listener subscribed to emergency SOS broadcast.<br>
  > Emergency Matching Algorithm: Ready to match A+, B+, O-, AB+ donors.<br>
  > Status: <span style="color: var(--term-green); font-weight: 700;">LIVE & OPERATIONAL</span>
</div>
<div style="margin-top: 8px;">
  <a href="https://github.com/ghanapayeng/blood-bridge" target="_blank" class="btn-terminal btn-terminal-primary" style="padding: 4px 12px; font-size: 0.78rem; text-decoration: none; display: inline-flex; margin-right: 8px;">
    <i class="fab fa-github"></i> VIEW GITHUB REPO
  </a>
  <a href="#projects" class="btn-terminal btn-terminal-glass" style="padding: 4px 12px; font-size: 0.78rem; text-decoration: none; display: inline-flex;">
    <i class="fas fa-eye"></i> VIEW CARD DETAILS
  </a>
</div>
          `;
          playSuccessBeep();
        } else if (target === 'url-shortener' || target === 'shortener') {
          outputEl.className += ' output-success';
          outputEl.innerHTML = `
<div style="color: var(--term-green); font-weight: 700;">[BENCHMARKING: URL SHORTENER ENGINE]</div>
<div style="color: #cbd5e1; font-size: 0.84rem; margin: 6px 0;">
  > Spring Boot Redis Cache Layer: HIT (99.2% Hit Ratio)<br>
  > Base62 Hash Generator: Collision Probability < 0.000001%<br>
  > Average Redirect Latency: 11.8ms<br>
  > Real-time Click Telemetry: Active (MySQL analytics logging enabled)
</div>
<div style="margin-top: 8px;">
  <a href="https://github.com/ghanapayeng/url-shortener" target="_blank" class="btn-terminal btn-terminal-primary" style="padding: 4px 12px; font-size: 0.78rem; text-decoration: none; display: inline-flex; margin-right: 8px;">
    <i class="fab fa-github"></i> VIEW GITHUB REPO
  </a>
  <a href="#projects" class="btn-terminal btn-terminal-glass" style="padding: 4px 12px; font-size: 0.78rem; text-decoration: none; display: inline-flex;">
    <i class="fas fa-eye"></i> VIEW CARD DETAILS
  </a>
</div>
          `;
          playSuccessBeep();
        } else {
          outputEl.className += ' output-error';
          outputEl.innerHTML = `Error: Project '${escapeHtml(target || '')}' not recognized. Try: <code>run blood-bridge</code> or <code>run url-shortener</code>`;
        }
        break;

      case 'skills':
        outputEl.innerHTML = `
<div style="color: var(--accent); font-weight: 700; margin-bottom: 8px;">TECH STACK & CORE PROFICIENCIES:</div>
<div style="font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.8;">
  <div>Java / Spring Boot : [██████████████████░░] 92% (REST APIs, Microservices, Security)</div>
  <div>MySQL / Relational : [█████████████████░░░] 88% (Schema Design, Indexes, ACID)</div>
  <div>React.js / Web     : [████████████████░░░░] 82% (Hooks, State, Glass UI, Responsive)</div>
  <div>C / C++ Systems    : [█████████████████░░░] 85% (DSA, Low-level Memory, Algorithms)</div>
  <div>Python / Node.js   : [███████████████░░░░░] 78% (Scripting, Automation, Fast Services)</div>
  <div>Git / Linux Devops : [████████████████░░░░] 82% (CI/CD, Docker, Bash Automation)</div>
</div>
        `;
        break;

      case 'about':
      case 'cat':
        outputEl.innerHTML = `
<div style="color: #fff; font-weight: 700; margin-bottom: 6px;">Ghana Kanta Payeng // Software Engineer</div>
<div style="color: var(--text-muted); font-size: 0.86rem; line-height: 1.65;">
  Undergraduate Computer Science & Engineering student at Dibrugarh University Institute of Engineering & Technology (Class of 2027).<br><br>
  Passionate about scalable distributed architecture, backend design with Java Spring Boot & MySQL, and high-performance frontend interfaces. Proven track record in social impact initiatives, having led critical addiction survey research with Project Humanity and healthcare needs assessments with Jagriti Sanmilita Unnayan Kendra.
</div>
        `;
        break;

      case 'neofetch':
        outputEl.innerHTML = `
<div style="display: flex; gap: 20px; flex-wrap: wrap;">
  <pre style="color: var(--accent); font-family: var(--font-mono); font-size: 0.72rem; line-height: 1.2;">
   .---.
  /     \\     GHANA_OS @ DIBRUGARH_UNIV
 | () () |    -------------------------
  \\  _  /     OS: Ghana Linux x86_64
   || ||      Host: Dibrugarh Univ CSE '27
   || ||      Kernel: 6.8.0-ghana-dev
              Uptime: 21 Years of Innovation
              Packages: Java 25, Spring Boot, MySQL, React
              Shell: ghana-zsh 5.9
              Resolution: Responsive / Dual-Screen
              CPU: 8-Core Critical Thinker
              Memory: 32GB Continuous Learning
  </pre>
</div>
        `;
        break;

      case 'contact':
        outputEl.innerHTML = `
<div style="color: var(--term-green); font-weight: 700;">Routing to Connection Terminal...</div>
<div style="color: #cbd5e1; font-size: 0.82rem; margin-top: 4px;">
  Email: <a href="mailto:ghanakanta076@gmail.com" style="color: var(--accent);">ghanakanta076@gmail.com</a><br>
  LinkedIn: <a href="https://www.linkedin.com/in/ghana-payeng" target="_blank" style="color: var(--accent);">linkedin.com/in/ghana-payeng</a><br>
  GitHub: <a href="https://github.com/ghanapayeng" target="_blank" style="color: var(--accent);">github.com/ghanapayeng</a>
</div>
        `;
        // Scroll to bottom connect section
        const connectSection = document.getElementById('connect');
        if (connectSection) {
          connectSection.scrollIntoView({ behavior: 'smooth' });
        }
        break;

      case 'theme':
        const newTheme = args[0] ? args[0].toLowerCase() : '';
        if (setTheme(newTheme)) {
          outputEl.className += ' output-success';
          outputEl.textContent = `Theme switched to '${newTheme}' successfully.`;
        } else {
          outputEl.className += ' output-error';
          outputEl.textContent = `Usage: theme <cyber|matrix|amber|hacker|blood>`;
        }
        break;

      case 'sound':
        const soundChoice = args[0] ? args[0].toLowerCase() : '';
        if (soundChoice === 'on') {
          TerminalState.audioEnabled = false;
          toggleAudio();
          outputEl.textContent = 'Keyboard audio feedback enabled.';
        } else if (soundChoice === 'off') {
          TerminalState.audioEnabled = true;
          toggleAudio();
          outputEl.textContent = 'Audio feedback disabled.';
        } else {
          outputEl.textContent = `Current sound status: ${TerminalState.audioEnabled ? 'ON' : 'OFF'}. Use: sound on | sound off`;
        }
        break;

      case 'sudo':
        if (args[0] && args[0].toLowerCase() === 'hire-me') {
          outputEl.className += ' output-success';
          outputEl.innerHTML = `
<div style="color: var(--term-green); font-weight: 800; font-size: 1rem;">[ACCESS GRANTED // CONTRACT AUTHORIZED]</div>
<div style="margin: 6px 0; color: #fff;">
  Congratulations! You have unlocked direct recruitment priority.<br>
  Ghana Kanta Payeng is ready to build high-performance software for your team.
</div>
<a href="#connect" class="btn-terminal btn-terminal-primary" style="margin-top: 8px; padding: 6px 16px; font-size: 0.8rem; text-decoration: none; display: inline-flex;">
  CONNECT IMMEDIATELY [↗]
</a>
          `;
          playSuccessBeep();
        } else {
          outputEl.className += ' output-error';
          outputEl.textContent = `User is not in sudoers file. Try: sudo hire-me`;
        }
        break;

      case 'history':
        outputEl.innerHTML = TerminalState.history.map((h, i) => `${i + 1}  ${escapeHtml(h)}`).join('<br>');
        break;

      case 'date':
        outputEl.textContent = new Date().toUTCString();
        break;

      default:
        outputEl.className += ' output-error';
        outputEl.innerHTML = `command not found: <code>${escapeHtml(root)}</code>. Type <code>help</code> for available commands.`;
        break;
    }

    entryEl.appendChild(outputEl);
    terminalHistory.appendChild(entryEl);

    // Auto-scroll terminal body to bottom
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export functions to global scope for button clicks
  window.GhanaTerminal = {
    execute: executeCommand,
    setTheme: setTheme,
    toggleAudio: toggleAudio
  };

})();

/**
 * GHANA_OS // APPLICATION LOGIC & GLASSMORPHISM CONTROLLER
 * Matrix Rain, Scroll Spy, 3D Tilt, Modal Handlers & Spring Boot / MySQL + Email API Client
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Matrix Digital Rain Canvas
  initMatrixRain();

  // 2. Navigation Scroll Spy & Smooth Scroll
  initScrollSpy();

  // 3. 3D Tilt Effect on Project Cards
  initCardTilt();

  // 4. Modal Handlers (Certificates, Resume, Projects)
  initModals();

  // 5. Connect Form Handler (Spring Boot + MySQL + Direct Email to ghanakanta076@gmail.com)
  initConnectForm();

  // 6. CRT Scanline Toggle
  initCrtToggle();

  // 7. Ensure page opens at top (1st landing page) unless an anchor hash is provided
  if (!window.location.hash) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }
});

/* ==========================================================================
   1. MATRIX DIGITAL RAIN CANVAS
   ========================================================================== */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(1);
  });

  const chars = '01GHANAPAYENG2026{}[]<>/\\!*^~$_+-=ABCDEF';
  const fontSize = 14;
  let columns = Math.floor(width / fontSize);
  let drops = new Array(columns).fill(1);

  let matrixRunning = true;

  function draw() {
    if (!matrixRunning) return;

    ctx.fillStyle = 'rgba(7, 9, 14, 0.08)';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent') || '#00e5ff';
    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.985) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);

  // Toggle Matrix Button
  const toggleMatrixBtn = document.getElementById('toggle-matrix-btn');
  if (toggleMatrixBtn) {
    toggleMatrixBtn.addEventListener('click', () => {
      matrixRunning = !matrixRunning;
      canvas.style.display = matrixRunning ? 'block' : 'none';
      toggleMatrixBtn.style.color = matrixRunning ? 'var(--term-green)' : '#fff';
      toggleMatrixBtn.innerHTML = matrixRunning 
        ? '<i class="fas fa-network-wired"></i> MATRIX [ON]' 
        : '<i class="fas fa-eye-slash"></i> MATRIX [OFF]';
      if (matrixRunning) requestAnimationFrame(draw);
    });
  }
}

/* ==========================================================================
   2. SCROLL SPY & SMOOTH NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const navTabs = document.querySelectorAll('.nav-tab');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 180;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.getAttribute('href') === `#${currentId}`) {
          tab.classList.add('active');
        }
      });
    }
  });

  // Smooth click scroll
  navTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute('href');
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ==========================================================================
   3. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('.project-card, .connect-terminal-container');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
}

/* ==========================================================================
   4. MODAL MANAGEMENT
   ========================================================================== */
function initModals() {
  // Global modal open/close helpers
  window.openGhanaModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeGhanaModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close when clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   5. CONNECT WITH ME FORM (Spring Boot + MySQL + Direct Email: ghanakanta076@gmail.com)
   ========================================================================== */
function initConnectForm() {
  const form = document.getElementById('connect-form');
  const feedStatus = document.getElementById('form-feed-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  const BACKEND_API_URL = 'http://localhost:8080/api/v1/contact';
  const TARGET_EMAIL = 'ghanakanta076@gmail.com';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      updateFeedStatus('ERROR: Missing required fields (Name, Email, Message)', 'error');
      return;
    }

    // Disable button & show transmission progress
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> TRANSMITTING PACKET...';
    updateFeedStatus(`Transmitting payload to Spring Boot (MySQL persistence & dispatching email to ${TARGET_EMAIL})...`, 'progress');

    const payload = {
      name: name,
      email: email,
      subject: subject || 'Portfolio General Inquiry',
      message: message,
      timestamp: new Date().toISOString()
    };

    try {
      // Attempt connection to Spring Boot backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const resData = await response.json();
        const ticketId = (resData.data && resData.data.id) ? resData.data.id : (resData.id || 'CONFIRMED');
        updateFeedStatus(`✓ STATUS: 200 OK // Message stored in MySQL & email dispatched to ${TARGET_EMAIL}! [Ticket #${ticketId}]`, 'success');
        form.reset();
      } else {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
    } catch (err) {
      // Graceful offline fallback: Buffer locally in browser + provide direct mailto to ghanakanta076@gmail.com
      console.warn('Backend server currently offline, applying graceful local buffer:', err.message);

      const localQueue = JSON.parse(localStorage.getItem('ghana_buffered_messages') || '[]');
      localQueue.push(payload);
      localStorage.setItem('ghana_buffered_messages', JSON.stringify(localQueue));

      const mailtoUrl = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(`From: ${payload.name} (${payload.email})\n\nMessage:\n${payload.message}`)}`;

      updateFeedStatus(`
        ✓ BUFFERED LOCALLY. Local Spring Boot offline. 
        <br><a href="${mailtoUrl}" target="_blank" style="color: var(--term-green); text-decoration: underline; font-weight: 700;">
          [CLICK HERE TO SEND DIRECTLY TO ${TARGET_EMAIL}]
        </a>
      `, 'fallback');

      form.reset();
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> [ EXECUTE TRANSMISSION ]';
    }
  });

  function updateFeedStatus(msg, type) {
    if (!feedStatus) return;
    const dot = feedStatus.querySelector('.status-dot');
    const textSpan = feedStatus.querySelector('.status-text') || feedStatus;

    if (type === 'error') {
      if (dot) dot.style.background = 'var(--term-red)';
      textSpan.innerHTML = `<span style="color: var(--term-red); font-weight: 700;">${msg}</span>`;
    } else if (type === 'progress') {
      if (dot) dot.style.background = 'var(--term-amber)';
      textSpan.innerHTML = `<span style="color: var(--term-amber);">${msg}</span>`;
    } else if (type === 'success') {
      if (dot) dot.style.background = 'var(--term-green)';
      textSpan.innerHTML = `<span style="color: var(--term-green); font-weight: 700;">${msg}</span>`;
    } else {
      if (dot) dot.style.background = 'var(--term-cyan)';
      textSpan.innerHTML = `<span>${msg}</span>`;
    }
  }
}

/* ==========================================================================
   6. CRT SCANLINE EFFECT TOGGLE
   ========================================================================== */
function initCrtToggle() {
  const crtOverlay = document.querySelector('.crt-overlay');
  const toggleCrtBtn = document.getElementById('toggle-crt-btn');

  if (toggleCrtBtn && crtOverlay) {
    toggleCrtBtn.addEventListener('click', () => {
      crtOverlay.classList.toggle('disabled');
      const isEnabled = !crtOverlay.classList.contains('disabled');
      toggleCrtBtn.style.color = isEnabled ? 'var(--term-green)' : '#fff';
      toggleCrtBtn.innerHTML = isEnabled 
        ? '<i class="fas fa-tv"></i> CRT [ON]' 
        : '<i class="fas fa-tv"></i> CRT [OFF]';
    });
  }
}

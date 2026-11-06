/**
 * Malik Mohmmad Ausaib — Student Workspace & Digital Identity
 * Interactive Logic:
 * - Desktop ↔ Mobile presentation mode switcher (AUTO / DESKTOP / MOBILE)
 * - Mobile editorial navigation drawer overlay
 * - Tactile micro-interactions & dual email copy handlers
 * - Live Indian Standard Time (IST) clock for Kattankulathur, Chennai
 * - Theme switcher (Paper ⇄ Obsidian Ink)
 * - Project archive accordion (touch-optimized)
 * - Keyboard navigation & student sticky scratchpad
 * SRM KTR • 3rd Semester
 */

document.addEventListener('DOMContentLoaded', () => {
  const PERSONAL_EMAIL = 'malikausaib07@gmail.com';
  const STUDENT_EMAIL = 'ma1533@srmist.edu.in';

  const htmlRoot = document.documentElement;

  // ==========================================================================
  // 1. Live IST Clock (Kattankulathur, Chennai)
  // ==========================================================================
  const liveTimeEl = document.getElementById('live-time');
  const mobLiveTimeEl = document.getElementById('mob-live-time');

  function updateISTClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    try {
      const istString = new Intl.DateTimeFormat('en-GB', options).format(now);
      const text = `${istString} IST`;
      if (liveTimeEl) liveTimeEl.textContent = text;
      if (mobLiveTimeEl) mobLiveTimeEl.textContent = text;
    } catch {
      const pad = (n) => n.toString().padStart(2, '0');
      const text = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} IST`;
      if (liveTimeEl) liveTimeEl.textContent = text;
      if (mobLiveTimeEl) mobLiveTimeEl.textContent = text;
    }
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  // ==========================================================================
  // 2. Tactile Notification Banner
  // ==========================================================================
  const banner = document.getElementById('banner');
  const bannerText = document.getElementById('banner-text');
  let bannerTimeout;

  function showBanner(message) {
    if (!banner || !bannerText) return;
    clearTimeout(bannerTimeout);
    bannerText.textContent = message;
    banner.classList.add('show');
    bannerTimeout = setTimeout(() => {
      banner.classList.remove('show');
    }, 3200);
  }

  // ==========================================================================
  // 3. Desktop ↔ Mobile Presentation Mode Switcher
  // ==========================================================================
  const viewModeControl = document.getElementById('view-mode-control');
  const viewBtns = viewModeControl ? viewModeControl.querySelectorAll('.view-btn') : [];

  // Modes: 'auto', 'desktop', 'mobile'
  const savedViewMode = localStorage.getItem('malik_view_mode') || 'auto';
  applyViewMode(savedViewMode);

  function applyViewMode(mode) {
    htmlRoot.setAttribute('data-view-mode', mode);
    localStorage.setItem('malik_view_mode', mode);

    viewBtns.forEach(btn => {
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });

    const modeNames = {
      auto: 'AUTO (Adapts to device viewport)',
      desktop: 'DESKTOP (Editorial wide layout)',
      mobile: 'MOBILE (Deliberate touch layout)'
    };
    if (document.readyState === 'complete') {
      showBanner(`Presentation Mode: ${modeNames[mode] || mode.toUpperCase()}`);
    }
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedMode = btn.getAttribute('data-mode');
      applyViewMode(selectedMode);
    });
  });

  // ==========================================================================
  // 4. Mobile Editorial Navigation Drawer Overlay
  // ==========================================================================
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  const mobileNavLinks = document.querySelectorAll('.mob-link');

  function openMobileNav() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.add('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenuToggle.classList.add('is-active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNavOverlay) return;
    mobileNavOverlay.classList.remove('open');
    mobileNavOverlay.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.classList.remove('is-active');
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavOverlay && mobileNavOverlay.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileNav);
  }

  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) {
        closeMobileNav();
      }
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  // ==========================================================================
  // 5. Theme Toggle (Paper ⇄ Obsidian Ink)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const toggleModeText = document.querySelector('.toggle-mode-text');

  const savedTheme = localStorage.getItem('malik_theme') || 'paper';
  setTheme(savedTheme);

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('malik_theme', theme);
    if (toggleModeText) {
      toggleModeText.textContent = theme === 'paper' ? 'MODE: PAPER' : 'MODE: INK';
    }
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'paper';
    const nextTheme = currentTheme === 'paper' ? 'ink' : 'paper';
    setTheme(nextTheme);
    showBanner(`Theme switched to ${nextTheme.toUpperCase()}`);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // ==========================================================================
  // 6. Copy Email Handlers (Personal & Student)
  // ==========================================================================
  function copyTextToClipboard(text, successMessage, buttonEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showBanner(successMessage);
          if (buttonEl) {
            const originalText = buttonEl.innerHTML;
            buttonEl.classList.add('copied');
            const label = buttonEl.querySelector('.copy-label') || buttonEl.querySelector('.copy-text');
            if (label) label.textContent = 'COPIED!';
            setTimeout(() => {
              buttonEl.classList.remove('copied');
              buttonEl.innerHTML = originalText;
            }, 2400);
          }
        })
        .catch(() => {
          showBanner(`Address: ${text}`);
        });
    } else {
      showBanner(`Address: ${text}`);
    }
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetText = btn.getAttribute('data-copy');
      const isStudent = targetText.includes('srmist.edu.in');
      const msg = isStudent
        ? `Student email copied: ${targetText}`
        : `Personal email copied: ${targetText}`;
      copyTextToClipboard(targetText, msg, btn);
    });
  });

  const quickEmailCopy = document.getElementById('quick-email-copy');
  if (quickEmailCopy) {
    quickEmailCopy.addEventListener('click', () => {
      const email = quickEmailCopy.getAttribute('data-email') || PERSONAL_EMAIL;
      copyTextToClipboard(email, `Email copied: ${email}`, quickEmailCopy);
    });
  }

  // ==========================================================================
  // 7. Interactive Student Sticky Scratchpad
  // ==========================================================================
  const studentThoughts = [
    "Currently in 3rd semester at SRM KTR. Untangling graph traversal recursion, surviving lab records, and building this website with zero bloated UI libraries.",
    "Campus note: Kattankulathur is humid today. Spent 2 hours debugging why an array overflow broke a binary search implementation.",
    "Academic focus: Understanding Big-O space complexity in memory cache hierarchies rather than just memorizing formulas.",
    "Thought: Good software feels quiet and fast. No glowing purple blobs, no corporate buzzwords, just clean typography and crisp functionality.",
    "Hostel session: Discussing relational database normal forms (3NF vs BCNF) with classmates before the unit test."
  ];

  let thoughtIndex = 0;
  const cycleNoteBtn = document.getElementById('cycle-note-btn');
  const scratchpadText = document.getElementById('scratchpad-text');

  if (cycleNoteBtn && scratchpadText) {
    cycleNoteBtn.addEventListener('click', () => {
      thoughtIndex = (thoughtIndex + 1) % studentThoughts.length;
      scratchpadText.style.opacity = '0';
      scratchpadText.style.transform = 'translateY(4px)';
      setTimeout(() => {
        scratchpadText.textContent = `"${studentThoughts[thoughtIndex]}"`;
        scratchpadText.style.opacity = '1';
        scratchpadText.style.transform = 'translateY(0)';
      }, 150);
    });
    scratchpadText.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  }

  // ==========================================================================
  // 8. Project Archive Accordion (Touch + Click)
  // ==========================================================================
  window.toggleEntryDetails = function (button) {
    const article = button.closest('.archive-entry');
    if (!article) return;
    const drawer = article.querySelector('.entry-drawer');
    const symbol = button.querySelector('.btn-symbol');
    const btnText = button.querySelector('.btn-text');

    const isOpen = button.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      drawer.style.maxHeight = '0px';
      button.setAttribute('aria-expanded', 'false');
      article.classList.remove('is-expanded');
      if (symbol) symbol.textContent = '+';
      if (btnText) btnText.textContent = 'EXPLORE DETAILS';
    } else {
      drawer.style.maxHeight = drawer.scrollHeight + 'px';
      button.setAttribute('aria-expanded', 'true');
      article.classList.add('is-expanded');
      if (symbol) symbol.textContent = '−';
      if (btnText) btnText.textContent = 'COLLAPSE';
    }
  };

  document.querySelectorAll('.archive-entry').forEach(entry => {
    const mainRow = entry.querySelector('.entry-main-row');
    const btn = entry.querySelector('.entry-expand-btn');
    if (mainRow && btn) {
      mainRow.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('a')) {
          toggleEntryDetails(btn);
        }
      });
    }
  });

  // ==========================================================================
  // 9. Subtle Custom Dot Cursor (Fine Pointer Only)
  // ==========================================================================
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');

  if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const interactives = document.querySelectorAll('a, button, input, textarea, .archive-entry, .ledger-row');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '48px';
        cursor.style.height = '48px';
        cursor.style.borderColor = 'var(--accent)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '32px';
        cursor.style.height = '32px';
        cursor.style.borderColor = 'var(--accent)';
      });
    });
  }

  // ==========================================================================
  // 10. Minimalist Contact Form Handler
  // ==========================================================================
  const contactForm = document.getElementById('student-contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('form-submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (formToast) {
          formToast.textContent = 'Transmission logged. Thank you! Malik will check this during his lecture break at SRM KTR.';
          formToast.style.display = 'block';
        }
        contactForm.reset();
        showBanner('Transmission successfully logged.');

        setTimeout(() => {
          if (formToast) formToast.style.display = 'none';
        }, 7000);
      }, 750);
    });
  }

  // ==========================================================================
  // 11. Keyboard Shortcuts
  // ==========================================================================
  document.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    const key = e.key.toUpperCase();

    if (key === 'T') {
      toggleTheme();
    } else if (key === 'C') {
      copyTextToClipboard(PERSONAL_EMAIL, `Personal email copied: ${PERSONAL_EMAIL}`);
    } else if (key === 'M') {
      const currentMode = htmlRoot.getAttribute('data-view-mode') || 'auto';
      const modeCycle = { auto: 'desktop', desktop: 'mobile', mobile: 'auto' };
      applyViewMode(modeCycle[currentMode] || 'auto');
    } else if (key === 'ESCAPE') {
      closeMobileNav();
      document.querySelectorAll('.archive-entry').forEach(entry => {
        const btn = entry.querySelector('.entry-expand-btn');
        if (btn && btn.getAttribute('aria-expanded') === 'true') {
          toggleEntryDetails(btn);
        }
      });
    } else if (['1', '2', '3', '4', '5'].includes(key)) {
      const sectionMap = {
        '1': 'cover',
        '2': 'context',
        '3': 'ledger',
        '4': 'archive',
        '5': 'dispatch'
      };
      const target = document.getElementById(sectionMap[key]);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // ==========================================================================
  // 12. Animated Scroll Character (Falling / Grabbing / Hanging)
  // ==========================================================================
  const scrollChar = document.getElementById('scroll-character');

  if (scrollChar) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Character state
    let charState = 'falling'; // 'falling', 'hanging'
    let charY = 120; // current vertical position (px from top of page, in viewport)
    let lastScrollY = window.scrollY || window.pageYOffset;
    let scrollTimeout = null;
    let isScrolling = false;
    let animFrameId = null;

    const HEADER_OFFSET = 70; // stay below sticky header
    const HANG_DELAY = 400; // ms of inactivity before grabbing
    const CHAR_HEIGHT = 65;

    function getMaxY() {
      return window.innerHeight - CHAR_HEIGHT - 20;
    }

    function setCharState(newState) {
      if (charState === newState) return;
      charState = newState;
      scrollChar.classList.remove('is-falling', 'is-hanging');
      if (newState === 'falling') {
        scrollChar.classList.add('is-falling');
      } else if (newState === 'hanging') {
        scrollChar.classList.add('is-hanging');
      }
    }

    function updateCharPosition() {
      scrollChar.style.top = Math.round(charY) + 'px';
    }

    // On scroll: character falls downward with scrolling
    function onScroll() {
      const currentScrollY = window.scrollY || window.pageYOffset;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (!isScrolling) {
        isScrolling = true;
        setCharState('falling');
      }

      // Move character with scroll direction (gravity feel)
      charY += delta * 0.35;

      // Clamp within viewport
      const minY = HEADER_OFFSET;
      const maxY = getMaxY();
      charY = Math.max(minY, Math.min(maxY, charY));

      updateCharPosition();

      // Reset the scroll-stop timer
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        setCharState('hanging');
      }, HANG_DELAY);
    }

    // If reduced motion: just show static character, no animation
    if (prefersReducedMotion) {
      scrollChar.style.top = HEADER_OFFSET + 'px';
    } else {
      // Set initial state
      charY = HEADER_OFFSET;
      updateCharPosition();
      setCharState('hanging');

      // Use passive scroll listener for performance
      window.addEventListener('scroll', onScroll, { passive: true });

      // Handle touch scrolling on mobile
      let touchStartY = 0;
      window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      window.addEventListener('touchmove', () => {
        // Scroll event already fires on touch scroll, so this is handled
      }, { passive: true });

      window.addEventListener('touchend', () => {
        // Let the scroll timeout handle the transition to hanging
      }, { passive: true });
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      clearTimeout(scrollTimeout);
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener('scroll', onScroll);
    });
  }
});

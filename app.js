/**
 * Malik Mohmmad Ausaib — Student Workspace & Digital Identity
 * Interactive Logic: Tactile micro-interactions, IST clock, theme switcher,
 * expandable project ledger, sticky notes, keyboard shortcuts.
 * SRM KTR • 3rd Semester
 */

document.addEventListener('DOMContentLoaded', () => {
  const STUDENT_EMAIL = 'malik.ausaib@srmktr.edu.in';

  // 1. Live IST Clock (Kattankulathur, Chennai)
  const liveTimeEl = document.getElementById('live-time');
  function updateISTClock() {
    if (!liveTimeEl) return;
    const now = new Date();
    // Format to Indian Standard Time (UTC+5:30)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    try {
      const istString = new Intl.DateTimeFormat('en-GB', options).format(now);
      liveTimeEl.textContent = `${istString} IST`;
    } catch {
      liveTimeEl.textContent = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;
    }
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  // 2. Tactile Notification Banner
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

  // 3. Theme Toggle (Paper ⇄ Obsidian Ink)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const toggleModeText = document.querySelector('.toggle-mode-text');
  const htmlRoot = document.documentElement;

  // Load saved theme or default to 'paper'
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

  // 4. Copy Email Handler
  function copyEmail() {
    navigator.clipboard.writeText(STUDENT_EMAIL)
      .then(() => {
        showBanner(`Email copied to clipboard: ${STUDENT_EMAIL}`);
        const label = document.getElementById('copy-btn-label');
        if (label) {
          label.textContent = 'COPIED!';
          setTimeout(() => {
            label.textContent = 'COPY ADDRESS';
          }, 2500);
        }
      })
      .catch(() => {
        showBanner(`Address: ${STUDENT_EMAIL}`);
      });
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  const quickEmailCopy = document.getElementById('quick-email-copy');
  if (copyEmailBtn) copyEmailBtn.addEventListener('click', copyEmail);
  if (quickEmailCopy) quickEmailCopy.addEventListener('click', copyEmail);

  // 5. Interactive Student Sticky Scratchpad Thoughts
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

  // 6. Project Archive Accordion Toggle
  window.toggleEntryDetails = function(button) {
    const article = button.closest('.archive-entry');
    if (!article) return;
    const drawer = article.querySelector('.entry-drawer');
    const symbol = button.querySelector('.btn-symbol');
    const btnText = button.querySelector('.btn-text');

    const isOpen = button.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      drawer.style.maxHeight = '0px';
      button.setAttribute('aria-expanded', 'false');
      if (symbol) symbol.textContent = '+';
      if (btnText) btnText.textContent = 'EXPLORE DETAILS';
    } else {
      drawer.style.maxHeight = drawer.scrollHeight + 'px';
      button.setAttribute('aria-expanded', 'true');
      if (symbol) symbol.textContent = '−';
      if (btnText) btnText.textContent = 'COLLAPSE';
    }
  };

  // 7. Subtle Custom Dot Cursor
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

    // Enlarge cursor on interactive elements
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

  // 8. Minimalist Contact Form Handler
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
          formToast.textContent = 'Transmission logged. Thank you! Malik will check this during his lecture break.';
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

  // 9. Keyboard Navigation Shortcuts
  document.addEventListener('keydown', (e) => {
    // Ignore if typing in an input or textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    const key = e.key.toUpperCase();

    if (key === 'T') {
      toggleTheme();
    } else if (key === 'C') {
      copyEmail();
    } else if (key === 'ESCAPE') {
      // Close all open project drawers
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
});

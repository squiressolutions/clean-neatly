/* ─────────────────────────────────────────────────
   Cleaned Neatly LLC · Shared JavaScript
───────────────────────────────────────────────── */

const NAV_HTML = `
<nav id="main-nav">
  <a href="/" class="logo">
    <img src="/logo.png" alt="Cleaned Neatly LLC" class="logo-img">
    <div class="logo-text">
      Cleaned Neatly LLC
      <span class="logo-sub">Commercial Cleaning · St. Louis, MO</span>
    </div>
  </a>
  <ul class="nav-links">
    <li><a href="/services.html">Services</a></li>
    <li><a href="/about.html">About</a></li>
    <li><a href="/faq.html">FAQ</a></li>
    <li><a href="/contact.html">Contact</a></li>
    <li><a href="/quote.html" class="nav-cta">Free Quote</a></li>
  </ul>
  <button class="hamburger" id="hamburger" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
</nav>

<div class="mobile-menu" id="mobileMenu">
  <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Close menu">
    <i class="fa-solid fa-xmark"></i>
  </button>
  <a href="/services.html">Services</a>
  <a href="/about.html">About</a>
  <a href="/faq.html">FAQ</a>
  <a href="/contact.html">Contact</a>
  <a href="/quote.html" class="gold">Get a Free Quote</a>
</div>
`;

const FOOTER_HTML = `
<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="/" class="logo">
          <img src="/logo.png" alt="Cleaned Neatly LLC" class="logo-img" style="width:46px;height:46px;border-radius:50%;background:#fff;padding:2px;">
          <div class="logo-text footer-brand">
            Cleaned Neatly LLC
            <span class="logo-sub">Commercial Cleaning</span>
          </div>
        </a>
        <p class="footer-tagline">Professional commercial cleaning services for facilities and businesses across the St. Louis metro area.</p>
        <div class="footer-socials" style="margin-top:1.25rem;">
          <a href="https://www.facebook.com/cleanneatly" target="_blank" rel="noopener" class="footer-social" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/cleanneatly" target="_blank" rel="noopener" class="footer-social" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Services</div>
        <div class="footer-links">
          <a href="/services.html#offices">Offices &amp; Conference Rooms</a>
          <a href="/services.html#breakroom">Break Room &amp; Cafeteria</a>
          <a href="/services.html#restrooms">Restrooms</a>
          <a href="/services.html#lobby">Entry &amp; Lobby</a>
          <a href="/services.html#deepclean">Deep Cleaning</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Company</div>
        <div class="footer-links">
          <a href="/about.html">About Us</a>
          <a href="/faq.html">FAQ</a>
          <a href="/contact.html">Contact</a>
          <a href="/quote.html">Free Quote</a>
        </div>
      </div>
      <div>
        <div class="footer-col-title">Contact</div>
        <div class="footer-contact-line"><i class="fa-solid fa-phone"></i><a href="tel:3143256533">(314) 325-6533</a></div>
        <div class="footer-contact-line"><i class="fa-solid fa-envelope"></i><a href="mailto:cleanneatly1219@gmail.com">cleanneatly1219@gmail.com</a></div>
        <div class="footer-contact-line"><i class="fa-solid fa-clock"></i><span>Mon–Sat: 7am – 7pm</span></div>
        <div class="footer-contact-line"><i class="fa-solid fa-location-dot"></i><span>St. Louis Metro Area, MO</span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-copy">&copy; 2026 Cleaned Neatly LLC. All rights reserved.</div>
      <div class="footer-legal">Licensed &amp; Insured &nbsp;·&nbsp; St. Louis, MO</div>
    </div>
  </div>
</footer>
<div class="toast" id="toast"></div>
`;

/* ── Inject nav + footer ────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('nav-placeholder');
  if (navEl) navEl.outerHTML = NAV_HTML;

  const footerEl = document.getElementById('footer-placeholder');
  if (footerEl) footerEl.outerHTML = FOOTER_HTML;

  initNav();
  initScrollAnimations();
  initFAQ();
  initForms();
  markActiveLink();
});

/* ── Navigation ─────────────────────────────────── */
function initNav() {
  // Scroll shadow
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn   = document.getElementById('mobileMenuClose');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ── Active nav link ────────────────────────────── */
function markActiveLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '/' && href === '/') || (href !== '/' && path.startsWith(href.replace('.html', '')))) {
      a.classList.add('active');
    }
  });
}

/* ── Scroll Animations ──────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-up, .stagger-children').forEach(el => observer.observe(el));
}

/* ── FAQ Accordion ──────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer  = btn.nextElementSibling;
      const isOpen  = btn.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        btn.classList.add('open');
        answer.classList.add('open');
      }
    });
  });
}

/* ── Toast ──────────────────────────────────────── */
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast' + (isError ? ' error' : '') + ' show';
  setTimeout(() => t.classList.remove('show'), 5000);
}

/* ── Form Handlers ──────────────────────────────── */
function initForms() {
  // Quote form
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = quoteForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      const data = Object.fromEntries(new FormData(quoteForm));
      // Collect checkboxes
      data.services = [...quoteForm.querySelectorAll('input[name="services"]:checked')].map(c => c.value);

      try {
        const res = await fetch('/api/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          quoteForm.style.display = 'none';
          const success = document.getElementById('quoteSuccess');
          if (success) success.classList.add('show');
        } else {
          showToast('Something went wrong. Please try again.', true);
        }
      } catch {
        showToast('Something went wrong. Please try again.', true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      const data = Object.fromEntries(new FormData(contactForm));

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          contactForm.style.display = 'none';
          const success = document.getElementById('contactSuccess');
          if (success) success.classList.add('show');
        } else {
          showToast('Something went wrong. Please try again.', true);
        }
      } catch {
        showToast('Something went wrong. Please try again.', true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }
    });
  }
}

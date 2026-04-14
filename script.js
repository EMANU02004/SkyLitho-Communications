/* ════════════════════════════════════════════
   Skylitho Communications — main.js
════════════════════════════════════════════ */
 
// ── Mobile Nav Toggle ──────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
 
navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
  // Animate hamburger → X
  const spans = navToggle.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});
 
// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});
 
// ── Scroll-triggered fade-in ───────────────
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
 
// Pause all fade-up animations until visible
document.querySelectorAll('.fade-up').forEach(el => {
  // Hero items animate immediately; others wait for scroll
  if (!el.closest('.hero')) {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  }
});
 
// Animate non-.fade-up sections on scroll
const revealSections = document.querySelectorAll(
  '.machine-card, .service-item, .about-feature, .cd-item, .stat, .brands-row span'
);
 
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay for sibling elements
        const siblings = Array.from(entry.target.parentElement.children);
        const index = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 60);
        sectionObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);
 
revealSections.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  sectionObserver.observe(el);
});
 
// ── Sticky Nav shadow on scroll ───────────
const navWrap = document.querySelector('.nav-wrap');
window.addEventListener('scroll', () => {
  if (window.scrollY > 12) {
    navWrap.style.boxShadow = '0 2px 20px rgba(18,25,43,0.1)';
  } else {
    navWrap.style.boxShadow = 'none';
  }
}, { passive: true });
 
// ── Contact Form ──────────────────────────
const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');
 
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
 
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
 
  // Simple validation
  if (!name || !email || !message) {
    formMsg.textContent = 'Please fill in your name, email, and message.';
    formMsg.className   = 'form-note error';
    return;
  }
 
  if (!isValidEmail(email)) {
    formMsg.textContent = 'Please enter a valid email address.';
    formMsg.className   = 'form-note error';
    return;
  }
 
  // Simulate sending (replace with real API call)
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';
 
  setTimeout(() => {
    formMsg.textContent   = '✓ Message sent! We\'ll be in touch shortly.';
    formMsg.className     = 'form-note success';
    contactForm.reset();
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }, 1200);
});
 
// ── Newsletter Form ───────────────────────
const nlForm = document.getElementById('nlForm');
 
nlForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = nlForm.querySelector('input[type="email"]');
  const btn   = nlForm.querySelector('button');
 
  if (!isValidEmail(input.value.trim())) {
    input.style.outline = '2px solid #fca5a5';
    return;
  }
 
  input.style.outline = '';
  btn.disabled        = true;
  btn.textContent     = 'Subscribed ✓';
  btn.style.background = '#124d8c';
 
  setTimeout(() => {
    input.value      = '';
    btn.disabled     = false;
    btn.textContent  = 'Subscribe';
    btn.style.background = '';
  }, 3000);
});
 
// ── Active nav link on scroll ─────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
 
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--sky)';
    }
  });
}, { passive: true });
 
// ── Utility ───────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
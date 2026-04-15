/* ════════════════════════════════════════════
   Skylitho Communications — main.js
════════════════════════════════════════════ */

// ── Theme Toggle ──────────────────────────
const themeToggle = document.getElementById('themeToggle');
const savedTheme  = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── Mobile Nav Toggle ──────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
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

document.querySelectorAll('.fade-up').forEach(el => {
  if (!el.closest('.hero')) {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  }
});

const revealSections = document.querySelectorAll(
  '.machine-card, .service-item, .about-feature, .cd-item, .stat, .brands-row span'
);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
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
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  sectionObserver.observe(el);
});

// ── Sticky Nav shadow on scroll ───────────
const navWrap = document.querySelector('.nav-wrap');
window.addEventListener('scroll', () => {
  navWrap.style.boxShadow = window.scrollY > 12
    ? '0 2px 20px rgba(18,25,43,0.1)' : 'none';
}, { passive: true });

// ── Contact Form ──────────────────────────
const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

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

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending…';

  setTimeout(() => {
    formMsg.textContent   = 'Message sent! We\'ll be in touch shortly.';
    formMsg.className     = 'form-note success';
    contactForm.reset();
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }, 1200);
});

// ── EmailJS config ───────────────────────
const EMAILJS_PUBLIC_KEY  = '<YOUR_PUBLIC_KEY>';
const EMAILJS_SERVICE_ID  = '<YOUR_SERVICE_ID>';
const EMAILJS_TEMPLATE_ID = '<YOUR_TEMPLATE_ID>';
emailjs.init(EMAILJS_PUBLIC_KEY);

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
  btn.textContent     = 'Subscribing…';

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    subscriber_email: input.value.trim(),
  })
  .then(() => {
    btn.textContent      = 'Subscribed!';
    btn.style.background = '#124d8c';
    input.value          = '';
    setTimeout(() => {
      btn.disabled         = false;
      btn.textContent      = 'Subscribe';
      btn.style.background = '';
    }, 3000);
  })
  .catch(() => {
    btn.disabled    = false;
    btn.textContent = 'Try again';
    input.style.outline = '2px solid #fca5a5';
    setTimeout(() => {
      btn.textContent     = 'Subscribe';
      input.style.outline = '';
    }, 3000);
  });
});

// ── Active nav link on scroll ─────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--sky)' : '';
  });
}, { passive: true });

// ── Utility ───────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ══════════════════════════════════════════
// ADMIN PANEL
// ══════════════════════════════════════════
const ADMIN_PASSWORD    = 'skylitho2026';
const adminTrigger      = document.getElementById('adminTrigger');
const adminLoginOverlay = document.getElementById('adminLoginOverlay');
const adminLoginClose   = document.getElementById('adminLoginClose');
const adminLoginForm    = document.getElementById('adminLoginForm');
const loginMsg          = document.getElementById('loginMsg');
const adminOverlay      = document.getElementById('adminOverlay');
const adminClose        = document.getElementById('adminClose');
const adminForm         = document.getElementById('adminForm');
const adminMsg          = document.getElementById('adminMsg');
const adminList         = document.getElementById('adminList');
const imgUploadZone     = document.getElementById('imgUploadZone');
const imgInput          = document.getElementById('a-images');
const imgPreviewGrid    = document.getElementById('imgPreviewGrid');

let stagedImages = [];

// ── Image upload ──────────────────────────
imgUploadZone.addEventListener('click', () => imgInput.click());

imgUploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  imgUploadZone.classList.add('drag-over');
});
imgUploadZone.addEventListener('dragleave', () => imgUploadZone.classList.remove('drag-over'));
imgUploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  imgUploadZone.classList.remove('drag-over');
  readImageFiles(e.dataTransfer.files);
});
imgInput.addEventListener('change', () => readImageFiles(imgInput.files));

function readImageFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      stagedImages.push(e.target.result);
      renderImagePreviews();
    };
    reader.readAsDataURL(file);
  });
}

function renderImagePreviews() {
  imgPreviewGrid.innerHTML = '';
  stagedImages.forEach((src, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'img-preview-item';
    wrap.innerHTML = `<img src="${src}" alt="Preview" /><button type="button" class="img-remove" data-i="${i}">&times;</button>`;
    imgPreviewGrid.appendChild(wrap);
  });
  imgPreviewGrid.querySelectorAll('.img-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      stagedImages.splice(Number(btn.dataset.i), 1);
      renderImagePreviews();
    });
  });
}

// ── Login ─────────────────────────────────
adminTrigger.addEventListener('click', () => adminLoginOverlay.classList.remove('hidden'));

adminLoginClose.addEventListener('click', () => {
  adminLoginOverlay.classList.add('hidden');
  adminLoginForm.reset();
  loginMsg.textContent = '';
});

adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (document.getElementById('adminPass').value === ADMIN_PASSWORD) {
    adminLoginOverlay.classList.add('hidden');
    adminLoginForm.reset();
    loginMsg.textContent = '';
    adminOverlay.classList.remove('hidden');
    renderAdminList();
  } else {
    loginMsg.textContent = 'Incorrect password.';
    loginMsg.className   = 'form-note error';
  }
});

adminClose.addEventListener('click', () => {
  adminOverlay.classList.add('hidden');
  adminForm.reset();
  stagedImages = [];
  imgPreviewGrid.innerHTML = '';
  adminMsg.textContent = '';
});

[adminOverlay, adminLoginOverlay].forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
});

// ── Storage ───────────────────────────────
function getAdminMachines() {
  return JSON.parse(localStorage.getItem('adminMachines') || '[]');
}
function saveAdminMachines(machines) {
  localStorage.setItem('adminMachines', JSON.stringify(machines));
}

// ── Render public cards ───────────────────
function renderPublicMachines() {
  const machines = getAdminMachines();
  const grid = document.querySelector('.machines-grid');
  grid.querySelectorAll('.admin-injected').forEach(el => el.remove());

  machines.forEach(m => {
    const spec1 = m.spec1Label && m.spec1Val
      ? `<li><span>${m.spec1Label}</span><strong>${m.spec1Val}</strong></li>` : '';
    const spec2 = m.spec2Label && m.spec2Val
      ? `<li><span>${m.spec2Label}</span><strong>${m.spec2Val}</strong></li>` : '';

    let imgAreaHTML;
    if (m.images && m.images.length > 0) {
      const slides = m.images.map((src, i) =>
        `<img class="mc-slide${i === 0 ? ' active' : ''}" src="${src}" alt="${m.model}" />`
      ).join('');
      const arrows = m.images.length > 1
        ? `<button class="mc-arrow mc-prev" aria-label="Previous">&#8249;</button>
           <button class="mc-arrow mc-next" aria-label="Next">&#8250;</button>` : '';
      const dots = m.images.length > 1
        ? `<div class="mc-dots">${m.images.map((_, i) =>
            `<span class="mc-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`
          ).join('')}</div>` : '';
      imgAreaHTML = `<div class="mc-slideshow">${slides}${arrows}${dots}</div>`;
    } else {
      imgAreaHTML = `<div class="mc-graphic">${m.brand.substring(0, 3).toUpperCase()}</div>`;
    }

    const card = document.createElement('article');
    card.className = 'machine-card admin-injected';
    card.dataset.avail = m.badge === 'new' ? 'New' : 'Available';
    card.innerHTML = `
      <div class="mc-img">
        ${imgAreaHTML}
        <span class="mc-badge ${m.badge}">${m.badge === 'new' ? 'New' : 'Available'}</span>
      </div>
      <div class="mc-body">
        <p class="mc-brand">${m.brand} · ${m.category}</p>
        <h3 class="mc-title">${m.model}</h3>
        <ul class="mc-specs">
          <li><span>Year</span><strong>${m.year}</strong></li>
          <li><span>Condition</span><strong>${m.condition}</strong></li>
          ${spec1}${spec2}
        </ul>
        <a href="#contact" class="btn btn-outline btn-sm">Request Info</a>
      </div>`;
    grid.appendChild(card);

    if (m.images && m.images.length > 1) initSlideshow(card);

    card.style.opacity   = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    sectionObserver.observe(card);
  });
}

function initSlideshow(card) {
  const slides = Array.from(card.querySelectorAll('.mc-slide'));
  const dots   = Array.from(card.querySelectorAll('.mc-dot'));
  let current  = 0;

  function goTo(n) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  const prev = card.querySelector('.mc-prev');
  const next = card.querySelector('.mc-next');
  if (prev) prev.addEventListener('click', (e) => { e.preventDefault(); goTo(current - 1); });
  if (next) next.addEventListener('click', (e) => { e.preventDefault(); goTo(current + 1); });
  dots.forEach((dot, i) => dot.addEventListener('click', (e) => { e.preventDefault(); goTo(i); }));
}

// ── Render admin list ─────────────────────
function renderAdminList() {
  const machines = getAdminMachines();
  if (machines.length === 0) { adminList.innerHTML = ''; return; }
  adminList.innerHTML = `<h4>Added Machines (${machines.length})</h4>`;
  machines.forEach((m, i) => {
    const thumb = m.images && m.images.length > 0
      ? `<img src="${m.images[0]}" class="admin-thumb" alt="" />` : '';
    const item = document.createElement('div');
    item.className = 'admin-machine-item';
    item.innerHTML = `
      ${thumb}
      <div><strong>${m.brand} ${m.model}</strong><span> · ${m.year} · ${m.condition}</span></div>
      <button class="admin-delete" data-index="${i}">Remove</button>`;
    adminList.appendChild(item);
  });
  adminList.querySelectorAll('.admin-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      const machines = getAdminMachines();
      machines.splice(Number(btn.dataset.index), 1);
      saveAdminMachines(machines);
      renderAdminList();
      renderPublicMachines();
    });
  });
}

// ── Add machine submit ────────────────────
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const machine = {
    brand:      document.getElementById('a-brand').value.trim(),
    category:   document.getElementById('a-category').value.trim(),
    model:      document.getElementById('a-model').value.trim(),
    year:       document.getElementById('a-year').value.trim(),
    condition:  document.getElementById('a-condition').value,
    badge:      document.getElementById('a-badge').value,
    spec1Label: document.getElementById('a-spec1-label').value.trim(),
    spec1Val:   document.getElementById('a-spec1-val').value.trim(),
    spec2Label: document.getElementById('a-spec2-label').value.trim(),
    spec2Val:   document.getElementById('a-spec2-val').value.trim(),
    images:     [...stagedImages],
  };

  const machines = getAdminMachines();
  machines.push(machine);
  saveAdminMachines(machines);
  renderPublicMachines();
  renderAdminList();

  adminForm.reset();
  stagedImages = [];
  imgPreviewGrid.innerHTML = '';
  adminMsg.textContent = 'Machine added successfully.';
  adminMsg.className   = 'form-note success';
  setTimeout(() => { adminMsg.textContent = ''; }, 3000);
});

// Init
renderPublicMachines();

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

let stagedImages  = [];
let editingIndex  = null;

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

function compressImage(dataUrl, callback) {
  const img = new Image();
  img.onload = () => {
    const MAX_W = 1200, MAX_H = 900;
    let w = img.width, h = img.height;
    if (w > MAX_W) { h = Math.round(h * MAX_W / w); w = MAX_W; }
    if (h > MAX_H) { w = Math.round(w * MAX_H / h); h = MAX_H; }
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL('image/jpeg', 0.82));
  };
  img.src = dataUrl;
}

function readImageFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      compressImage(e.target.result, (compressed) => {
        stagedImages.push(compressed);
        renderImagePreviews();
      });
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
  resetAdminForm();
});

[adminOverlay, adminLoginOverlay].forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.add('hidden');
  });
});

// ── Storage ───────────────────────────────
const DEFAULT_MACHINES = [
  { id:'d1', brand:'KBA',       category:'Sheet-Fed Offset',  model:'Rapida RA 106-8',   year:'2018', condition:'Good',      badge:'new',       spec1Label:'Sheets',     spec1Val:'248M',        spec2Label:'Max Format', spec2Val:'740 × 1060 mm', images:[], unavailable:false },
  { id:'d2', brand:'Heidelberg',category:'Sheet-Fed Offset',  model:'CD 102-4',          year:'2007', condition:'Good',      badge:'available', spec1Label:'Sheets',     spec1Val:'495M',        spec2Label:'Max Format', spec2Val:'720 × 1020 mm', images:[], unavailable:false },
  { id:'d3', brand:'KBA',       category:'Sheet-Fed Offset',  model:'Rapida RA 105-5 LV',year:'2008', condition:'Good',      badge:'new',       spec1Label:'Sheets',     spec1Val:'250M',        spec2Label:'Output',     spec2Val:'18,000 sph',    images:[], unavailable:false },
  { id:'d4', brand:'Polar',     category:'Cutting Equipment', model:'Polar 92 ED',       year:'1996', condition:'Very Good', badge:'available', spec1Label:'Cuts',       spec1Val:'121M',        spec2Label:'Max Width',  spec2Val:'920 mm',        images:[], unavailable:false },
  { id:'d5', brand:'Polar',     category:'Cutting Equipment', model:'Polar 137 XT',      year:'2009', condition:'Good',      badge:'new',       spec1Label:'Cuts',       spec1Val:'1.9M',        spec2Label:'Max Width',  spec2Val:'1370 mm',       images:[], unavailable:false },
  { id:'d6', brand:'Komori',    category:'Sheet-Fed Offset',  model:'GL 640 C Hybrid',   year:'2016', condition:'Excellent', badge:'available', spec1Label:'Sheets',     spec1Val:'30M',         spec2Label:'Output',     spec2Val:'16,500 sph',    images:[], unavailable:false },
];

function getAdminMachines() {
  // Seed defaults on first load
  if (!localStorage.getItem('adminMachines')) {
    localStorage.setItem('adminMachines', JSON.stringify(DEFAULT_MACHINES));
  }
  return JSON.parse(localStorage.getItem('adminMachines'));
}
function saveAdminMachines(machines) {
  try {
    localStorage.setItem('adminMachines', JSON.stringify(machines));
    return true;
  } catch (e) {
    adminMsg.textContent = 'Save failed: storage limit reached. Try using smaller/fewer images.';
    adminMsg.className   = 'form-note error';
    return false;
  }
}

// ── Render public cards ───────────────────
function renderPublicMachines() {
  const machines = getAdminMachines();
  const grid = document.querySelector('.machines-grid');
  grid.innerHTML = '';

  machines.forEach(m => {
    if (m.unavailable) return;
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
    card.className = 'machine-card';
    card.dataset.avail = m.badge === 'new' ? 'New' : 'Available';
    const machineIndex = machines.indexOf(m);
    card.innerHTML = `
      <div class="mc-img">
        ${imgAreaHTML}
        <span class="mc-badge ${m.badge}">${m.badge === 'new' ? 'New' : 'Available'}</span>
        ${buildFavBtn(machineIndex)}
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

    card.querySelector('.fav-btn').addEventListener('click', () => toggleFavourite(machineIndex));

    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn, .btn, .mc-arrow, .mc-dot, a')) return;
      openMachineDetail(machineIndex);
    });

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
  const active   = machines.filter(m => !m.unavailable);
  const sold     = machines.filter(m =>  m.unavailable);

  if (machines.length === 0) {
    adminList.innerHTML = '<p style="color:var(--ink-soft);font-size:14px;margin-top:16px;">No machines added yet.</p>';
    return;
  }

  // ── Two-column layout ──
  adminList.innerHTML = `
    <div class="admin-cols-wrap">

      <!-- Left: Active Listings -->
      <div class="admin-col">
        <div class="admin-col-header">
          <h4>Manage Machines</h4>
          <span class="admin-count">${active.length}</span>
        </div>
        ${active.length === 0
          ? '<p class="admin-col-empty">No active listings.</p>'
          : `<table class="admin-table">
               <thead><tr>
                 <th>Image</th><th>Machine</th><th>Year</th><th>Actions</th>
               </tr></thead>
               <tbody id="adminTableBody"></tbody>
             </table>`
        }
      </div>

      <!-- Right: Sold History -->
      <div class="admin-col admin-col--history">
        <div class="admin-col-header">
          <h4>Sold History</h4>
          <span class="admin-count admin-count--sold">${sold.length}</span>
        </div>
        ${sold.length === 0
          ? '<p class="admin-col-empty">No sold machines yet.<br>Machines marked as sold will appear here.</p>'
          : `<table class="admin-table admin-history-table">
               <thead><tr>
                 <th>Image</th><th>Machine</th><th>Sold</th><th>Actions</th>
               </tr></thead>
               <tbody id="historyTableBody"></tbody>
             </table>`
        }
      </div>

    </div>`;

  // ── Populate active table ──
  if (active.length > 0) {
    const tbody = document.getElementById('adminTableBody');
    active.forEach(m => {
      const i     = machines.indexOf(m);
      const thumb = m.images && m.images.length > 0
        ? `<img src="${m.images[0]}" class="admin-thumb" alt="" />`
        : `<div class="admin-thumb-placeholder">${m.brand.substring(0,3).toUpperCase()}</div>`;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${thumb}</td>
        <td><strong>${m.brand} ${m.model}</strong><span class="admin-category">${m.category}</span></td>
        <td>${m.year}</td>
        <td class="admin-actions-cell">
          <button class="admin-edit" data-index="${i}">Edit</button>
          <button class="admin-toggle-avail" data-index="${i}">Mark Sold</button>
          <button class="admin-delete" data-index="${i}">Delete</button>
        </td>`;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.admin-edit').forEach(btn =>
      btn.addEventListener('click', () => editMachine(Number(btn.dataset.index)))
    );
    tbody.querySelectorAll('.admin-toggle-avail').forEach(btn =>
      btn.addEventListener('click', () => {
        const ms = getAdminMachines();
        ms[Number(btn.dataset.index)].unavailable = true;
        ms[Number(btn.dataset.index)].soldAt = new Date().toISOString();
        saveAdminMachines(ms);
        renderAdminList();
        renderPublicMachines();
      })
    );
    tbody.querySelectorAll('.admin-delete').forEach(btn =>
      btn.addEventListener('click', () => {
        if (!confirm('Delete this machine?')) return;
        const ms = getAdminMachines();
        ms.splice(Number(btn.dataset.index), 1);
        saveAdminMachines(ms);
        renderAdminList();
        renderPublicMachines();
      })
    );
  }

  // ── Populate history table ──
  if (sold.length > 0) {
    const histBody = document.getElementById('historyTableBody');
    sold.forEach(m => {
      const i        = machines.indexOf(m);
      const soldDate = m.soldAt
        ? new Date(m.soldAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
        : '—';
      const thumb = m.images && m.images.length > 0
        ? `<img src="${m.images[0]}" class="admin-thumb admin-thumb--sold" alt="" />`
        : `<div class="admin-thumb-placeholder admin-thumb-placeholder--sold">${m.brand.substring(0,3).toUpperCase()}</div>`;
      const tr = document.createElement('tr');
      tr.className = 'row-history';
      tr.innerHTML = `
        <td>${thumb}</td>
        <td><strong>${m.brand} ${m.model}</strong><span class="admin-category">${m.category}</span></td>
        <td><span class="history-sold-date">${soldDate}</span></td>
        <td class="admin-actions-cell">
          <button class="admin-restore" data-index="${i}">Restore</button>
          <button class="admin-delete" data-index="${i}">Delete</button>
        </td>`;
      histBody.appendChild(tr);
    });

    histBody.querySelectorAll('.admin-restore').forEach(btn =>
      btn.addEventListener('click', () => {
        const ms = getAdminMachines();
        ms[Number(btn.dataset.index)].unavailable = false;
        ms[Number(btn.dataset.index)].soldAt = null;
        saveAdminMachines(ms);
        renderAdminList();
        renderPublicMachines();
      })
    );
    histBody.querySelectorAll('.admin-delete').forEach(btn =>
      btn.addEventListener('click', () => {
        if (!confirm('Permanently delete this machine from history?')) return;
        const ms = getAdminMachines();
        ms.splice(Number(btn.dataset.index), 1);
        saveAdminMachines(ms);
        renderAdminList();
        renderPublicMachines();
      })
    );
  }
}

// ── Edit machine ──────────────────────────
function editMachine(index) {
  const machines = getAdminMachines();
  const m = machines[index];
  if (!m) return;

  editingIndex = index;

  document.getElementById('a-brand').value       = m.brand       || '';
  document.getElementById('a-category').value    = m.category    || '';
  document.getElementById('a-model').value       = m.model       || '';
  document.getElementById('a-year').value        = m.year        || '';
  document.getElementById('a-condition').value   = m.condition   || '';
  document.getElementById('a-badge').value       = m.badge       || 'available';
  document.getElementById('a-spec1-label').value = m.spec1Label  || '';
  document.getElementById('a-spec1-val').value   = m.spec1Val    || '';
  document.getElementById('a-spec2-label').value = m.spec2Label  || '';
  document.getElementById('a-spec2-val').value   = m.spec2Val    || '';

  stagedImages = m.images ? [...m.images] : [];
  renderImagePreviews();

  document.getElementById('adminSubmitBtn').textContent = 'Update Machine';
  document.getElementById('cancelEditBtn').style.display = 'block';
  document.querySelector('#adminOverlay .admin-header h3').textContent = 'Admin — Edit Machine';
  adminMsg.textContent = '';

  document.getElementById('adminForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAdminForm() {
  editingIndex = null;
  adminForm.reset();
  stagedImages = [];
  imgPreviewGrid.innerHTML = '';
  document.getElementById('adminSubmitBtn').textContent = 'Add Machine';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.querySelector('#adminOverlay .admin-header h3').textContent = 'Admin — Manage Machines';
  adminMsg.textContent = '';
}

document.getElementById('cancelEditBtn').addEventListener('click', resetAdminForm);

// ── Add / Update machine submit ───────────
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const machines = getAdminMachines();

  const data = {
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

  if (editingIndex !== null) {
    data.unavailable = machines[editingIndex].unavailable || false;
    data.id          = machines[editingIndex].id;
    machines[editingIndex] = data;
    if (!saveAdminMachines(machines)) return;
    renderPublicMachines();
    renderAdminList();
    resetAdminForm();
    adminMsg.textContent = 'Machine updated successfully.';
    adminMsg.className   = 'form-note success';
    setTimeout(() => { adminMsg.textContent = ''; }, 3000);
  } else {
    machines.push(data);
    if (!saveAdminMachines(machines)) return;
    renderPublicMachines();
    renderAdminList();
    resetAdminForm();
    adminMsg.textContent = 'Machine added successfully.';
    adminMsg.className   = 'form-note success';
    setTimeout(() => { adminMsg.textContent = ''; }, 3000);
  }
});

// ── Machine Detail Modal ─────────────────
function openMachineDetail(machineIndex) {
  const machines = getAdminMachines();
  const m = machines[machineIndex];
  if (!m) return;

  const content = document.getElementById('machineDetailContent');

  // Gallery
  let galleryHTML;
  if (m.images && m.images.length > 0) {
    const imgs = m.images.map((src, i) =>
      `<img class="md-slide${i === 0 ? ' active' : ''}" src="${src}" alt="${m.model}" />`
    ).join('');
    const counter = m.images.length > 1
      ? `<span class="md-img-count">1 / ${m.images.length}</span>` : '';
    const arrows = m.images.length > 1
      ? `<div class="md-gallery-arrows">
           <button class="md-arrow md-prev" aria-label="Previous">&#8249;</button>
           <button class="md-arrow md-next" aria-label="Next">&#8250;</button>
         </div>` : '';
    const dots = m.images.length > 1
      ? `<div class="md-gallery-dots">${m.images.map((_, i) =>
          `<button class="md-dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="Image ${i+1}"></button>`
        ).join('')}</div>` : '';
    galleryHTML = `<div class="md-gallery">${counter}${imgs}${arrows}${dots}</div>`;
  } else {
    galleryHTML = `<div class="md-gallery"><div class="md-graphic">${m.brand.substring(0,3).toUpperCase()}</div></div>`;
  }

  const specs = [
    { label: 'Year',      val: m.year },
    { label: 'Condition', val: m.condition },
    m.spec1Label && m.spec1Val ? { label: m.spec1Label, val: m.spec1Val } : null,
    m.spec2Label && m.spec2Val ? { label: m.spec2Label, val: m.spec2Val } : null,
  ].filter(Boolean);

  const specsHTML = specs.map(s =>
    `<div class="md-spec"><span>${s.label}</span><strong>${s.val}</strong></div>`
  ).join('');

  const actionHTML = m.unavailable
    ? '<button class="btn btn-full" disabled style="opacity:0.4;cursor:not-allowed;background:var(--border);color:var(--ink-soft);border:none;">Not Available</button>'
    : `<a href="#contact" class="btn btn-primary" onclick="document.getElementById('machineDetailOverlay').classList.add('hidden')">Request Info</a>`;

  content.innerHTML = `
    ${galleryHTML}
    <div class="md-body">
      <p class="md-brand">${m.brand} · ${m.category}</p>
      <div class="md-badge-row"><span class="md-badge ${m.badge}">${m.badge === 'new' ? 'New' : 'Available'}</span></div>
      <h2 class="md-title">${m.model}</h2>
      <div class="md-specs-grid">${specsHTML}</div>
      <div class="md-actions">${actionHTML}</div>
    </div>`;

  document.getElementById('machineDetailOverlay').classList.remove('hidden');

  // Init gallery slideshow
  if (m.images && m.images.length > 1) {
    const slides  = Array.from(content.querySelectorAll('.md-slide'));
    const dots    = Array.from(content.querySelectorAll('.md-dot'));
    const counter = content.querySelector('.md-img-count');
    let current   = 0;

    function mdGoTo(n) {
      slides[current].classList.remove('active');
      if (dots[current]) dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      if (dots[current]) dots[current].classList.add('active');
      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }

    content.querySelector('.md-prev').addEventListener('click', () => mdGoTo(current - 1));
    content.querySelector('.md-next').addEventListener('click', () => mdGoTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => mdGoTo(i)));
  }
}

document.getElementById('machineDetailClose').addEventListener('click', () => {
  document.getElementById('machineDetailOverlay').classList.add('hidden');
});
document.getElementById('machineDetailOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('machineDetailOverlay'))
    document.getElementById('machineDetailOverlay').classList.add('hidden');
});

// Init
renderPublicMachines();

// ── Favourites ──────────────────────────
function getFavourites() {
  return JSON.parse(localStorage.getItem('skylithoFavs') || '[]');
}
function saveFavourites(favs) {
  localStorage.setItem('skylithoFavs', JSON.stringify(favs));
}

function isFavourited(machineId) {
  return getFavourites().includes(String(machineId));
}

function toggleFavourite(machineId) {
  const favs = getFavourites();
  const id   = String(machineId);
  const idx  = favs.indexOf(id);
  if (idx === -1) favs.push(id);
  else favs.splice(idx, 1);
  saveFavourites(favs);
  renderPublicMachines();
  renderFavourites();
  updateFavNav();
}

function updateFavNav() {
  const count    = getFavourites().length;
  const navCount = document.getElementById('favNavCount');
  navCount.textContent = count > 0 ? count : '';
  const heartPath = document.querySelector('#favNavLink svg path');
  heartPath.setAttribute('fill', count > 0 ? '#e11d48' : 'none');
  document.getElementById('favNavLink').style.color = count > 0 ? '#e11d48' : '';
}

function buildFavBtn(machineId) {
  const active = isFavourited(machineId);
  return `<button class="fav-btn${active ? ' fav-active' : ''}" data-id="${machineId}" aria-label="${active ? 'Remove from favourites' : 'Add to favourites'}">
    <svg viewBox="0 0 24 24" fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  </button>`;
}

function renderFavourites() {
  const favs     = getFavourites();
  const machines = getAdminMachines();
  const content  = document.getElementById('favModalContent');

  if (favs.length === 0) {
    content.innerHTML = '<p style="color:var(--ink-soft);font-size:14px;padding:16px 0;">No favourites yet. Click the heart on any machine to save it here.</p>';
    return;
  }

  content.innerHTML = '<div class="fav-modal-actions"><button class="btn btn-outline btn-sm" id="clearFavourites">Clear All</button></div><div class="fav-modal-grid" id="favouritesGrid"></div>';
  document.getElementById('clearFavourites').addEventListener('click', () => {
    saveFavourites([]);
    renderPublicMachines();
    renderFavourites();
    updateFavNav();
  });

  const grid = document.getElementById('favouritesGrid');
  const favMachines = machines.filter((m, i) => favs.includes(String(i)));

  favMachines.forEach(m => {
    const origIndex = machines.indexOf(m);
    const spec1 = m.spec1Label && m.spec1Val ? `<li><span>${m.spec1Label}</span><strong>${m.spec1Val}</strong></li>` : '';
    const spec2 = m.spec2Label && m.spec2Val ? `<li><span>${m.spec2Label}</span><strong>${m.spec2Val}</strong></li>` : '';
    const imgAreaHTML = m.images && m.images.length > 0
      ? `<div class="mc-slideshow">${m.images.map((src, i) => `<img class="mc-slide${i===0?' active':''}" src="${src}" alt="${m.model}" />`).join('')}</div>`
      : `<div class="mc-graphic">${m.brand.substring(0,3).toUpperCase()}</div>`;

    const card = document.createElement('article');
    card.className = 'machine-card' + (m.unavailable ? ' mc-unavailable' : '');
    card.innerHTML = `
      <div class="mc-img">
        ${imgAreaHTML}
        <span class="mc-badge ${m.badge}">${m.badge === 'new' ? 'New' : 'Available'}</span>
        ${buildFavBtn(origIndex)}
        ${m.unavailable ? '<div class="mc-unavailable-overlay"><span>Unavailable</span></div>' : ''}
      </div>
      <div class="mc-body">
        <p class="mc-brand">${m.brand} · ${m.category}</p>
        <h3 class="mc-title">${m.model}</h3>
        <ul class="mc-specs">
          <li><span>Year</span><strong>${m.year}</strong></li>
          <li><span>Condition</span><strong>${m.condition}</strong></li>
          ${spec1}${spec2}
        </ul>
        ${m.unavailable
          ? '<button class="btn btn-full" disabled style="opacity:0.4;cursor:not-allowed;background:var(--border);color:var(--ink-soft);border:none;">Not Available</button>'
          : '<a href="#contact" class="btn btn-outline btn-sm">Request Info</a>'}
      </div>`;
    grid.appendChild(card);
    card.querySelector('.fav-btn').addEventListener('click', () => {
      toggleFavourite(origIndex);
      renderFavourites();
    });
    card.addEventListener('click', (e) => {
      if (e.target.closest('.fav-btn, .btn, .mc-arrow, .mc-dot, a')) return;
      openMachineDetail(origIndex);
    });
  });
}

// Open favourites modal
document.getElementById('favNavLink').addEventListener('click', (e) => {
  e.preventDefault();
  renderFavourites();
  document.getElementById('favOverlay').classList.remove('hidden');
});

// Close favourites modal
document.getElementById('favClose').addEventListener('click', () => {
  document.getElementById('favOverlay').classList.add('hidden');
});
document.getElementById('favOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('favOverlay'))
    document.getElementById('favOverlay').classList.add('hidden');
});

// Init favourites
updateFavNav();
renderFavourites();


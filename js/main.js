/* ─────────────────────────────────────────
   DRAGGABLE ELEMENTS (hero section)
───────────────────────────────────────── */
function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, originLeft, originTop;

  function onMouseDown(e) {
    e.preventDefault();
    isDragging = true;
    el.classList.add('dragging');

    // Bring to front
    el.style.zIndex = 50;

    startX = e.clientX;
    startY = e.clientY;
    originLeft = el.offsetLeft;
    originTop  = el.offsetTop;

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    el.style.left = (originLeft + dx) + 'px';
    el.style.top  = (originTop  + dy) + 'px';
  }

  function onMouseUp() {
    isDragging = false;
    el.classList.remove('dragging');
    el.style.zIndex = 10;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup',   onMouseUp);
  }

  // Touch support
  function onTouchStart(e) {
    e.preventDefault();
    const t = e.touches[0];
    isDragging = true;
    el.classList.add('dragging');
    el.style.zIndex = 50;

    startX = t.clientX;
    startY = t.clientY;
    originLeft = el.offsetLeft;
    originTop  = el.offsetTop;

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend',  onTouchEnd);
  }

  function onTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const t = e.touches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    el.style.left = (originLeft + dx) + 'px';
    el.style.top  = (originTop  + dy) + 'px';
  }

  function onTouchEnd() {
    isDragging = false;
    el.classList.remove('dragging');
    el.style.zIndex = 10;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend',  onTouchEnd);
  }

  el.addEventListener('mousedown',  onMouseDown);
  el.addEventListener('touchstart', onTouchStart, { passive: false });
}

// Init all draggables on page
document.querySelectorAll('.draggable').forEach(makeDraggable);


/* ─────────────────────────────────────────
   SCROLL-TO-HORIZONTAL (work pages)
   Vertical wheel over a scroll section
   drives the horizontal track. Once the
   track is exhausted, normal page scroll
   resumes.
───────────────────────────────────────── */
document.querySelectorAll('.scroll-section').forEach(section => {
  const track = section.querySelector('.scroll-track');
  if (!track) return;

  section.addEventListener('wheel', e => {
    const atStart = track.scrollLeft <= 0;
    const atEnd   = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;

    // Only hijack if we can still scroll in the intended direction
    if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
      e.preventDefault();
      track.scrollLeft += e.deltaY * 1.2;
    }
  }, { passive: false });
});


/* ─────────────────────────────────────────
   NAV DROPDOWN — click-based toggle
───────────────────────────────────────── */
function closeAllDropdowns() {
  document.querySelectorAll('.nav-dropdown-menu').forEach(m => m.classList.remove('open'));
  document.querySelectorAll('.nav-dropdown-toggle').forEach(t => t.classList.remove('open'));
}

document.querySelectorAll('.nav-dropdown-toggle').forEach(toggle => {
  const menuId = toggle.dataset.menu;
  const menu   = document.getElementById(menuId);
  if (!menu) return;

  toggle.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
      const rect = toggle.getBoundingClientRect();
      menu.style.left      = (rect.left + rect.width / 2) + 'px';
      menu.style.transform = 'translateX(-50%)';
      menu.classList.add('open');
      toggle.classList.add('open');
    }
  });

  menu.addEventListener('click', e => e.stopPropagation());
});

document.addEventListener('click', closeAllDropdowns);


/* ─────────────────────────────────────────
   NAV — mark active page
───────────────────────────────────────── */
(function markActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


/* ─────────────────────────────────────────
   ASSET FADE-IN
───────────────────────────────────────── */
(function initAssetFade() {
  const selector = '.phone-screen img, .phone-screen video, .imac-screen img, .hero-photo, .hero-resume, .hero-sticker, .project-logo';
  document.querySelectorAll(selector).forEach(el => {
    const tag = el.tagName.toLowerCase();
    function reveal() { el.classList.add('asset-loaded'); }
    if (tag === 'img') {
      if (el.complete && el.naturalWidth) { reveal(); }
      else { el.addEventListener('load', reveal); el.addEventListener('error', reveal); }
    } else if (tag === 'video') {
      if (el.readyState >= 3) { reveal(); }
      else { el.addEventListener('canplay', reveal); el.addEventListener('loadeddata', reveal); }
    }
  });
})();


/* ─────────────────────────────────────────
   SCROLL REVEAL (project cards only)
───────────────────────────────────────── */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i * 0.08) + 's';
    io.observe(el);
  });
})();

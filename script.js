/* ============================================================
   ARJUN PORWAL — PORTFOLIO JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');

  let mouseX = -100, mouseY = -100;
  let trailX  = -100, trailY  = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = (mouseX - 5) + 'px';
    cursor.style.top  = (mouseY - 5) + 'px';
  });

  // Smooth lagging trail via rAF
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.18;
    trailY += (mouseY - trailY) * 0.18;
    trail.style.left = (trailX - 19) + 'px';
    trail.style.top  = (trailY - 19) + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursor.classList.remove('clicking'));

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); trail.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); trail.classList.remove('hovering'); });
  });


  // ── TYPED TEXT ─────────────────────────────────────────────
  const phrases = [
    'BTech Computer Science Student',
    'Aspiring Software Developer',
    'DSA Enthusiast',
    'Web App Builder',
    'Problem Solver',
  ];
  const typedEl = document.getElementById('typedText');
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      typedEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 45 : 80;

    if (!isDeleting && charIdx === current.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(type, speed);
  }
  type();


  // ── NAVBAR SCROLL ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky style
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    // Active nav link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ── HAMBURGER MENU ─────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });


  // ── THEME TOGGLE ───────────────────────────────────────────
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const themeIcon = themeToggle.querySelector('.theme-icon');

  // Persist theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'dark' ? '◐' : '◑';

  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    themeIcon.textContent = next === 'dark' ? '◐' : '◑';
  });


  // ── INTERSECTION OBSERVER — REVEAL ─────────────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Tag all major block elements for reveal
  const revealTargets = document.querySelectorAll(
    '.about-grid, .skill-card, .project-card, .profile-card, .contact-inner, .section-label, .section-title, .about-text'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 4 === 1) el.classList.add('reveal-delay-1');
    if (i % 4 === 2) el.classList.add('reveal-delay-2');
    if (i % 4 === 3) el.classList.add('reveal-delay-3');
    revealObserver.observe(el);
  });


  // ── SKILL BAR ANIMATION ────────────────────────────────────
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));


  // ── TILT EFFECT ON PROJECT CARDS ───────────────────────────
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ── SMOOTH SCROLL (polyfill for older Safari) ──────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── STAGGER SKILL CARDS ────────────────────────────────────
  document.querySelectorAll('.skill-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.05}s`;
  });


  // ── HERO PARALLAX ──────────────────────────────────────────
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (blob1) blob1.style.transform = `translateY(${y * 0.15}px)`;
    if (blob2) blob2.style.transform = `translateY(${y * -0.1}px)`;
  }, { passive: true });


  // ── GRID OVERLAY MOUSE PARALLAX ────────────────────────────
  const gridOverlay = document.querySelector('.grid-overlay');
  document.addEventListener('mousemove', (e) => {
    if (!gridOverlay) return;
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    gridOverlay.style.transform = `translate(${x}px, ${y}px)`;
  });


  // ── PROFILE CARD RIPPLE ────────────────────────────────────
  document.querySelectorAll('.profile-card').forEach(card => {
    card.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        background:var(--accent);
        opacity:0.15;
        width:10px;height:10px;
        left:${e.clientX - rect.left - 5}px;
        top:${e.clientY - rect.top - 5}px;
        transform:scale(0);
        animation:rippleAnim 0.5s ease-out forwards;
        pointer-events:none;
      `;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim { to { transform:scale(60); opacity:0; } }`;
  document.head.appendChild(style);

});

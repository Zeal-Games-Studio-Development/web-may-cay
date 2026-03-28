/* =====================================================
   app.js – Minh Phat May Cay Landing Page
   Theme Switcher, Navbar Scroll, Animations
   ===================================================== */

(function () {
  'use strict';

  // ---- THEME SWITCHER ----
  const body = document.getElementById('body');
  const switcherToggle = document.getElementById('switcher-toggle');
  const switcherPanel = document.getElementById('switcher-panel');
  const themeButtons = document.querySelectorAll('.theme-btn');

  const themes = [
    'theme-industrial',
    'theme-earth',
    'theme-tech',
    'theme-premium',
    'theme-fresh',
  ];

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('minhphat_theme') || 'theme-industrial';
  applyTheme(savedTheme);

  switcherToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = switcherPanel.classList.contains('open');
    switcherPanel.classList.toggle('open', !isOpen);
    switcherPanel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#theme-switcher')) {
      switcherPanel.classList.remove('open');
      switcherPanel.setAttribute('aria-hidden', 'true');
    }
  });

  themeButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const theme = btn.getAttribute('data-theme');
      applyTheme(theme);
      localStorage.setItem('minhphat_theme', theme);
      // Close panel after selection
      setTimeout(function () {
        switcherPanel.classList.remove('open');
        switcherPanel.setAttribute('aria-hidden', 'true');
      }, 300);
    });
  });

  function applyTheme(theme) {
    themes.forEach(function (t) { body.classList.remove(t); });
    body.classList.add(theme);
    // Update active button
    themeButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
  }

  // ---- NAVBAR SCROLL EFFECT ----
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ---- MOBILE HAMBURGER ----
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('open');
    navLinks.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', (!isOpen).toString());
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
    });
  });

  // ---- SCROLL TO TOP ----
  const scrollTopBtn = document.getElementById('scroll-top');

  window.addEventListener('scroll', function () {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- INTERSECTION OBSERVER – SCROLL ANIMATIONS ----
  const animatedElements = document.querySelectorAll(
    '.product-card, .whyus-card, .testimonial-card, .pricing-card, .usp-item, .rental-feature, .about-stat-card, .milestone, .rental-img-wrap'
  );

  animatedElements.forEach(function (el, index) {
    el.classList.add('animate-fade-up');
    el.style.transitionDelay = ((index % 4) * 0.1) + 's';
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach(function (el) { observer.observe(el); });

  // ---- CONTACT FORM SUBMIT ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = document.getElementById('contact-submit-btn');
      const originalText = btn.textContent;
      btn.textContent = '✅ Đã gửi! Chúng tôi sẽ liên hệ sớm.';
      btn.disabled = true;
      btn.style.background = '#22c55e';
      setTimeout(function () {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 4000);
    });
  }

  // ---- SMOOTH ACTIVE NAV HIGHLIGHTING ----
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 100) {
        current = section.getAttribute('id');
      }
    });
    navLinksAll.forEach(function (link) {
      link.style.color = '';
      link.style.fontWeight = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--color-primary)';
        link.style.fontWeight = '700';
      }
    });
  });

  // ---- STATS COUNTER ANIMATION ----
  function animateCounter(el, target, duration) {
    var start = 0;
    var increment = target / (duration / 16);
    var timer = setInterval(function () {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      var display = Math.floor(start).toLocaleString('vi-VN');
      el.textContent = display + (el.dataset.suffix || '');
    }, 16);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var numEl = entry.target.querySelector('.stat-big-num');
        if (numEl && !numEl.dataset.animated) {
          numEl.dataset.animated = 'true';
          var rawText = numEl.textContent.replace(/[^0-9]/g, '');
          var target = parseInt(rawText, 10);
          var suffix = numEl.textContent.replace(/[0-9]/g, '').replace(',', '').replace('.', '');
          numEl.dataset.suffix = suffix;
          if (!isNaN(target)) animateCounter(numEl, target, 1800);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.about-stat-card').forEach(function (card) {
    statsObserver.observe(card);
  });

  // ---- HERO PARALLAX SUBTLE ----
  var heroBg = document.querySelector('.hero-img');
  if (heroBg) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + scrolled * 0.3 + 'px)';
      }
    }, { passive: true });
  }

  console.log('%c🚜 Minh Phát Máy Cày – Powered by Antigravity', 'color:#f97316;font-size:14px;font-weight:bold;');
})();

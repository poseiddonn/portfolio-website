
'use strict';

/* Ticker — ensure seamless loop at any viewport width */
(function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  const lists = track.querySelectorAll('.ticker__list');
  if (lists.length < 2) return;

  /**
   * Measure the first list's rendered width and set the
   * animation duration proportionally so speed is constant
   * regardless of content width.
   */
  function calibrate() {
    const listWidth = lists[0].getBoundingClientRect().width;
    // Target ~80px per second scroll speed
    const duration = listWidth / 80;
    track.style.animationDuration = duration + 's';
  }

  calibrate();
  window.addEventListener('resize', calibrate, { passive: true });
})();


/* Scroll-reveal — fade-in sections as they enter viewport */
(function initScrollReveal() {
  const REVEAL_CLASS   = 'js-reveal';
  const VISIBLE_CLASS  = 'is-visible';

  // Sections to animate on scroll (after initial page load)
  const targets = document.querySelectorAll('.work, .about, .cta');

  // Only run if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add(VISIBLE_CLASS));
    return;
  }

  targets.forEach(el => {
    el.classList.add(REVEAL_CLASS);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(VISIBLE_CLASS);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* Active nav link — highlight based on scroll position */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks  = document.querySelectorAll('.nav__link[href^="#"]');

  if (!sections.length || !navLinks.length) return;
  if (!('IntersectionObserver' in window)) return;

  const ACTIVE_CLASS = 'nav__link--active';

  // Map section id → nav link
  const linkMap = new Map();
  navLinks.forEach(link => {
    const id = link.getAttribute('href').slice(1);
    linkMap.set(id, link);
  });

  let visibleSections = new Set();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      // Activate the first visible section's nav link
      navLinks.forEach(link => link.classList.remove(ACTIVE_CLASS));
      for (const [id, link] of linkMap) {
        if (visibleSections.has(id)) {
          link.classList.add(ACTIVE_CLASS);
          break;
        }
      }
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => observer.observe(section));
})();


/* Smooth-scroll for anchor links (polyfill for Safari) */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update URL without jumping
      history.pushState(null, '', '#' + targetId);
    });
  });
})();


/* Project card — subtle parallax on mouse move */
(function initCardParallax() {
  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    const thumb = card.querySelector('.project-card__thumb');
    if (!thumb) return;

    card.addEventListener('mousemove', function (e) {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / rect.width;
      const dy     = (e.clientY - cy) / rect.height;

      // Gentle tilt — max ±4deg
      const rotX   =  dy * -4;
      const rotY   =  dx *  4;

      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      card.style.transition = 'transform 0.1s ease';

      // Shift the shapes slightly in the opposite direction
      const shapes = thumb.querySelectorAll('.project-card__shape');
      shapes.forEach((shape, i) => {
        const factor = i % 2 === 0 ? 8 : -8;
        shape.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform   = '';
      card.style.transition  = 'transform 0.4s ease';
      const shapes = thumb.querySelectorAll('.project-card__shape');
      shapes.forEach(shape => {
        shape.style.transform  = '';
        shape.style.transition = 'transform 0.4s ease';
      });
    });
  });
})();


/* Respect prefers-reduced-motion — disable JS animations */
(function respectReducedMotion() {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function disableMotion(query) {
    if (!query.matches) return;

    // Stop ticker animation
    const track = document.getElementById('ticker-track');
    if (track) track.style.animationDuration = '0s';

    // Remove parallax listeners by replacing cards with clones
    document.querySelectorAll('.project-card').forEach(card => {
      const clone = card.cloneNode(true);
      card.parentNode.replaceChild(clone, card);
    });
  }

  disableMotion(mq);
  mq.addEventListener('change', disableMotion);
})();


/* Mobile nav — hamburger toggle */
(function initMobileNav() {
  const btn = document.getElementById("nav-hamburger");
  const overlay = document.getElementById("mobile-nav");
  if (!btn || !overlay) return;

  function openNav() {
    overlay.hidden = false;
    // Allow display:flex to take effect before animating
    requestAnimationFrame(() => {
      overlay.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Close menu");
      document.body.style.overflow = "hidden";
    });
  }

  function closeNav() {
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
    // Wait for CSS transition before hiding from AT
    overlay.addEventListener(
      "transitionend",
      () => {
        overlay.hidden = true;
      },
      { once: true },
    );
    overlay.setAttribute("hidden", "");
  }

  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    isOpen ? closeNav() : openNav();
  });

  // Close when any link inside is clicked
  overlay.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeNav);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      closeNav();
      btn.focus();
    }
  });

  // Close if viewport resizes back to desktop
  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > 768 &&
        btn.getAttribute("aria-expanded") === "true"
      ) {
        closeNav();
      }
    },
    { passive: true },
  );
})();

document.querySelector('.site-footer__built').textContent = `©️ copyright ${new Date().getFullYear()}`
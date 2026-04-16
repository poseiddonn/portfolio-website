/**
 * SCROLL.JS — Scroll-driven reveal animations
 * Uses IntersectionObserver for performance
 */

export function initScroll() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Respect mobile stagger
          const isMobile = window.innerWidth <= 768;
          const staggerInterval = isMobile ? 30 : 60;
          const staggerIndex = parseInt(entry.target.dataset.stagger || 0);
          const delay = staggerIndex * staggerInterval;

          // Add in-view class after delay
          setTimeout(() => {
            entry.target.classList.add("in-view");
          }, delay);

          // Unobserve after first reveal
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  // Observe all reveal elements
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.dataset.stagger = i % 8;
    observer.observe(el);
  });

  // Also handle timeline animations
  const timeline = document.querySelector(".timeline-line");
  if (timeline) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 },
    );
    timelineObserver.observe(timeline);
  }
}

/**
 * TEXT-SCRAMBLE.JS — Character scramble animation on scroll
 * Signature effect: characters randomise then settle
 * Triggers only when the element scrolls into view.
 */

export function initTextScramble(selector) {
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;

        // Restore the original text and wrap each character in a span
        const chars = el.dataset.scrambleText.split("");
        el.innerHTML = chars
          .map(
            (char, i) =>
              `<span class="text-scramble__char" style="animation-delay:${i * 60}ms">${char}</span>`
          )
          .join("");

        // Only animate once
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.5, // At least half the heading must be visible
    }
  );

  elements.forEach((el) => {
    // Stash the text and clear the element — stays blank until scrolled into view
    el.dataset.scrambleText = el.textContent;
    el.textContent = "";
    observer.observe(el);
  });
}
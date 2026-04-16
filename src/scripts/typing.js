/**
 * TYPING.JS — Character-by-character reveal with blinking cursor
 * Triggers only when the element scrolls into view.
 */

export function initTyping(selector, options = {}) {
  const {
    speed = 200, // ms per character on desktop
    pause = 200, // ms pause after typing completes
    onComplete = null,
  } = options;

  const elements = document.querySelectorAll(selector);
  const isMobile = window.innerWidth <= 768;
  const charSpeed = isMobile ? 90 : speed;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const fullText = el.dataset.typingText;

        // Clear and start typing
        el.textContent = "";
        let index = 0;

        function type() {
          if (index < fullText.length) {
            el.appendChild(document.createTextNode(fullText[index]));
            index++;
            setTimeout(type, charSpeed);
          } else {
            // Add blinking cursor at the end
            const cursor = document.createElement("span");
            cursor.className = "typing-cursor";
            el.appendChild(cursor);

            if (onComplete) setTimeout(onComplete, pause);
          }
        }

        type();

        // Only run once per element
        observer.unobserve(el);
      });
    },
    {
      threshold: 0.5, // At least half the heading must be visible
    },
  );

  elements.forEach((el) => {
    // Stash the text and clear the element — stays blank until scrolled into view
    el.dataset.typingText = el.textContent;
    el.textContent = "";
    observer.observe(el);
  });
}

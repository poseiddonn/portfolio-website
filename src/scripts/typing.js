/**
 * TYPING.JS — Character-by-character reveal with blinking cursor
 * Triggers only when the element scrolls into view.
 */

export function initTyping(selector, options = {}) {
  const {
    speed = 130, // ms per character on desktop
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
        const highlight = el.dataset.typingHighlight || "";

        // Clear and start typing
        el.textContent = "";
        el.style.visibilty = 'visible';
        let index = 0;

        // Pre-calculate where the highlight word starts and ends
        const hlStart = highlight ? fullText.indexOf(highlight) : -1;
        const hlEnd = hlStart >= 0 ? hlStart + highlight.length : -1;

        // building three text nodes / one span:
        let beforeNode = null;
        let hlSpan = null;
        let afterNode = null;

        if (hlStart >= 0) {
          beforeNode = document.createTextNode("");
          hlSpan = document.createElement("span");
          hlSpan.className = "typing-highlight";
          afterNode = document.createTextNode("");
          el.appendChild(beforeNode);
          el.appendChild(hlSpan);
          el.appendChild(afterNode);
        }

        function type() {
          if (index < fullText.length) {
            const char = fullText[index];

            if (hlStart < 0) {
              // No highlight — plain text node strategy
              el.appendChild(document.createTextNode(char));
            } else if (index < hlStart) {
              beforeNode.textContent += char;
            } else if (index < hlEnd) {
              hlSpan.textContent += char;
            } else {
              afterNode.textContent += char;
            }

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
    el.dataset.typingText = el.textContent.trim();
    el.textContent = "hidden";
    observer.observe(el);
  });
}

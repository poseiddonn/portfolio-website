/**
 * CURSOR.JS — Custom cursor (desktop only)
 * Follows mouse movement with smooth trailing
 */

export function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");

  if (!dot || !ring) return;

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Animation loop
  function loop() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;

    dot.style.transform = `translate(${mx}px, ${my}px)`;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;

    requestAnimationFrame(loop);
  }

  loop();

  // Expand ring on hover
  document
    .querySelectorAll('a, button, [data-cursor="hover"]')
    .forEach((el) => {
      el.addEventListener("mouseenter", () => {
        ring.classList.add("is-hover");
      });

      el.addEventListener("mouseleave", () => {
        ring.classList.remove("is-hover");
      });
    });
}

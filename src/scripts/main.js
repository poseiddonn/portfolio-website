/**
 * MAIN.JS — Application entry point
 * Initialises all modules on page load
 */

import { initCursor } from "./cursor.js";
import { initScroll } from "./scroll.js";
import { initNav } from "./nav.js";
import { initProjects } from "./projects.js";
import { initForm } from "./form.js";
import { initTextScramble } from "./text-scramble.js";
import { initTyping } from "./typing.js";

/**
 * Bootstrap application
 */
document.addEventListener("DOMContentLoaded", () => {

  // Desktop cursor (pointer: fine only)
  if (matchMedia("(pointer: fine) and (min-width: 769px)").matches) {
    initCursor();
  }

  // Scroll reveal system
  initScroll();

  // Navigation state tracking
  initNav();

  // Project interactions
  initProjects();

  // Contact form
  initForm();

  // Text animations — each sets up its own IntersectionObserver
  // and fires only when the element scrolls into view
  initTextScramble(".text-scramble");
  initTyping(".typing-text");

  // Back to top button visibility
  const backToTopBtn = document.querySelector(".back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    });
  }
});

// skills tab switch
// document.querySelectorAll(".skills-tab").forEach((tab) => {
//   tab.addEventListener("click", () => {
//     const target = tab.dataset.tab;
//     document
//       .querySelectorAll(".skills-tab")
//       .forEach((t) => t.classList.remove("active"));
//     tab.classList.add("active");
//     document.querySelectorAll(".skills-panel").forEach((p) => {
//       p.classList.remove("active");
//       if (p.dataset.panel === target) {
//         p.classList.add("active");
//         p.querySelectorAll(".skill-card").forEach((card, i) => {
//           setTimeout(() => card.classList.add("in-view"), i * 60);
//         });
//       }
//     });
//   });
// });


const modal = document.getElementById("devops-modal");
const modalBar = document.getElementById("devops-modal-bar");
const modalClose = modal?.querySelector(".devops-modal__close");
const modalBackdrop = modal?.querySelector(".devops-modal__backdrop");
let modalTimer = null;
 
function openDevOpsModal() {
  if (!modal) return;
  modal.hidden = false;
  // Reset and animate the progress bar over 10s
  modalBar.style.transition = "none";
  modalBar.style.transform = "scaleX(1)";
  // Force reflow before starting animation
  modalBar.getBoundingClientRect();
  modalBar.style.transition = "transform 10s linear";
  modalBar.style.transform = "scaleX(0)";
 
  clearTimeout(modalTimer);
  modalTimer = setTimeout(closeDevOpsModal, 10000);
}
 
function closeDevOpsModal() {
  if (!modal) return;
  modal.hidden = true;
  clearTimeout(modalTimer);
}
 
if (modalClose) modalClose.addEventListener("click", closeDevOpsModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeDevOpsModal);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDevOpsModal();
});
 
document.querySelectorAll(".skills-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
 
    if (target === "devops") openDevOpsModal();
    document
      .querySelectorAll(".skills-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".skills-panel").forEach((p) => {
      p.classList.remove("active");
      if (p.dataset.panel === target) {
        p.classList.add("active");
        p.querySelectorAll(".skill-card").forEach((card, i) => {
          setTimeout(() => card.classList.add("in-view"), i * 60);
        });
      }
    });
  });
});

// Animate default panel bars after load
setTimeout(() => {
  document
    .querySelectorAll(".skills-panel.active .skill-card")
    .forEach((card, i) => {
      setTimeout(() => card.classList.add("in-view"), 300 + i * 80);
    });
}, 400);

// Observe skills section for scroll-triggered animation
const skillsSection = document.querySelector(".skills");
if (skillsSection) {
  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document
            .querySelectorAll(".skills-panel.active .skill-card")
            .forEach((card, i) => {
              setTimeout(() => card.classList.add("in-view"), i * 80);
            });
          skillsObserver.disconnect();
        }
      });
    },
    { threshold: 0.1 }
  );
  skillsObserver.observe(skillsSection);
}

// footer year update
document.querySelector(".year").textContent = new Date().getFullYear();
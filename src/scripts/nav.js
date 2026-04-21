/**
 * NAV.JS — Navigation state tracking and scroll effects
 */

export function initNav() {
  const nav = document.querySelector("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinksContainer = document.querySelector(".nav-links");

  if (!nav) return;

  /**
   * Track scroll position and update nav background
   */
  function updateNavOnScroll() {
    const scrollPos = window.scrollY;
    const heroHeight = window.innerHeight;

    if (scrollPos > heroHeight * 0.5) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Update active link based on scroll position
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));

        const activeLink = document.querySelector(
          `.nav-link[href="#${section.id}"]`,
        );
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  }

  /**
   * Smooth scroll to section
   */
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          // Close first so body overflow is restored, THEN scroll
          if (navLinksContainer) closeMenu();
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /**
   * Shared helper — close the mobile menu from anywhere
   */
  function closeMenu() {
    navLinksContainer.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  /**
   * Mobile menu toggle
   */
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");
      // Mirror the open state on the button so CSS can animate to ✕
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen);

      // Lock / unlock body scroll
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when clicking outside the nav
    document.addEventListener("click", (e) => {
      if (
        !nav.contains(e.target) &&
        navLinksContainer.classList.contains("open")
      ) {
        closeMenu();
      }
    });
  }

  /**
   * Hire Me button scroll to contact
   */
  const hireMeBtn = document.querySelector("#hire-me-btn");
  if (hireMeBtn) {
    hireMeBtn.addEventListener("click", () => {
      const contactSection = document.querySelector("#contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Listen to scroll
  window.addEventListener("scroll", updateNavOnScroll, { passive: true });
  updateNavOnScroll(); // Initial call
}
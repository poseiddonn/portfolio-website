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
          target.scrollIntoView({ behavior: "smooth" });
          // Close mobile menu if open
          if (navLinksContainer) {
            navLinksContainer.classList.remove("open");
          }
        }
      }
    });
  });

  /**
   * Mobile menu toggle
   */
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinksContainer.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !nav.contains(e.target) &&
        navLinksContainer.classList.contains("open")
      ) {
        navLinksContainer.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
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

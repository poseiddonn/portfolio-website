/**
 * PROJECTS.JS — Project card interactions and filtering
 */

export function initProjects() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");

  if (!filterButtons.length || !projectCards.length) return;

  /**
   * Filter projects by category
   */
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.filter;

      // Update active button
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards with fade out/in effect
      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;

        if (category === "all" || cardCategory === category) {
          card.style.opacity = "1";
          card.style.pointerEvents = "auto";
        } else {
          card.style.opacity = "0";
          card.style.pointerEvents = "none";
        }
      });
    });
  });

  // Parallax on featured project
  const featured = document.querySelector(".project-featured");
  if (featured) {
    document.addEventListener("mousemove", (e) => {
      const rect = featured.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = (y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;

      const thumb = featured.querySelector(".card__image");
      if (thumb) {
        thumb.style.transform = `perspective(800px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
      }
    });

    featured.addEventListener("mouseleave", () => {
      const thumb = featured.querySelector(".card__image");
      if (thumb) {
        thumb.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
      }
    });
  }
}

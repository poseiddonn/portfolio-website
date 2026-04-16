/**
 * FORM.JS — Contact form validation and submission
 */

export function initForm() {
  const form = document.querySelector('[data-form="contact"]');
  if (!form) return;

  const submitBtn = form.querySelector('[type="submit"]');
  const originalBtnText = submitBtn?.textContent || "Send";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    // Update button state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      // Fallback: Show success message and open email client
      // Replace with your actual form endpoint when ready (Formspree, Netlify Forms, etc.)

      if (submitBtn) {
        submitBtn.textContent = "Sent ✓";
      }

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.style.cssText = `
        background: var(--brand-primary-dim);
        color: var(--brand-primary);
        padding: var(--space-4);
        border-radius: 4px;
        margin-top: var(--space-4);
        text-align: center;
        font-weight: 600;
      `;
      successMessage.textContent =
        "Thank you! Your message has been prepared. Please send it via email.";

      form.appendChild(successMessage);

      // Open email client with pre-filled data
      const subject = encodeURIComponent("Contact from portfolio");
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      );
      window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

      // Reset form after delay
      setTimeout(() => {
        form.reset();
        successMessage.remove();
        if (submitBtn) {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        }
      }, 3000);
    } catch (error) {
      console.error("Form error:", error);
      alert("Error preparing message. Please try again.");
      if (submitBtn) {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}

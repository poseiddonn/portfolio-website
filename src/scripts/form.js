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
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "930eaec6-c18b-4c2c-9e18-d3f3ee4e202f",
          name,
          email,
          message,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (submitBtn) submitBtn.textContent = "Sent ✓";

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
        successMessage.textContent = "Thank you! I'll be in touch soon.";
        form.appendChild(successMessage);

        setTimeout(() => {
          form.reset();
          successMessage.remove();
          if (submitBtn) {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
          }
        }, 3000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Form error:", error);
      alert("Something went wrong. Please try again.");
      if (submitBtn) {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}

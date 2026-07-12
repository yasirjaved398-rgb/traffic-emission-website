(function () {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const backToTop = document.querySelector("[data-back-to-top]");
  const yearTargets = document.querySelectorAll("[data-year]");

  body.classList.add("is-loaded");

  yearTargets.forEach((target) => {
    target.textContent = new Date().getFullYear();
  });

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const linkPage = link.getAttribute("href").split("#")[0];
    if (linkPage === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  const closeMenu = () => {
    if (!menu || !menuToggle) return;
    menu.classList.remove("is-open");
    menuToggle.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    body.classList.remove("menu-open");
  };

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      body.classList.toggle("menu-open", isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index % 6, 5) * 65}ms`;
      observer.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }

  if (backToTop) {
    const setBackToTopState = () => {
      backToTop.classList.toggle("is-visible", window.scrollY > 520);
    };

    setBackToTopState();
    window.addEventListener("scroll", setBackToTopState, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll("[data-accordion] .accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });

  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const success = form.querySelector("[data-form-success]");
    const messages = {
      name: "Enter your full name.",
      email: "Enter a valid email address.",
      phone: "Enter a valid phone number.",
      subject: "Enter a subject.",
      message: "Write a message of at least 10 characters."
    };

    const showError = (field, message) => {
      const error = form.querySelector(`[data-error-for="${field.name}"]`);
      field.setAttribute("aria-invalid", "true");
      if (error) {
        error.textContent = message;
      }
    };

    const clearError = (field) => {
      const error = form.querySelector(`[data-error-for="${field.name}"]`);
      field.removeAttribute("aria-invalid");
      if (error) {
        error.textContent = "";
      }
    };

    const validateField = (field) => {
      const value = field.value.trim();
      const tooShort = field.minLength > 0 && value.length < field.minLength;
      const invalidPattern = field.validity.patternMismatch;

      if (!value || tooShort || field.validity.typeMismatch || invalidPattern) {
        showError(field, messages[field.name] || "Please complete this field.");
        return false;
      }

      clearError(field);
      return true;
    };

    form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("input", () => {
        validateField(field);
        if (success) {
          success.textContent = "";
        }
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll("input, textarea"));
      const isValid = fields.map(validateField).every(Boolean);

      if (!isValid) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      form.reset();
      if (success) {
        success.textContent = "Thank you. Your message has been received for this demo form.";
      }
    });
  }
})();

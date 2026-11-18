/**
 * millcity10kg.com — Vanilla JavaScript Interactions
 * Handles:
 *  1. Mobile navigation drawer
 *  2. Crate photo filter tabs (All / Crate 1 / Crate 2 / Crate 3)
 *  3. Accessible photo documentation lightbox (keyboard, click, touch swipe)
 *  4. FAQ accordion toggles
 *  5. Contact inquiry form validation and static submission summary
 *  6. Image load error fallback protection
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. Mobile Navigation Drawer
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");

  if (menuToggle && mobileDrawer) {
    const closeDrawer = function () {
      menuToggle.setAttribute("aria-expanded", "false");
      mobileDrawer.hidden = true;
    };

    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileDrawer.hidden = isOpen;
    });

    mobileDrawer.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        closeDrawer();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !mobileDrawer.hidden) {
        closeDrawer();
        menuToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     2. Crate Photo Filter Tabs
     ------------------------------------------------------------------------ */
  const filterTabs = Array.from(document.querySelectorAll(".crate-tab"));
  const crateGroups = Array.from(document.querySelectorAll(".crate-group"));
  const galleryCountEl = document.getElementById("gallery-count");
  let activeFilter = "all";

  function updateGalleryCount() {
    if (!galleryCountEl) return;
    const visibleItems = document.querySelectorAll(
      ".crate-group:not([hidden]) .photo-card"
    ).length;
    const totalItems = document.querySelectorAll(".photo-card").length;
    galleryCountEl.textContent =
      "Showing " + visibleItems + " of " + totalItems + " inspection photos";
  }

  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      const targetGroup = tab.getAttribute("data-filter") || "all";
      activeFilter = targetGroup;

      filterTabs.forEach(function (btn) {
        const isSelected = btn === tab;
        btn.classList.toggle("is-active", isSelected);
        btn.setAttribute("aria-selected", String(isSelected));
      });

      crateGroups.forEach(function (group) {
        const groupId = group.getAttribute("data-crate");
        group.hidden = targetGroup !== "all" && groupId !== targetGroup;
      });

      updateGalleryCount();
    });
  });

  updateGalleryCount();

  /* ------------------------------------------------------------------------
     3. Photo Documentation Lightbox
     ------------------------------------------------------------------------ */
  const lightbox = document.getElementById("photo-lightbox");
  const lightboxImg = document.getElementById("lightbox-image");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxNote = document.getElementById("lightbox-note");
  const lightboxCloseBtn = document.getElementById("lightbox-close");
  const lightboxPrevBtn = document.getElementById("lightbox-prev");
  const lightboxNextBtn = document.getElementById("lightbox-next");
  const photoTriggers = Array.from(document.querySelectorAll(".photo-trigger"));

  let activeLightboxList = [];
  let activeLightboxIndex = 0;
  let lastFocusedTrigger = null;
  let touchStartX = 0;

  function getActivePhotoTriggers() {
    if (activeFilter === "all") {
      return photoTriggers;
    }
    return photoTriggers.filter(function (trigger) {
      const parentGroup = trigger.closest(".crate-group");
      return parentGroup && parentGroup.getAttribute("data-crate") === activeFilter;
    });
  }

  function renderLightboxSlide(index) {
    if (!activeLightboxList.length) return;
    const total = activeLightboxList.length;
    activeLightboxIndex = ((index % total) + total) % total;

    const trigger = activeLightboxList[activeLightboxIndex];
    const src = trigger.getAttribute("data-src") || "";
    const alt = trigger.getAttribute("data-alt") || "";
    const title = trigger.getAttribute("data-title") || "";
    const note = trigger.getAttribute("data-note") || "";
    const crateLabel = trigger.getAttribute("data-crate-label") || "";

    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxTitle.textContent = title;
    lightboxNote.textContent = note;
    lightboxCounter.textContent =
      crateLabel + " · Photo " + (activeLightboxIndex + 1) + " of " + total;
  }

  function openLightbox(trigger) {
    if (!lightbox) return;
    lastFocusedTrigger = trigger;
    activeLightboxList = getActivePhotoTriggers();
    const startIndex = activeLightboxList.indexOf(trigger);
    renderLightboxSlide(startIndex >= 0 ? startIndex : 0);

    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    if (lightboxCloseBtn) {
      lightboxCloseBtn.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true;
    document.body.style.overflow = "";
    lightboxImg.removeAttribute("src");
    if (lastFocusedTrigger) {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }

  photoTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      openLightbox(trigger);
    });
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener("click", closeLightbox);
  }

  if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener("click", function () {
      renderLightboxSlide(activeLightboxIndex - 1);
    });
  }

  if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener("click", function () {
      renderLightboxSlide(activeLightboxIndex + 1);
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    lightbox.addEventListener(
      "touchstart",
      function (event) {
        if (event.changedTouches && event.changedTouches.length) {
          touchStartX = event.changedTouches[0].clientX;
        }
      },
      { passive: true }
    );

    lightbox.addEventListener(
      "touchend",
      function (event) {
        if (!event.changedTouches || !event.changedTouches.length) return;
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 48) {
          if (deltaX < 0) {
            renderLightboxSlide(activeLightboxIndex + 1);
          } else {
            renderLightboxSlide(activeLightboxIndex - 1);
          }
        }
      },
      { passive: true }
    );
  }

  document.addEventListener("keydown", function (event) {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      renderLightboxSlide(activeLightboxIndex - 1);
    } else if (event.key === "ArrowRight") {
      renderLightboxSlide(activeLightboxIndex + 1);
    }
  });

  /* ------------------------------------------------------------------------
     4. FAQ Accordion
     ------------------------------------------------------------------------ */
  const faqButtons = Array.from(document.querySelectorAll(".faq-question"));

  faqButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const answerId = button.getAttribute("aria-controls");
      const answerEl = answerId ? document.getElementById(answerId) : null;
      if (!answerEl) return;

      const isExpanded = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isExpanded));
      answerEl.hidden = isExpanded;
    });
  });

  /* ------------------------------------------------------------------------
     5. Smooth CTA Focus for "Request Photos & Details"
     ------------------------------------------------------------------------ */
  const ctaButtons = Array.from(
    document.querySelectorAll('a[href="#contact"]')
  );
  const nameInput = document.getElementById("contact-name");

  ctaButtons.forEach(function (link) {
    link.addEventListener("click", function () {
      if (nameInput) {
        window.setTimeout(function () {
          nameInput.focus({ preventScroll: true });
        }, 350);
      }
    });
  });

  /* ------------------------------------------------------------------------
     6. Contact Inquiry Form (Validation + Static Mailto / Copy Fallback)
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById("contact-form");
  const confirmationBox = document.getElementById("form-confirmation");
  const mailtoDispatchLink = document.getElementById("mailto-dispatch-link");
  const copyInquiryBtn = document.getElementById("copy-inquiry-btn");
  const resetFormBtn = document.getElementById("reset-inquiry-btn");

  let lastCompiledSummary = "";

  function setFieldError(inputId, errorId, message) {
    const inputEl = document.getElementById(inputId);
    const errorEl = document.getElementById(errorId);
    if (!inputEl || !errorEl) return;

    if (message) {
      inputEl.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      inputEl.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const nameVal = (document.getElementById("contact-name").value || "").trim();
      const emailVal = (document.getElementById("contact-email").value || "").trim();
      const phoneVal = (document.getElementById("contact-phone").value || "").trim();
      const messageVal = (document.getElementById("contact-message").value || "").trim();

      let hasError = false;

      if (nameVal.length < 2) {
        setFieldError("contact-name", "error-name", "Please enter your name or organization.");
        hasError = true;
      } else {
        setFieldError("contact-name", "error-name", "");
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailVal)) {
        setFieldError("contact-email", "error-email", "Please enter a valid email address.");
        hasError = true;
      } else {
        setFieldError("contact-email", "error-email", "");
      }

      if (messageVal.length < 10) {
        setFieldError(
          "contact-message",
          "error-message",
          "Please share a brief note regarding inspection, freight, or documentation needs."
        );
        hasError = true;
      } else {
        setFieldError("contact-message", "error-message", "");
      }

      if (hasError) {
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const subject = "2025 Mill City MCR-10 Inquiry — " + nameVal;
      lastCompiledSummary =
        "Inquiry for: 2025 Mill City MCR-10 ($32,000, Virginia)\n" +
        "Name: " + nameVal + "\n" +
        "Email: " + emailVal + "\n" +
        "Phone: " + (phoneVal || "Not provided") + "\n\n" +
        "Message:\n" + messageVal;

      if (mailtoDispatchLink) {
        mailtoDispatchLink.href =
          "mailto:sales@millcity10kg.com?cc=info@millcity10kg.com&subject=" +
          encodeURIComponent(subject) +
          "&body=" +
          encodeURIComponent(lastCompiledSummary);
      }

      contactForm.hidden = true;
      if (confirmationBox) {
        confirmationBox.hidden = false;
        confirmationBox.focus();
      }
    });
  }

  if (copyInquiryBtn) {
    copyInquiryBtn.addEventListener("click", function () {
      if (!lastCompiledSummary) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastCompiledSummary).then(function () {
          copyInquiryBtn.textContent = "Inquiry Copied";
          window.setTimeout(function () {
            copyInquiryBtn.textContent = "Copy Inquiry Text";
          }, 2200);
        });
      }
    });
  }

  if (resetFormBtn && contactForm && confirmationBox) {
    resetFormBtn.addEventListener("click", function () {
      confirmationBox.hidden = true;
      contactForm.hidden = false;
      contactForm.reset();
      if (nameInput) nameInput.focus();
    });
  }

  /* ------------------------------------------------------------------------
     7. Graceful Image Error Fallback
     ------------------------------------------------------------------------ */
  const allImages = Array.from(document.querySelectorAll("img"));
  allImages.forEach(function (img) {
    img.addEventListener("error", function () {
      const frame = img.closest(".photo-frame, .hero-image-frame");
      if (frame && !frame.classList.contains("is-broken")) {
        frame.classList.add("is-broken");
        img.style.display = "none";
        const fallbackLabel = document.createElement("span");
        fallbackLabel.textContent = img.alt || "Equipment inspection image unavailable";
        frame.appendChild(fallbackLabel);
      }
    });
  });
})();

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

  const conditionProofBtn = document.getElementById("condition-proof-trigger");
  const conditionProofZoomBtn = document.getElementById("condition-proof-zoom-btn");
  const crate1OpenTrigger = document.getElementById("crate-1-open-trigger");

  function openCrate1ReceivingPhoto(sourceEl) {
    if (!crate1OpenTrigger) return;
    activeFilter = "crate-1";
    filterTabs.forEach(function (btn) {
      const isSelected = btn.getAttribute("data-filter") === "crate-1";
      btn.classList.toggle("is-active", isSelected);
      btn.setAttribute("aria-selected", String(isSelected));
    });
    crateGroups.forEach(function (group) {
      group.hidden = group.getAttribute("data-crate") !== "crate-1";
    });
    updateGalleryCount();
    openLightbox(crate1OpenTrigger);
    lastFocusedTrigger = sourceEl || crate1OpenTrigger;
  }

  if (conditionProofBtn) {
    conditionProofBtn.addEventListener("click", function () {
      openCrate1ReceivingPhoto(conditionProofBtn);
    });
  }

  if (conditionProofZoomBtn) {
    conditionProofZoomBtn.addEventListener("click", function () {
      openCrate1ReceivingPhoto(conditionProofZoomBtn);
    });
  }

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

  function describePageUrl(value) {
    if (!value) return "Not available";
    try {
      const url = new URL(value);
      return url.origin + url.pathname;
    } catch (error) {
      return "Not available";
    }
  }

  function collectSubmissionMetadata() {
    const pageUrl = new URL(window.location.href);
    const attributionKeys = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
      "gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"
    ];
    const attribution = attributionKeys
      .filter(function (key) { return pageUrl.searchParams.has(key); })
      .map(function (key) {
        return key + "=" + pageUrl.searchParams.get(key).slice(0, 200);
      });
    const viewportWidth = window.innerWidth || 0;
    const screenWidth = window.screen && window.screen.width ? window.screen.width : 0;
    const deviceWidth = screenWidth || viewportWidth;
    let timeZone = "Not available";
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || timeZone;
    } catch (error) {}

    return [
      "Submitted at (UTC): " + new Date().toISOString(),
      "Page: " + describePageUrl(pageUrl.href),
      "Referrer: " + describePageUrl(document.referrer),
      "Campaign / ad click IDs: " + (attribution.length ? attribution.join("; ") : "None present"),
      "Browser language: " + (navigator.language || "Not available"),
      "Time zone: " + timeZone,
      "Device class: " + (deviceWidth ? (deviceWidth < 768 ? "mobile-sized" : deviceWidth < 1024 ? "tablet-sized" : "desktop-sized") : "Not available"),
      "Screen / viewport width: " + (screenWidth || "Not available") + " / " + (viewportWidth || "Not available") + " px"
    ].join("\n");
  }

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
      const submissionMetadata = collectSubmissionMetadata();
      lastCompiledSummary =
        "Inquiry for: 2025 Mill City MCR-10 ($32,000, Virginia)\n" +
        "Name: " + nameVal + "\n" +
        "Email: " + emailVal + "\n" +
        "Phone: " + (phoneVal || "Not provided") + "\n\n" +
        "Message:\n" + messageVal + "\n\n" +
        "Submission and attribution details:\n" + submissionMetadata;

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

  /* ------------------------------------------------------------------------
     8. Interactive BOL Crate Manifest & Component Schematics
     ------------------------------------------------------------------------ */
  const bolTable = document.getElementById("bol-manifest-table");
  const bolBody = document.getElementById("bol-manifest-body");
  const colButtons = Array.from(document.querySelectorAll(".bol-col-btn"));
  const unitButtons = Array.from(document.querySelectorAll(".unit-btn"));
  const inspectorTabBtns = Array.from(
    document.querySelectorAll(".inspector-crate-btn")
  );
  const manifestReadout = document.getElementById("manifest-readout");
  const colExplainerEl = document.getElementById("manifest-col-explainer");
  const inspectorKickerEl = document.getElementById("inspector-kicker");
  const inspectorTitleEl = document.getElementById("inspector-title");
  const inspectorLeadEl = document.getElementById("inspector-lead");
  const inspectorCrateDimsEl = document.getElementById("inspector-crate-dims");
  const inspectorCrateWeightEl = document.getElementById(
    "inspector-crate-weight"
  );
  const inspectorComponentDimsEl = document.getElementById(
    "inspector-component-dims"
  );
  const inspectorVolumeEl = document.getElementById("inspector-volume");
  const inspectorContentsEl = document.getElementById("inspector-contents");
  const inspectorJumpBtn = document.getElementById("inspector-jump-photos");
  const schematicTagEl = document.getElementById("schematic-tag");
  const schematicSvgWrap = document.getElementById("schematic-svg-wrap");

  if (bolTable && bolBody) {
    const CRATE_DATA = {
      "crate-1": {
        num: 1,
        label: "Crate 1 (1 of 3) — Roaster Body",
        kicker: "BOL Handling Unit 1 of 3 · NMFC 118060-00 · Class 100",
        title: "Crate 1: Roaster Body (MCR-10-BKBS)",
        lead:
          "Original timber shipping crate housing the primary 10 kg roaster body in Black / Brushed Stainless (verified by the external MCR-10 BODY BLACK/BRUSHED placard, March 27, 2025 packing slip, and delivery receiving inspection photo).",
        crateDimsIn: "58 × 45 × 78 in",
        crateDimsCm: "147 × 114 × 198 cm",
        weightLb: "1,369.0 lb (66.8%)",
        weightKg: "621.0 kg (66.8%)",
        compDimsIn: "Carrier BOL + Packing Slip",
        compDimsCm: "Carrier BOL + Packing Slip",
        volumeIn: "117.8 cu ft · Do Not Stack",
        volumeMetric: "3.34 m³ · Do Not Stack",
        photoCount: 13,
        contents: [
          "<strong>BOL Description:</strong> Contains 1 Piece MCR 10 — 1 of 3 Roaster Body",
          "<strong>Crate Placard:</strong> <code>MCR-10 BODY BLACK/BRUSHED</code> (finish SKU <code>MCR-10-BKBS</code>)",
          "<strong>Packing Slip Order Line:</strong> 1 × 10kg Coffee Roaster — MCR Series (Black / Brushed), packed 27 Mar 2025",
          "<strong>Receiving Status:</strong> Panel opened once at delivery for visual inspection (full factory shrink wrap intact on pallet), then re-secured with screws; clear SpotSee ShockWatch monitor",
          "<strong>Mill City Spec Sheet:</strong> Serial-matched uncrated dimensions, clearances, and utility hookups available upon request via Mill City support"
        ],
        schematicTag: "CRT 1 OF 3",
        renderSvg: function (unit) {
          const crateL = unit === "metric" ? "147 cm L" : "58 in L";
          const crateW = unit === "metric" ? "114 cm W" : "45 in W";
          const crateH = unit === "metric" ? "198 cm H" : "78 in H";
          const crateWt = unit === "metric" ? "621.0 kg (66.8%)" : "1,369.0 lb (66.8%)";
          const crateVol = unit === "metric" ? "3.34 m³" : "117.8 cu ft";
          return (
            '<svg class="schematic-svg" viewBox="0 0 460 250" role="img" aria-label="Verified BOL Crate 1 Dimension Diagram">' +
            '<rect x="1" y="1" width="458" height="248" fill="#FFFFFF" stroke="#D8D2C8"/>' +
            '<text x="16" y="24" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#B85A23">VERIFIED BOL CRATE ELEVATION</text>' +
            '<text x="242" y="24" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">DOCUMENTED RECORDS</text>' +
            '<rect x="34" y="42" width="132" height="162" fill="#F7F5F2" stroke="#111111" stroke-width="1.5"/>' +
            '<rect x="34" y="192" width="132" height="12" fill="#D8D2C8" stroke="#111111" stroke-width="1"/>' +
            '<line x1="34" y1="96" x2="166" y2="96" stroke="#D8D2C8" stroke-width="1.2"/>' +
            '<rect x="74" y="64" width="52" height="22" fill="#FFFFFF" stroke="#B85A23" stroke-width="1"/>' +
            '<text x="100" y="79" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#111111">1 OF 3</text>' +
            '<text x="100" y="140" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#111111">ROASTER BODY</text>' +
            '<text x="100" y="156" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#4A4A4A">MCR-10-BKBS</text>' +
            '<line x1="34" y1="220" x2="166" y2="220" stroke="#B85A23" stroke-width="1.2"/>' +
            '<text x="100" y="234" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#111111">' + crateL + " × " + crateW + "</text>" +
            '<line x1="182" y1="42" x2="182" y2="204" stroke="#B85A23" stroke-width="1.2"/>' +
            '<text x="188" y="126" font-family="ui-monospace, monospace" font-size="10" fill="#111111">' + crateH + "</text>" +
            '<rect x="242" y="42" width="196" height="162" fill="#F7F5F2" stroke="#D8D2C8"/>' +
            '<text x="256" y="68" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">BOL Weight:</text>' +
            '<text x="256" y="84" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">' + crateWt + "</text>" +
            '<text x="256" y="110" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Calculated Cube:</text>' +
            '<text x="256" y="126" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">' + crateVol + " · CRT</text>" +
            '<text x="256" y="152" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Class / NMFC / Marks:</text>' +
            '<text x="256" y="168" font-family="ui-monospace, monospace" font-size="10" fill="#111111">100 · 118060-00</text>' +
            '<text x="256" y="186" font-family="ui-monospace, monospace" font-size="9.5" font-weight="600" fill="#B85A23">DO NOT STACK PALLETS</text>' +
            '<text x="340" y="234" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Inspected &amp; Re-secured · ShockWatch Clear</text>' +
            "</svg>"
          );
        }
      },
      "crate-2": {
        num: 2,
        label: "Crate 2 (2 of 3) — Cooling Tray",
        kicker: "BOL Handling Unit 2 of 3 · NMFC 118060-00 · Class 100",
        title: "Crate 2: Cooling Tray (MCR-10 COOL)",
        lead:
          "Timber crate housing the 10 kg cooling tray assembly in Black / Brushed Stainless (verified by the external MCR-10 COOL BLACK/BRUSHED placard and carrier BOL).",
        crateDimsIn: "38 × 36 × 54 in",
        crateDimsCm: "97 × 91 × 137 cm",
        weightLb: "403.0 lb (19.7%)",
        weightKg: "182.8 kg (19.7%)",
        compDimsIn: "Carrier BOL + millcityroasters.com",
        compDimsCm: "Carrier BOL + millcityroasters.com",
        volumeIn: "42.8 cu ft · Do Not Stack",
        volumeMetric: "1.21 m³ · Do Not Stack",
        photoCount: 7,
        contents: [
          "<strong>BOL Description:</strong> Contains 1 Piece MCR 10 — 2 of 3 Cooling Tray",
          "<strong>Crate Placard:</strong> <code>MCR-10 COOL BLACK/BRUSHED</code>",
          "<strong>Published Mill City Spec:</strong> Cooling tray holds up to 3 full batches; cools 2nd-crack roasts in under 4 minutes",
          "<strong>Crate Condition:</strong> Original timber crate on Mill City pallet; matching March 27, 2025 packing slip attached",
          "<strong>Mill City Spec Sheet:</strong> Serial-matched uncrated tray/fan layout specs available upon request via Mill City support"
        ],
        schematicTag: "CRT 2 OF 3",
        renderSvg: function (unit) {
          const crateDims =
            unit === "metric" ? "97 × 91 × 137 cm" : "38 × 36 × 54 in";
          const crateWt = unit === "metric" ? "182.8 kg (19.7%)" : "403.0 lb (19.7%)";
          const crateVol = unit === "metric" ? "1.21 m³" : "42.8 cu ft";
          return (
            '<svg class="schematic-svg" viewBox="0 0 460 250" role="img" aria-label="Verified BOL Crate 2 Dimension Diagram">' +
            '<rect x="1" y="1" width="458" height="248" fill="#FFFFFF" stroke="#D8D2C8"/>' +
            '<text x="16" y="24" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#B85A23">VERIFIED BOL CRATE ELEVATION</text>' +
            '<text x="242" y="24" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">DOCUMENTED RECORDS</text>' +
            '<rect x="46" y="72" width="110" height="132" fill="#F7F5F2" stroke="#111111" stroke-width="1.5"/>' +
            '<rect x="46" y="192" width="110" height="12" fill="#D8D2C8" stroke="#111111" stroke-width="1"/>' +
            '<rect x="75" y="90" width="52" height="22" fill="#FFFFFF" stroke="#B85A23" stroke-width="1"/>' +
            '<text x="101" y="105" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#111111">2 OF 3</text>' +
            '<text x="101" y="144" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#111111">COOLING TRAY</text>' +
            '<text x="101" y="160" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">COOL BLACK/BRUSHED</text>' +
            '<text x="101" y="234" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#111111">' + crateDims + "</text>" +
            '<rect x="242" y="42" width="196" height="162" fill="#F7F5F2" stroke="#D8D2C8"/>' +
            '<text x="256" y="68" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">BOL Weight:</text>' +
            '<text x="256" y="84" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">' + crateWt + "</text>" +
            '<text x="256" y="110" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Calculated Cube:</text>' +
            '<text x="256" y="126" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">' + crateVol + " · CRT</text>" +
            '<text x="256" y="152" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Published Tray Rating:</text>' +
            '<text x="256" y="168" font-family="ui-monospace, monospace" font-size="10" fill="#111111">3-Batch · &lt;4 Min Cool</text>' +
            '<text x="256" y="186" font-family="ui-monospace, monospace" font-size="9.5" font-weight="600" fill="#B85A23">DO NOT STACK PALLETS</text>' +
            '<text x="340" y="234" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Class 100 · NMFC 118060-00</text>' +
            "</svg>"
          );
        }
      },
      "crate-3": {
        num: 3,
        label: "Crate 3 (3 of 3) — Chaff Collector",
        kicker: "BOL Handling Unit 3 of 3 · NMFC 118060-00 · Class 100",
        title: "Crate 3: Chaff Collector & Included Hardware",
        lead:
          "Timber crate bearing the MCR-10 CHAFF BLACK/BRUSHED placard and carrier BOL designation 3 of 3 Chaff Collector, accompanied by the factory-packed install and Layout S venting hardware.",
        crateDimsIn: "34 × 34 × 70 in",
        crateDimsCm: "86 × 86 × 178 cm",
        weightLb: "278.0 lb (13.6%)",
        weightKg: "126.1 kg (13.6%)",
        compDimsIn: "Carrier BOL + Packing Slip",
        compDimsCm: "Carrier BOL + Packing Slip",
        volumeIn: "46.8 cu ft · Do Not Stack",
        volumeMetric: "1.33 m³ · Do Not Stack",
        photoCount: 8,
        contents: [
          "<strong>BOL Description:</strong> Contains 1 Piece MCR 10 — 3 of 3 Chaff Collector",
          "<strong>Crate Placard:</strong> <code>MCR-10 CHAFF BLACK/BRUSHED</code>",
          "<strong>Packing Slip LP Kit:</strong> Install Kit <code>GRC-10-LP</code> (LP Gas Roaster Components Kit · Install Base Kit × 1)",
          "<strong>Packing Slip Venting Kit:</strong> <code>VK-10-S</code> (Quick-Connect Kit, Layout S): Kit Bag <code>A620</code> × 1, Kit Box <code>S620</code> × 1",
          "<strong>Packing Slip Precut Pipe:</strong> Precut Pipe <code>4QF × 42</code> Galv × 1 &amp; <code>5QF × 34</code> Galv × 1"
        ],
        schematicTag: "CRT 3 OF 3",
        renderSvg: function (unit) {
          const crateDims =
            unit === "metric" ? "86 × 86 × 178 cm" : "34 × 34 × 70 in";
          const crateWt = unit === "metric" ? "126.1 kg (13.6%)" : "278.0 lb (13.6%)";
          const crateVol = unit === "metric" ? "1.33 m³" : "46.8 cu ft";
          return (
            '<svg class="schematic-svg" viewBox="0 0 460 250" role="img" aria-label="Verified BOL Crate 3 Dimension Diagram">' +
            '<rect x="1" y="1" width="458" height="248" fill="#FFFFFF" stroke="#D8D2C8"/>' +
            '<text x="16" y="24" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#B85A23">VERIFIED BOL CRATE ELEVATION</text>' +
            '<text x="242" y="24" font-family="ui-monospace, monospace" font-size="11" font-weight="600" fill="#111111">PACKING-SLIP SKUS</text>' +
            '<rect x="52" y="54" width="98" height="150" fill="#F7F5F2" stroke="#111111" stroke-width="1.5"/>' +
            '<rect x="52" y="192" width="98" height="12" fill="#D8D2C8" stroke="#111111" stroke-width="1"/>' +
            '<rect x="75" y="72" width="52" height="22" fill="#FFFFFF" stroke="#B85A23" stroke-width="1"/>' +
            '<text x="101" y="87" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#111111">3 OF 3</text>' +
            '<text x="101" y="136" text-anchor="middle" font-family="sans-serif" font-size="11" font-weight="600" fill="#111111">CHAFF</text>' +
            '<text x="101" y="152" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">COLLECTOR</text>' +
            '<text x="101" y="234" text-anchor="middle" font-family="ui-monospace, monospace" font-size="10" fill="#111111">' + crateDims + "</text>" +
            '<rect x="242" y="42" width="196" height="162" fill="#F7F5F2" stroke="#D8D2C8"/>' +
            '<text x="256" y="68" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">BOL Weight &amp; Cube:</text>' +
            '<text x="256" y="84" font-family="ui-monospace, monospace" font-size="10.5" font-weight="600" fill="#111111">' + crateWt + " · " + crateVol + "</text>" +
            '<text x="256" y="110" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Packing Slip LP &amp; Venting:</text>' +
            '<text x="256" y="126" font-family="ui-monospace, monospace" font-size="10" font-weight="600" fill="#111111">GRC-10-LP · VK-10-S</text>' +
            '<text x="256" y="144" font-family="ui-monospace, monospace" font-size="9.5" fill="#111111">A620 Bag · S620 Box</text>' +
            '<text x="256" y="162" font-family="ui-monospace, monospace" font-size="9.5" fill="#111111">4QF × 42 &amp; 5QF × 34 Galv</text>' +
            '<text x="256" y="186" font-family="ui-monospace, monospace" font-size="9.5" font-weight="600" fill="#B85A23">DO NOT STACK PALLETS</text>' +
            '<text x="340" y="234" text-anchor="middle" font-family="ui-monospace, monospace" font-size="9.5" fill="#4A4A4A">Class 100 · NMFC 118060-00</text>' +
            "</svg>"
          );
        }
      }
    };

    const COL_INFO = {
      hu:
        "<strong>Handling Units (H/U):</strong> Each crate rides on its own palletized handling unit (1 + 1 + 1 = 3 total H/U) as documented on the original carrier BOL.",
      pkg:
        "<strong>H/U Packaging Type (CRT):</strong> All three units are packaged in factory timber shipping crates (CRT) on pallets.",
      pieces:
        "<strong>Pieces:</strong> 1 piece per handling unit (3 pieces total across the shipment per carrier BOL).",
      hm:
        "<strong>Hazardous Materials (HM):</strong> Blank on carrier BOL / Non-hazardous shipment.",
      desc:
        "<strong>Description &amp; Contents:</strong> Transcribed directly from the factory Bill of Lading: MCR-10 Crate 1 (Roaster Body), Crate 2 (Cooling Tray), and Crate 3 (Chaff Collector). Click header to sort.",
      dims:
        "<strong>Crate Dimensions (L × W × H):</strong> Exact external crated dimensions stated on the carrier BOL (max height: 78 in / 198 cm).",
      weight:
        "<strong>Weight Column:</strong> Gross crated freight weights from the original BOL total <strong>2,050.0 lb</strong> (66.8% Roaster Body, 19.7% Cooling Tray, 13.6% Chaff Collector). Click header to sort.",
      nmfc:
        "<strong>NMFC Item # 118060-00:</strong> National Motor Freight Classification item number printed on the original carrier BOL.",
      class:
        "<strong>Freight Class 100:</strong> LTL tariff freight class printed alongside NMFC 118060-00 on the original BOL.",
      cube:
        "<strong>Cube (Computed):</strong> Paper BOL leaves Cube blank; values show exact exterior cubic volume (207.3 cu ft total) computed mathematically from BOL dimensions. Click header to sort."
    };

    let activeCrateId = "crate-1";
    let activeCol = "weight";
    let activeUnit = "imperial";
    let sortKey = null;
    let sortDir = "asc";

    function updateManifestUnits() {
      const unitCells = Array.from(
        bolTable.querySelectorAll("[data-in], [data-lb], [data-cuft]")
      );
      unitCells.forEach(function (el) {
        if (el.hasAttribute("data-in")) {
          el.textContent =
            activeUnit === "metric"
              ? el.getAttribute("data-cm")
              : el.getAttribute("data-in");
        } else if (el.hasAttribute("data-lb")) {
          el.textContent =
            activeUnit === "metric"
              ? el.getAttribute("data-kg")
              : el.getAttribute("data-lb");
        } else if (el.hasAttribute("data-cuft")) {
          el.textContent =
            activeUnit === "metric"
              ? el.getAttribute("data-m3")
              : el.getAttribute("data-cuft");
        }
      });

      inspectorTabBtns.forEach(function (btn) {
        const weightSpan = btn.querySelector(".inspector-crate-weight");
        if (weightSpan) {
          weightSpan.textContent =
            activeUnit === "metric"
              ? weightSpan.getAttribute("data-kg")
              : weightSpan.getAttribute("data-lb");
        }
      });
    }

    function renderManifestSelection() {
      const data = CRATE_DATA[activeCrateId] || CRATE_DATA["crate-1"];
      const rows = Array.from(bolBody.querySelectorAll(".bol-row"));

      rows.forEach(function (row) {
        const isMatch = row.getAttribute("data-crate-id") === activeCrateId;
        row.classList.toggle("is-row-active", isMatch);
      });

      const allColCells = Array.from(bolTable.querySelectorAll("[data-col]"));
      allColCells.forEach(function (el) {
        if (el.classList.contains("bol-col-btn") || el.tagName === "TD" || el.tagName === "TH") {
          const isMatchCol = el.getAttribute("data-col") === activeCol;
          el.classList.toggle("is-col-active", isMatchCol);
        }
      });

      inspectorTabBtns.forEach(function (btn) {
        const isMatch = btn.getAttribute("data-crate-target") === activeCrateId;
        btn.classList.toggle("is-active", isMatch);
        btn.setAttribute("aria-selected", String(isMatch));
      });

      if (manifestReadout) {
        const activeWeight =
          activeUnit === "metric" ? data.weightKg : data.weightLb;
        manifestReadout.innerHTML =
          "Active Selection: <strong>" +
          data.label +
          "</strong> &middot; Weight: <strong>" +
          activeWeight +
          "</strong>";
      }

      if (colExplainerEl && COL_INFO[activeCol]) {
        colExplainerEl.innerHTML = COL_INFO[activeCol];
      }

      if (inspectorKickerEl) inspectorKickerEl.textContent = data.kicker;
      if (inspectorTitleEl) inspectorTitleEl.textContent = data.title;
      if (inspectorLeadEl) inspectorLeadEl.textContent = data.lead;
      if (inspectorCrateDimsEl) {
        inspectorCrateDimsEl.textContent =
          activeUnit === "metric" ? data.crateDimsCm : data.crateDimsIn;
      }
      if (inspectorCrateWeightEl) {
        inspectorCrateWeightEl.textContent =
          activeUnit === "metric" ? data.weightKg : data.weightLb;
      }
      if (inspectorComponentDimsEl) {
        inspectorComponentDimsEl.textContent =
          activeUnit === "metric" ? data.compDimsCm : data.compDimsIn;
      }
      if (inspectorVolumeEl) {
        inspectorVolumeEl.textContent =
          activeUnit === "metric" ? data.volumeMetric : data.volumeIn;
      }

      if (inspectorContentsEl) {
        inspectorContentsEl.innerHTML = data.contents
          .map(function (item) {
            return "<li>" + item + "</li>";
          })
          .join("");
      }

      if (inspectorJumpBtn) {
        inspectorJumpBtn.setAttribute("data-filter-target", activeCrateId);
        inspectorJumpBtn.textContent =
          "View Crate " + data.num + " Photos (" + data.photoCount + ")";
      }

      if (schematicTagEl) schematicTagEl.textContent = data.schematicTag;
      if (schematicSvgWrap) schematicSvgWrap.innerHTML = data.renderSvg(activeUnit);
    }

    function sortManifestRows(key) {
      if (sortKey === key) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortKey = key;
        sortDir = key === "crate" ? "asc" : "desc";
      }

      const rows = Array.from(bolBody.querySelectorAll(".bol-row"));
      rows.sort(function (a, b) {
        let valA = 0;
        let valB = 0;
        if (key === "crate") {
          valA = Number(a.getAttribute("data-crate-num"));
          valB = Number(b.getAttribute("data-crate-num"));
        } else if (key === "weight") {
          valA = Number(a.getAttribute("data-weight-lb"));
          valB = Number(b.getAttribute("data-weight-lb"));
        } else if (key === "cube") {
          valA = Number(a.getAttribute("data-cube-cuft"));
          valB = Number(b.getAttribute("data-cube-cuft"));
        }
        return sortDir === "asc" ? valA - valB : valB - valA;
      });

      rows.forEach(function (row) {
        bolBody.appendChild(row);
      });

      colButtons.forEach(function (btn) {
        const indicator = btn.querySelector(".bol-sort-indicator");
        if (!indicator) return;
        const btnSort = btn.getAttribute("data-sortable");
        if (btnSort === sortKey) {
          indicator.innerHTML = sortDir === "asc" ? "&#8593;" : "&#8595;";
        } else {
          indicator.innerHTML = "&#8597;";
        }
      });
    }

    colButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const col = btn.getAttribute("data-col") || "weight";
        const sortable = btn.getAttribute("data-sortable");
        activeCol = col;
        if (sortable) {
          sortManifestRows(sortable);
        }
        renderManifestSelection();
      });
    });

    bolBody.addEventListener("click", function (event) {
      const row = event.target.closest(".bol-row");
      const cell = event.target.closest("td, th");
      if (!row) return;
      activeCrateId = row.getAttribute("data-crate-id") || "crate-1";
      if (cell && cell.getAttribute("data-col")) {
        activeCol = cell.getAttribute("data-col");
      }
      renderManifestSelection();
    });

    bolBody.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        const row = event.target.closest(".bol-row");
        if (!row) return;
        event.preventDefault();
        activeCrateId = row.getAttribute("data-crate-id") || "crate-1";
        renderManifestSelection();
      }
    });

    inspectorTabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeCrateId = btn.getAttribute("data-crate-target") || "crate-1";
        renderManifestSelection();
      });
    });

    unitButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        const nextUnit = btn.getAttribute("data-unit") || "imperial";
        activeUnit = nextUnit;
        unitButtons.forEach(function (uBtn) {
          const isMatch = uBtn === btn;
          uBtn.classList.toggle("is-active", isMatch);
          uBtn.setAttribute("aria-pressed", String(isMatch));
        });
        updateManifestUnits();
        renderManifestSelection();
      });
    });

    if (inspectorJumpBtn) {
      inspectorJumpBtn.addEventListener("click", function () {
        const filterTarget =
          inspectorJumpBtn.getAttribute("data-filter-target") || "crate-1";
        const matchingTab = filterTabs.find(function (t) {
          return t.getAttribute("data-filter") === filterTarget;
        });
        if (matchingTab) {
          matchingTab.click();
        }
        const photosSection = document.getElementById("photos");
        if (photosSection) {
          photosSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    updateManifestUnits();
    renderManifestSelection();
  }
})();

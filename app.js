/**
 * MLR BUILDING MATERIALS: INTERACTION & SMOOTH SCROLL CONTROLLER
 * Ultra-Smooth Lenis, Floating Hover Previews, Live Estimator Workstation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. LENIS ULTRA-SMOOTH SCROLL ENGINE
     ========================================================================== */
  let lenis = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
      smoothWheel: true,
      syncTouch: false,
      autoResize: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId) return;

      // Handle logo and top return links with smooth scroll
      if (targetId === '#' || this.classList.contains('brand-logo') || this.classList.contains('footer-logo-link')) {
        e.preventDefault();
        closeMobileDrawer();
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.4 });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        closeMobileDrawer();

        if (lenis) {
          lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
        } else {
          const topPos = targetEl.getBoundingClientRect().top + window.pageYOffset - 70;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
      }
    });
  });

  /* ==========================================================================
     2. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-close');

  function openMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      isOpen ? closeMobileDrawer() : openMobileDrawer();
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileDrawer);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileDrawer();
    }
  });

  /* ==========================================================================
     3. CAPABILITIES / SERVICES HOVER IMAGE PREVIEW (Cursor Follow)
     ========================================================================== */
  const serviceRows = document.querySelectorAll('.service-row');
  const hoverPreview = document.getElementById('service-hover-preview');
  const hoverImg = document.getElementById('service-hover-img');

  if (serviceRows.length > 0 && hoverPreview && hoverImg) {
    const islandBox = document.querySelector('.dark-island-box');
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let animId = null;

    function updatePreviewPos() {
      if (!isHovering) return;
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;
      hoverPreview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      animId = requestAnimationFrame(updatePreviewPos);
    }

    serviceRows.forEach((row) => {
      row.addEventListener('mouseenter', (e) => {
        const imgSrc = row.getAttribute('data-image');
        if (imgSrc) {
          hoverImg.src = imgSrc;
          hoverPreview.classList.add('visible');
          isHovering = true;
          if (islandBox) {
            const rect = islandBox.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            currentX = targetX;
            currentY = targetY;
            hoverPreview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
          }
          if (animId) cancelAnimationFrame(animId);
          animId = requestAnimationFrame(updatePreviewPos);
        }
        serviceRows.forEach((r) => r.classList.remove('active-highlight'));
        row.classList.add('active-highlight');
      });

      row.addEventListener('mousemove', (e) => {
        if (!islandBox) return;
        const rect = islandBox.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      });

      row.addEventListener('mouseleave', () => {
        isHovering = false;
        hoverPreview.classList.remove('visible');
      });
    });
  }

  /* ==========================================================================
     4. INTERACTIVE ESTIMATOR CALCULATOR (Dual Mode Engine)
     ========================================================================== */
  const modeWallBtn = document.getElementById('mode-wall-btn');
  const modeBrickBtn = document.getElementById('mode-brick-btn');
  const modeWallInputs = document.getElementById('mode-wall-inputs');
  const modeBrickInputs = document.getElementById('mode-brick-inputs');

  let currentMode = 'wall';

  if (modeWallBtn && modeBrickBtn) {
    modeWallBtn.addEventListener('click', () => {
      currentMode = 'wall';
      modeWallBtn.classList.add('active');
      modeWallBtn.setAttribute('aria-selected', 'true');
      modeBrickBtn.classList.remove('active');
      modeBrickBtn.setAttribute('aria-selected', 'false');

      modeWallInputs.classList.remove('hidden');
      modeBrickInputs.classList.add('hidden');
      calculateEstimator();
    });

    modeBrickBtn.addEventListener('click', () => {
      currentMode = 'brick';
      modeBrickBtn.classList.add('active');
      modeBrickBtn.setAttribute('aria-selected', 'true');
      modeWallBtn.classList.remove('active');
      modeWallBtn.setAttribute('aria-selected', 'false');

      modeBrickInputs.classList.remove('hidden');
      modeWallInputs.classList.add('hidden');
      calculateEstimator();
    });
  }

  const calcCategory = document.getElementById('calc-category');
  const categoryBricksGroup = document.getElementById('category-bricks-group');
  const categoryFencingGroup = document.getElementById('category-fencing-group');

  const calcBrickType = document.getElementById('calc-brick-type');
  const calcBrickSize = document.getElementById('calc-brick-size');
  const customBrickDims = document.getElementById('custom-brick-dims');
  const customLen = document.getElementById('custom-len');
  const customWid = document.getElementById('custom-wid');
  const customHt = document.getElementById('custom-ht');

  const calcFenceType = document.getElementById('calc-fence-type');
  const calcFenceHeight = document.getElementById('calc-fence-height');
  const customFenceDims = document.getElementById('custom-fence-dims');
  const customFenceHt = document.getElementById('custom-fence-ht');

  const wallLength = document.getElementById('wall-length');
  const wallHeight = document.getElementById('wall-height');
  const calcWastage = document.getElementById('calc-wastage');
  const wastageDisplay = document.getElementById('wastage-display');

  const runLength = document.getElementById('run-length');
  const runCourses = document.getElementById('run-courses');

  const resTotalUnits = document.getElementById('res-total-units');
  const resUnitLabel = document.getElementById('res-unit-label');
  const calcSummaryText = document.getElementById('calc-summary-text');
  const resAreaVal = document.getElementById('res-area-val');
  const resSpecVal = document.getElementById('res-spec-val');
  const resWastageVal = document.getElementById('res-wastage-val');

  if (calcCategory) {
    calcCategory.addEventListener('change', () => {
      const isBricks = calcCategory.value === 'cc-bricks';
      if (categoryBricksGroup && categoryFencingGroup) {
        if (isBricks) {
          categoryBricksGroup.classList.remove('hidden');
          categoryFencingGroup.classList.add('hidden');
        } else {
          categoryBricksGroup.classList.add('hidden');
          categoryFencingGroup.classList.remove('hidden');
        }
      }
      calculateEstimator();
    });
  }

  if (calcBrickSize) {
    calcBrickSize.addEventListener('change', () => {
      if (customBrickDims) {
        calcBrickSize.value === 'custom' ? customBrickDims.classList.remove('hidden') : customBrickDims.classList.add('hidden');
      }
      calculateEstimator();
    });
  }

  if (calcFenceHeight) {
    calcFenceHeight.addEventListener('change', () => {
      if (customFenceDims) {
        calcFenceHeight.value === 'custom-fence' ? customFenceDims.classList.remove('hidden') : customFenceDims.classList.add('hidden');
      }
      calculateEstimator();
    });
  }

  if (calcWastage && wastageDisplay) {
    calcWastage.addEventListener('input', () => {
      wastageDisplay.textContent = `${calcWastage.value}%`;
      calculateEstimator();
    });
  }

  const allCalcInputs = [
    calcBrickType, calcBrickSize, customLen, customWid, customHt,
    calcFenceType, calcFenceHeight, customFenceHt,
    wallLength, wallHeight, runLength, runCourses
  ];
  allCalcInputs.forEach((input) => {
    if (input) {
      input.addEventListener('input', calculateEstimator);
      input.addEventListener('change', calculateEstimator);
    }
  });

  function calculateEstimator() {
    const isBricks = !calcCategory || calcCategory.value === 'cc-bricks';
    const wastagePct = parseFloat(calcWastage ? calcWastage.value : 10) / 100;

    let totalUnits = 0;
    let unitName = 'BRICKS NEEDED';
    let areaSqFt = 0;
    let specDescription = '';
    let summaryHtml = '';

    if (currentMode === 'wall') {
      const lenFt = Math.max(1, parseFloat(wallLength ? wallLength.value : 100) || 0);
      const htFt = Math.max(1, parseFloat(wallHeight ? wallHeight.value : 10) || 0);
      areaSqFt = lenFt * htFt;

      if (isBricks) {
        let brickLenMm = 400;
        let brickWidMm = 200;
        let brickHtMm = 200;

        const sizeVal = calcBrickSize ? calcBrickSize.value : '400x200x200';
        if (sizeVal === '400x200x200') {
          brickLenMm = 400; brickWidMm = 200; brickHtMm = 200;
        } else if (sizeVal === '400x200x150') {
          brickLenMm = 400; brickWidMm = 200; brickHtMm = 150;
        } else if (sizeVal === '230x110x75') {
          brickLenMm = 230; brickWidMm = 110; brickHtMm = 75;
        } else if (sizeVal === 'custom') {
          brickLenMm = Math.max(50, parseFloat(customLen ? customLen.value : 400) || 400);
          brickWidMm = Math.max(50, parseFloat(customWid ? customWid.value : 200) || 200);
          brickHtMm = Math.max(50, parseFloat(customHt ? customHt.value : 200) || 200);
        }

        const brickType = calcBrickType ? calcBrickType.options[calcBrickType.selectedIndex].text.split('(')[0].trim() : 'Solid CC Brick';
        specDescription = `${brickType} &bull; ${brickLenMm}&times;${brickWidMm}&times;${brickHtMm} mm`;

        const brickLenIn = brickLenMm * 0.0393701;
        const brickHtIn = brickHtMm * 0.0393701;
        const isInterlocking = calcBrickType && calcBrickType.value === 'interlocking';
        const mortarJointIn = isInterlocking ? 0 : 0.394;

        const brickFaceAreaSqIn = (brickLenIn + mortarJointIn) * (brickHtIn + mortarJointIn);
        const wallAreaSqIn = areaSqFt * 144;

        const baseBricks = wallAreaSqIn / brickFaceAreaSqIn;
        totalUnits = Math.ceil(baseBricks * (1 + wastagePct));
        unitName = 'BRICKS NEEDED';

        summaryHtml = `You'll need approximately <strong>${totalUnits.toLocaleString()} bricks</strong> to cover <strong>${areaSqFt.toLocaleString()} sq ft</strong>.`;

      } else {
        const fenceType = calcFenceType ? calcFenceType.options[calcFenceType.selectedIndex].text.split('(')[0].trim() : 'Compound Wall';
        let fenceHt = 6.6;
        if (calcFenceHeight && calcFenceHeight.value === 'custom-fence') {
          fenceHt = Math.max(3, parseFloat(customFenceHt ? customFenceHt.value : 6.6) || 6.6);
        } else if (calcFenceHeight) {
          fenceHt = parseFloat(calcFenceHeight.value) || 6.6;
        }

        specDescription = `${fenceType} &bull; ${fenceHt} ft Height`;

        const panelsLengthWise = Math.ceil(lenFt / 7);
        const planksVertical = Math.ceil(fenceHt);
        const basePanels = panelsLengthWise * planksVertical;
        const postsCount = panelsLengthWise + 1;

        totalUnits = Math.ceil(basePanels * (1 + wastagePct));
        unitName = 'PANELS + POSTS';

        summaryHtml = `You'll need approximately <strong>${totalUnits.toLocaleString()} modular panels</strong> and <strong>${postsCount} posts</strong> for <strong>${lenFt} running ft (${areaSqFt.toLocaleString()} sq ft)</strong>.`;
      }

    } else {
      const rLen = Math.max(1, parseFloat(runLength ? runLength.value : 100) || 0);
      const courses = Math.max(1, parseFloat(runCourses ? runCourses.value : 15) || 1);

      let brickLenMm = 400;
      let brickHtMm = 200;
      const sizeVal = calcBrickSize ? calcBrickSize.value : '400x200x200';
      if (sizeVal === '400x200x200') {
        brickLenMm = 400; brickHtMm = 200;
      } else if (sizeVal === '400x200x150') {
        brickLenMm = 400; brickHtMm = 150;
      } else if (sizeVal === '230x110x75') {
        brickLenMm = 230; brickHtMm = 75;
      }

      const brickLenIn = brickLenMm * 0.0393701;
      const brickHtIn = brickHtMm * 0.0393701;
      const mortarJointIn = 0.394;

      const bricksPerRft = 12 / (brickLenIn + mortarJointIn);
      const estimatedHtFt = (courses * (brickHtIn + mortarJointIn)) / 12;
      areaSqFt = Math.round(rLen * estimatedHtFt);

      totalUnits = Math.ceil(bricksPerRft * rLen * courses * (1 + wastagePct));
      unitName = 'TOTAL BRICKS';
      specDescription = `${rLen} ft wall &bull; ${courses} courses &bull; ~${bricksPerRft.toFixed(1)} bricks/ft`;

      summaryHtml = `You'll need approximately <strong>${totalUnits.toLocaleString()} bricks</strong> for <strong>${rLen} ft</strong> over <strong>${courses} courses</strong> (~${areaSqFt} sq ft).`;
    }

    if (resTotalUnits) resTotalUnits.textContent = totalUnits.toLocaleString();
    if (resUnitLabel) resUnitLabel.textContent = unitName;
    if (calcSummaryText) calcSummaryText.innerHTML = summaryHtml;
    if (resAreaVal) resAreaVal.textContent = `${areaSqFt.toLocaleString()} sq ft`;
    if (resSpecVal) resSpecVal.innerHTML = specDescription;
    if (resWastageVal) resWastageVal.textContent = `+${Math.round(wastagePct * 100)}% included`;
  }

  calculateEstimator();

  /* ==========================================================================
     5. BRIDGE: SEND ESTIMATE TO CONTACT TERMINAL
     ========================================================================== */
  const btnSendEstimate = document.getElementById('btn-send-estimate');
  if (btnSendEstimate) {
    btnSendEstimate.addEventListener('click', () => {
      const isBricks = !calcCategory || calcCategory.value === 'cc-bricks';
      const quantityText = resTotalUnits ? resTotalUnits.textContent : '0';
      const areaText = resAreaVal ? resAreaVal.textContent : '';
      const specText = resSpecVal ? resSpecVal.innerText.replace(/&bull;/g, '|') : '';

      const formProduct = document.getElementById('form-product');
      const formQuantity = document.getElementById('form-quantity');
      const formMessage = document.getElementById('form-message');

      if (formProduct) {
        formProduct.value = isBricks ? 'CC Bricks' : 'Precast Fencing';
      }
      if (formQuantity) {
        formQuantity.value = `${quantityText} units (${areaText})`;
      }
      if (formMessage) {
        formMessage.value = `Site Estimator Parameters:\n- Material: ${isBricks ? 'CC Bricks' : 'Precast Fencing'}\n- Calculated Units: ${quantityText}\n- Wall Area: ${areaText}\n- Spec: ${specText}\n\nPlease provide indicative on-site casting quote and mobilization lead time.`;
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        if (lenis) {
          lenis.scrollTo(contactSection, { offset: -70, duration: 1.2 });
        } else {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  /* ==========================================================================
     6. FAQ ACCORDIONS (Clean Hairline Toggle)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach((other) => {
          other.classList.remove('active');
          const otherTrigger = other.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        });

        if (!isActive) {
          item.classList.add('active');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  /* ==========================================================================
     7. ENQUIRY FORM VALIDATION & SUCCESS FEEDBACK
     ========================================================================== */
  const enquiryForm = document.getElementById('enquiry-form');
  const enquirySuccess = document.getElementById('enquiry-success');
  const btnResetForm = document.getElementById('btn-reset-form');

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const nameInput = document.getElementById('form-name');
      const contactInput = document.getElementById('form-contact');
      const locationInput = document.getElementById('form-location');

      const errName = document.getElementById('err-name');
      const errContact = document.getElementById('err-contact');
      const errLocation = document.getElementById('err-location');

      if (errName) errName.textContent = '';
      if (errContact) errContact.textContent = '';
      if (errLocation) errLocation.textContent = '';

      if (!nameInput.value.trim()) {
        if (errName) errName.textContent = 'Please enter your name.';
        hasError = true;
      }
      if (!contactInput.value.trim()) {
        if (errContact) errContact.textContent = 'Please enter a phone number or email.';
        hasError = true;
      }
      if (!locationInput.value.trim()) {
        if (errLocation) errLocation.textContent = 'Please specify your site location.';
        hasError = true;
      }

      if (hasError) return;

      const submitBtn = document.getElementById('btn-submit-enquiry');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Transmitting...</span>';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>Send Enquiry</span><span class="btn-circle-arrow"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1.5 10.5L10.5 1.5M10.5 1.5H3M10.5 1.5V9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
        }
        enquiryForm.classList.add('hidden');
        if (enquirySuccess) {
          enquirySuccess.classList.remove('hidden');
        }
      }, 600);
    });
  }

  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      if (enquirySuccess) enquirySuccess.classList.add('hidden');
      if (enquiryForm) {
        enquiryForm.reset();
        enquiryForm.classList.remove('hidden');
      }
    });
  }

});

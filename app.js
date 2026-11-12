/**
 * GLACIER : Natural Mineral Water
 * Fixed Viewport: Fluid Continuous Scrollable Content Engine & Luxury Editorial Presentation
 */

document.addEventListener('DOMContentLoaded', () => {
  const TOTAL_FRAMES = 192;
  const TOTAL_SLIDES = 5;
  const frames = new Array(TOTAL_FRAMES).fill(null);

  let virtualProgress = 0.0;
  let targetProgress = 0.0;
  let currentFrameFloat = 1.0;
  let isInitialLoaded = false;

  // DOM Elements
  const canvas = document.getElementById('global-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const scrollTrack = document.getElementById('scroll-track');
  const slides = document.querySelectorAll('.content-slide');
  const navLinks = document.querySelectorAll('.nav-link, .nav-brand');

  // Cart State & Drawer
  let cart = [];
  const cartToggle = document.getElementById('cart-toggle');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartClose = document.getElementById('cart-close');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotalVal = document.getElementById('cart-total-val');
  const checkoutBtn = document.getElementById('checkout-btn');
  const addMiniButtons = document.querySelectorAll('.add-mini-btn, .reserve-btn');

  // =========================================================================
  // 1. BOTTLE FRAME STREAMING & RENDERING (ROCK-STILL, UNZOOMED ON RIGHT)
  // =========================================================================
  function getFramePath(i) {
    return `assets/frames/frame_${String(i).padStart(4, '0')}.webp`;
  }

  function initFrames() {
    const keyIndices = [1, 2, 3, 4, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144, 156, 168, 180, 192];
    let loadedCount = 0;

    keyIndices.forEach((idx) => {
      const img = new Image();
      img.src = getFramePath(idx);
      img.onload = () => {
        frames[idx - 1] = img;
        loadedCount++;
        if (!isInitialLoaded && loadedCount >= 4) {
          isInitialLoaded = true;
          renderBottle();
          streamRemainingFrames();
        }
      };
    });
  }

  function streamRemainingFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!frames[i - 1]) {
        const img = new Image();
        img.src = getFramePath(i);
        img.onload = () => {
          frames[i - 1] = img;
        };
      }
    }
  }

  function resizeCanvases() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const winW = window.innerWidth || 1280;
    const winH = window.innerHeight || 720;

    const bw = Math.round(winW * dpr);
    const bh = Math.round(winH * dpr);

    if (canvas.width !== bw || canvas.height !== bh) {
      canvas.width = bw;
      canvas.height = bh;
    }
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    renderBottle();
  }

  function drawUnzoomedBottle(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;  // 1280
    const ih = img.naturalHeight; // 720

    ctx.fillStyle = '#0b1523';
    ctx.fillRect(0, 0, cw, ch);

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      const scale = Math.min(cw / iw, (ch * 0.75) / ih);
      const nw = iw * scale;
      const nh = ih * scale;
      const cx = (cw - nw) * 0.5;
      const cy = ch - nh;
      ctx.drawImage(img, cx, cy, nw, nh);
      return;
    }

    // Desktop: Full unzoomed vertical height, strictly rock-still anchor on right half (~74% width)
    const scale = Math.min((ch * 0.98) / ih, (cw * 0.88) / iw);
    const nw = iw * scale;
    const nh = ih * scale;

    let cx = (cw * 0.74) - (580 * scale);
    if (cx + nw < cw) cx = cw - nw;
    const cy = (ch - nh) * 0.5;

    ctx.drawImage(img, cx, cy, nw, nh);
  }

  function getActiveImage(frameIdx) {
    const clamped = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(frameIdx)));
    if (frames[clamped - 1]) return frames[clamped - 1];

    for (let off = 1; off < 25; off++) {
      if (clamped - off >= 1 && frames[clamped - off - 1]) return frames[clamped - off - 1];
      if (clamped + off <= TOTAL_FRAMES && frames[clamped + off - 1]) return frames[clamped + off - 1];
    }
    return frames[0];
  }

  function renderBottle() {
    const img = getActiveImage(currentFrameFloat);
    if (img) drawUnzoomedBottle(img);
  }

  // =========================================================================
  // 2. CALM, ROCK-SOLID SLIDE ENGINE (ZERO TRAMPOLINE, ZERO BOUNCE)
  // =========================================================================
  let currentSlideIndex = 0;
  let isScrollLocked = false;

  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, index));
    currentSlideIndex = clamped;
    targetProgress = clamped / (TOTAL_SLIDES - 1);
  }

  function updateScrollTrack(progress) {
    // 1. Move entire track vertically with linear subpixel precision (in vh units)
    const trackY = -progress * (TOTAL_SLIDES - 1) * 100;
    if (scrollTrack) {
      scrollTrack.style.transform = `translate3d(0, ${trackY.toFixed(2)}vh, 0)`;
    }

    // 2. Pure, stable opacity transition (NO scale bounce, NO vertical wobbling)
    const currentPos = progress * (TOTAL_SLIDES - 1);

    slides.forEach((slide, idx) => {
      const dist = currentPos - idx;
      const absDist = Math.abs(dist);

      let opacity = 1.0;
      if (absDist > 0.25) {
        opacity = Math.max(0, 1.0 - (absDist - 0.25) / 0.75);
      }

      slide.style.opacity = opacity.toFixed(3);
      slide.style.transform = 'none'; // Stable: no scaling, no jumping
      slide.style.pointerEvents = absDist < 0.4 ? 'auto' : 'none';

      if (absDist < 0.2) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // 3. Update Navigation Links smoothly based on current slide position
    navLinks.forEach((link) => {
      const p = parseFloat(link.dataset.progress);
      if (!isNaN(p)) {
        if (Math.abs(progress - p) < 0.125) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  // Wheel Event: 1 intentional scroll notch cleanly and calmly steps 1 slide
  window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrollLocked) return;

    if (Math.abs(e.deltaY) >= 15) {
      isScrollLocked = true;
      const direction = e.deltaY > 0 ? 1 : -1;
      goToSlide(currentSlideIndex + direction);

      // Clean, calm debounce so wheel actions are solid and predictable
      setTimeout(() => {
        isScrollLocked = false;
      }, 380);
    }
  }, { passive: false });

  // Touch Support: Clean vertical swipe gesture (No rubber-band trampoline)
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (e.changedTouches && e.changedTouches[0] && !isScrollLocked) {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      if (Math.abs(diffY) >= 30) {
        isScrollLocked = true;
        const direction = diffY > 0 ? 1 : -1;
        goToSlide(currentSlideIndex + direction);
        setTimeout(() => {
          isScrollLocked = false;
        }, 380);
      }
    }
  }, { passive: true });

  // Keyboard Navigation: Up/Down arrow moves 1 full slide
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      goToSlide(currentSlideIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      goToSlide(currentSlideIndex - 1);
    } else if (e.key === 'Escape') {
      closeCart();
    }
  });

  // Nav Links Direct Smooth Jump to Full Slide
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const p = parseFloat(link.dataset.progress);
      if (!isNaN(p)) {
        const slideIdx = Math.round(p * (TOTAL_SLIDES - 1));
        goToSlide(slideIdx);
      }
    });
  });

  // Main 60 FPS Render Tick Loop with Calm Pure Exponential Lerp (ZERO OVERSHOOT)
  function tick() {
    const pDelta = targetProgress - virtualProgress;
    if (Math.abs(pDelta) > 0.0001) {
      virtualProgress += pDelta * 0.10;
      updateScrollTrack(virtualProgress);
    }

    const targetFrame = 1 + virtualProgress * (TOTAL_FRAMES - 1);
    const fDelta = targetFrame - currentFrameFloat;
    if (Math.abs(fDelta) > 0.01) {
      currentFrameFloat += fDelta * 0.14;
      renderBottle();
    }

    requestAnimationFrame(tick);
  }

  // =========================================================================
  // 3. SHOPPING BAG DRAWER
  // =========================================================================
  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
  }

  if (cartToggle) cartToggle.addEventListener('click', openCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
  if (cartClose) cartClose.addEventListener('click', closeCart);

  function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartCount) cartCount.textContent = `[${count}]`;
    if (cartTotalVal) cartTotalVal.textContent = `$${total}`;

    if (!cartItemsContainer) return;
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-text">Your bag is currently empty.</p>';
      return;
    }

    cartItemsContainer.innerHTML = cart.map((item, idx) => `
      <div class="cart-card">
        <img src="${item.img}" alt="${item.name}" class="cart-card-img">
        <div class="cart-card-info">
          <div class="cart-card-name">${item.name}</div>
          <div class="cart-card-price">$${item.price} each</div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" data-action="dec" data-idx="${idx}">&minus;</button>
          <span style="font-size: 0.85rem; font-weight: 700; width: 18px; text-align: center;">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-idx="${idx}">&plus;</button>
        </div>
      </div>
    `).join('');

    // Attach qty button listeners
    cartItemsContainer.querySelectorAll('.qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx);
        const action = btn.dataset.action;
        if (action === 'inc') {
          cart[idx].qty++;
        } else if (action === 'dec') {
          cart[idx].qty--;
          if (cart[idx].qty <= 0) cart.splice(idx, 1);
        }
        updateCartUI();
      });
    });
  }

  function addToCart(id, name, price, img) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, img, qty: 1 });
    }
    updateCartUI();
  }

  addMiniButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const img = btn.dataset.img;
      addToCart(id, name, price, img);

      const originalText = btn.textContent;
      btn.textContent = 'Reserved ✓';
      btn.style.background = '#090e17';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 1400);
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your bag is currently empty. Please select an allocation first.');
        return;
      }
      alert('Thank you for reserving GLACIER. Your private concierge will confirm delivery coordinates.');
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  // Window resize handler
  window.addEventListener('resize', () => {
    resizeCanvases();
  });

  // Initialization
  const urlParams = new URLSearchParams(window.location.search);
  const paramP = parseFloat(urlParams.get('p'));
  if (!isNaN(paramP)) {
    targetProgress = Math.max(0, Math.min(1, paramP));
    virtualProgress = targetProgress;
    currentSlideIndex = Math.round(targetProgress * (TOTAL_SLIDES - 1));
    currentFrameFloat = 1 + virtualProgress * (TOTAL_FRAMES - 1);
  }

  resizeCanvases();
  initFrames();
  updateScrollTrack(virtualProgress);
  requestAnimationFrame(tick);
});

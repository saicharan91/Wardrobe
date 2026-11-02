/**
 * WARDROBE — Core Application & E-Commerce State Engine
 * Shared across all pages: Cart, Wishlist, Currency Engine, Search, Modals, and Drawers.
 */

window.Wardrobe = (function () {
  'use strict';

  // Core State
  const state = {
    currency: localStorage.getItem('wd_currency') || 'USD',
    cart: JSON.parse(localStorage.getItem('wd_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('wd_wishlist') || '[]'),
    promo: JSON.parse(localStorage.getItem('wd_promo') || 'null')
  };

  const PROMO_CODES = {
    WARDROBE10: { discount: 0.10, label: "10% VIP Discount" },
    MINIMAL: { discount: 0.15, label: "15% Minimalist Capsule" },
    ATELIER: { discount: 0.20, label: "20% Private Archive" }
  };

  const FREE_SHIPPING_THRESHOLD_USD = 350;

  // Currency Converter & Formatter
  function formatMoney(amountUSD) {
    const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
    const val = amountUSD * curr.rate;
    if (state.currency === 'JPY') {
      return `${curr.symbol}${Math.round(val).toLocaleString()}`;
    }
    return `${curr.symbol}${val.toFixed(2)}`;
  }

  function setCurrency(newCurrency) {
    if (!CURRENCIES[newCurrency]) return;
    state.currency = newCurrency;
    localStorage.setItem('wd_currency', newCurrency);
    document.querySelectorAll('.currency-select').forEach(sel => sel.value = newCurrency);
    updateBadges();
    renderCartDrawer();
    renderWishlistDrawer();
    // Dispatch custom event for page-specific re-renders
    window.dispatchEvent(new CustomEvent('wardrobe:currency-changed', { detail: { currency: newCurrency } }));
  }

  // Toast Notification System
  function showToast(message, actionLabel = null, actionCallback = null) {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toast.appendChild(textSpan);

    if (actionLabel && actionCallback) {
      const actionBtn = document.createElement('button');
      actionBtn.className = 'toast-action';
      actionBtn.textContent = actionLabel;
      actionBtn.addEventListener('click', () => {
        actionCallback();
        toast.remove();
      });
      toast.appendChild(actionBtn);
    }

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // SVG Fallback for Missing or Offline Images
  function getPlaceholderSvg(title, category) {
    const encodedTitle = encodeURIComponent(title || 'WARDROBE ATELIER');
    const encodedCat = encodeURIComponent((category || 'READY-TO-WEAR').toUpperCase());
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%23F3EFE8"/><rect x="24" y="24" width="552" height="752" fill="none" stroke="%23D8D3C8" stroke-width="1.5"/><text x="50%" y="46%" font-family="serif" font-size="22" fill="%23121212" text-anchor="middle" letter-spacing="2">${encodedTitle}</text><text x="50%" y="52%" font-family="sans-serif" font-size="11" fill="%238C8880" text-anchor="middle" letter-spacing="3">${encodedCat}</text><text x="50%" y="58%" font-family="serif" font-size="13" font-style="italic" fill="%238A4E2B" text-anchor="middle">Atelier Wardrobe</text></svg>`;
  }

  // Cart Operations
  function addToCart(product, size = null, color = null, quantity = 1) {
    const chosenSize = size || (product.sizes ? product.sizes[0] : 'One Size');
    const chosenColor = color || (product.colors ? product.colors[0].name : 'Standard');

    const existing = state.cart.find(
      item => item.id === product.id && item.selectedSize === chosenSize && item.selectedColor === chosenColor
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        selectedSize: chosenSize,
        selectedColor: chosenColor,
        quantity: quantity
      });
    }

    saveCart();
    renderCartDrawer();
    openCartDrawer();
    showToast(`Added "${product.name}" (${chosenSize}) to Bag`, 'View Bag', openCartDrawer);
    window.dispatchEvent(new CustomEvent('wardrobe:cart-updated', { detail: { cart: state.cart } }));
  }

  function updateCartItemQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
    renderCartDrawer();
    window.dispatchEvent(new CustomEvent('wardrobe:cart-updated', { detail: { cart: state.cart } }));
  }

  function removeCartItem(index) {
    if (!state.cart[index]) return;
    const removed = state.cart[index];
    state.cart.splice(index, 1);
    saveCart();
    renderCartDrawer();
    showToast(`Removed "${removed.name}" from Bag`);
    window.dispatchEvent(new CustomEvent('wardrobe:cart-updated', { detail: { cart: state.cart } }));
  }

  function saveCart() {
    localStorage.setItem('wd_cart', JSON.stringify(state.cart));
    updateBadges();
  }

  // Wishlist Operations
  function toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const idx = state.wishlist.findIndex(item => item.id === productId);
    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast(`Removed "${product.name}" from Wishlist`);
    } else {
      state.wishlist.push(product);
      showToast(`Saved "${product.name}" to Wishlist`, 'View Wishlist', openWishlistDrawer);
    }

    localStorage.setItem('wd_wishlist', JSON.stringify(state.wishlist));
    updateBadges();
    renderWishlistDrawer();
    window.dispatchEvent(new CustomEvent('wardrobe:wishlist-updated', { detail: { wishlist: state.wishlist, productId } }));
  }

  function isWishlisted(productId) {
    return state.wishlist.some(item => item.id === productId);
  }

  // Update Header Badges
  function updateBadges() {
    const totalItems = state.cart.reduce((sum, i) => sum + i.quantity, 0);
    document.querySelectorAll('#cartCount').forEach(badge => {
      badge.textContent = totalItems;
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 300);
    });

    const totalWishlist = state.wishlist.length;
    document.querySelectorAll('#wishlistCount').forEach(badge => {
      badge.textContent = totalWishlist;
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 300);
    });
  }

  // Render Slide-Out Cart Drawer
  function renderCartDrawer() {
    const listEl = document.getElementById('cartItemsList');
    if (!listEl) return;

    const subtotalEl = document.getElementById('cartSubtotal');
    const discountRow = document.getElementById('cartDiscountRow');
    const discountAmtEl = document.getElementById('cartDiscountAmt');
    const shippingAmtEl = document.getElementById('cartShippingAmt');
    const totalEl = document.getElementById('cartTotal');
    const progressText = document.getElementById('shippingProgressText');
    const progressBar = document.getElementById('shippingProgressBar');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (state.cart.length === 0) {
      listEl.innerHTML = `
        <div class="empty-drawer-view">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke-width="1.5"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke-width="1.5"/>
            <path d="M16 10a4 4 0 0 1-8 0" stroke-width="1.5"/>
          </svg>
          <h4>Your Shopping Bag is Empty</h4>
          <p>Invest in foundational pieces designed to endure.</p>
          <a href="shop.html" class="btn-primary" style="margin-top: 1rem;">Explore Collection</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = formatMoney(0);
      if (shippingAmtEl) shippingAmtEl.textContent = formatMoney(0);
      if (totalEl) totalEl.textContent = formatMoney(0);
      if (progressBar) progressBar.style.width = '0%';
      if (progressText) progressText.innerHTML = `Add <strong>${formatMoney(FREE_SHIPPING_THRESHOLD_USD)}</strong> for complimentary express delivery.`;
      if (discountRow) discountRow.style.display = 'none';
      if (checkoutBtn) checkoutBtn.classList.add('disabled');
      return;
    }

    if (checkoutBtn) checkoutBtn.classList.remove('disabled');

    listEl.innerHTML = state.cart.map((item, index) => `
      <div class="cart-item">
        <a href="product.html?id=${item.id}">
          <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(item.name, item.category)}';" />
        </a>
        <div class="cart-item-details">
          <a href="product.html?id=${item.id}" class="cart-item-title">${item.name}</a>
          <span class="cart-item-variant">Size: ${item.selectedSize} | ${item.selectedColor}</span>
          <span class="cart-item-price">${formatMoney(item.price)}</span>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" data-cart-delta="-1" data-index="${index}" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" data-cart-delta="1" data-index="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-cart-remove="${index}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `).join('');

    // Attach listeners
    listEl.querySelectorAll('[data-cart-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10);
        const delta = parseInt(btn.dataset.cartDelta, 10);
        updateCartItemQty(idx, delta);
      });
    });

    listEl.querySelectorAll('[data-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.cartRemove, 10);
        removeCartItem(idx);
      });
    });

    // Totals
    const subtotalUSD = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    let discountUSD = 0;
    if (state.promo) {
      discountUSD = subtotalUSD * state.promo.discount;
      if (discountRow) {
        discountRow.style.display = 'flex';
        discountAmtEl.textContent = `-${formatMoney(discountUSD)} (${state.promo.code})`;
      }
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    const freeShipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD;
    const shippingUSD = freeShipping ? 0 : 35;
    const totalUSD = subtotalUSD - discountUSD + shippingUSD;

    if (subtotalEl) subtotalEl.textContent = formatMoney(subtotalUSD);
    if (shippingAmtEl) shippingAmtEl.textContent = freeShipping ? 'Complimentary' : formatMoney(shippingUSD);
    if (totalEl) totalEl.textContent = formatMoney(totalUSD);

    if (progressBar && progressText) {
      const pct = Math.min(100, Math.round((subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100));
      progressBar.style.width = `${pct}%`;
      if (freeShipping) {
        progressText.innerHTML = `✓ You unlocked <strong>Complimentary Worldwide Shipping</strong>!`;
      } else {
        const rem = FREE_SHIPPING_THRESHOLD_USD - subtotalUSD;
        progressText.innerHTML = `Add <strong>${formatMoney(rem)}</strong> for complimentary express delivery.`;
      }
    }
  }

  // Render Slide-Out Wishlist Drawer
  function renderWishlistDrawer() {
    const listEl = document.getElementById('wishlistItemsList');
    if (!listEl) return;

    if (state.wishlist.length === 0) {
      listEl.innerHTML = `
        <div class="empty-drawer-view">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-width="1.5"/>
          </svg>
          <h4>Your Wishlist is Empty</h4>
          <p>Curate your personal collection of timeless pieces.</p>
          <a href="shop.html" class="btn-primary" style="margin-top: 1rem;">Explore Collection</a>
        </div>
      `;
      return;
    }

    listEl.innerHTML = state.wishlist.map(item => `
      <div class="cart-item">
        <a href="product.html?id=${item.id}">
          <img class="cart-item-img" src="${item.images[0]}" alt="${item.name}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(item.name, item.category)}';" />
        </a>
        <div class="cart-item-details">
          <a href="product.html?id=${item.id}" class="cart-item-title">${item.name}</a>
          <span class="cart-item-variant">${item.subtitle}</span>
          <span class="cart-item-price">${formatMoney(item.price)}</span>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
            <a href="product.html?id=${item.id}" class="btn-primary" style="padding: 0.35rem 0.75rem; font-size: 0.68rem;">View Piece</a>
            <button class="btn-secondary" style="padding: 0.35rem 0.75rem; font-size: 0.68rem;" data-quick-bag="${item.id}">+ Bag</button>
          </div>
        </div>
        <button class="cart-item-remove" data-wishlist-remove="${item.id}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `).join('');

    listEl.querySelectorAll('[data-wishlist-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleWishlist(btn.dataset.wishlistRemove);
      });
    });

    listEl.querySelectorAll('[data-quick-bag]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = PRODUCTS.find(p => p.id === btn.dataset.quickBag);
        if (prod) {
          addToCart(prod);
          closeWishlistDrawer();
        }
      });
    });
  }

  // Drawer Toggles
  function openCartDrawer() {
    closeWishlistDrawer();
    closeSearch();
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const backdrop = document.getElementById('cartBackdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openWishlistDrawer() {
    closeCartDrawer();
    closeSearch();
    const drawer = document.getElementById('wishlistDrawer');
    const backdrop = document.getElementById('wishlistBackdrop');
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlistDrawer() {
    const drawer = document.getElementById('wishlistDrawer');
    const backdrop = document.getElementById('wishlistBackdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Search Overlay
  function openSearch() {
    closeCartDrawer();
    closeWishlistDrawer();
    const overlay = document.getElementById('searchOverlay');
    const input = document.getElementById('searchInput');
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (input) {
        input.value = '';
        input.focus();
        renderSearch('');
      }
    }
  }

  function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function renderSearch(query) {
    const resultsGrid = document.getElementById('searchResults');
    if (!resultsGrid) return;

    const q = query.trim().toLowerCase();
    let matches = [];

    if (q.length > 0) {
      matches = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    } else {
      matches = PRODUCTS.slice(0, 4);
    }

    if (matches.length === 0) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No results found matching "<strong>${query}</strong>". Explore our curated outerwear, knitwear or tailoring.</p>
        </div>
      `;
      return;
    }

    resultsGrid.innerHTML = matches.map(p => `
      <a href="product.html?id=${p.id}" class="look-item-card" style="display: flex; gap: 1rem; align-items: center; text-decoration: none;">
        <img src="${p.images[0]}" alt="${p.name}" style="width: 55px; height: 70px; object-fit: cover; border-radius: 2px;" onerror="this.onerror=null; this.src='${getPlaceholderSvg(p.name, p.category)}';" />
        <div style="flex-grow: 1;">
          <h4 class="look-item-title" style="font-size: 1.05rem;">${p.name}</h4>
          <span class="eyebrow">${p.category} • ${p.material}</span>
        </div>
        <span class="product-price">${formatMoney(p.price)}</span>
      </a>
    `).join('');
  }

  // Setup Global Header, Footer, and Common Listeners
  function initCommon() {
    // Currency selectors
    document.querySelectorAll('.currency-select').forEach(select => {
      select.value = state.currency;
      select.addEventListener('change', (e) => {
        setCurrency(e.target.value);
      });
    });

    // Cart Button Triggers
    document.querySelectorAll('#cartBtn').forEach(btn => {
      btn.addEventListener('click', openCartDrawer);
    });

    const cartClose = document.getElementById('cartCloseBtn');
    if (cartClose) cartClose.addEventListener('click', closeCartDrawer);

    const cartBackdrop = document.getElementById('cartBackdrop');
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);

    // Wishlist Button Triggers
    document.querySelectorAll('#wishlistBtn').forEach(btn => {
      btn.addEventListener('click', openWishlistDrawer);
    });

    const wishClose = document.getElementById('wishlistCloseBtn');
    if (wishClose) wishClose.addEventListener('click', closeWishlistDrawer);

    const wishBackdrop = document.getElementById('wishlistBackdrop');
    if (wishBackdrop) wishBackdrop.addEventListener('click', closeWishlistDrawer);

    // Search Triggers
    document.querySelectorAll('#searchBtn').forEach(btn => {
      btn.addEventListener('click', openSearch);
    });

    const searchClose = document.getElementById('searchCloseBtn');
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderSearch(e.target.value);
      });
    }

    document.querySelectorAll('.search-tag-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = pill.textContent;
          renderSearch(pill.textContent);
        }
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
        closeCartDrawer();
        closeWishlistDrawer();
      }
    });

    // Promo Code Application
    const promoApplyBtn = document.getElementById('promoApplyBtn');
    const promoInput = document.getElementById('promoInput');
    if (promoApplyBtn && promoInput) {
      promoApplyBtn.addEventListener('click', () => {
        const code = promoInput.value.trim().toUpperCase();
        if (!code) return;
        if (PROMO_CODES[code]) {
          state.promo = { code, ...PROMO_CODES[code] };
          localStorage.setItem('wd_promo', JSON.stringify(state.promo));
          renderCartDrawer();
          showToast(`Promo "${code}" applied: ${PROMO_CODES[code].label}!`);
        } else {
          showToast('Invalid promo code. Try "WARDROBE10" or "MINIMAL".');
        }
      });
    }

    // Header Scroll Effect
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }

    // Back to top
    const backToTop = document.getElementById('backToTopBtn');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavClose = document.getElementById('mobileNavClose');

    if (mobileMenuBtn && mobileNavDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileNavDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (mobileNavClose && mobileNavDrawer) {
      mobileNavClose.addEventListener('click', () => {
        mobileNavDrawer.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Newsletter Submission
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterSuccess = document.getElementById('newsletterSuccess');

    if (newsletterForm && newsletterEmail && newsletterSuccess) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const em = newsletterEmail.value.trim();
        if (em) {
          newsletterForm.style.display = 'none';
          newsletterSuccess.style.display = 'block';
          showToast('Welcome to the Atelier Private Gazette. Check your inbox.');
        }
      });
    }

    // Initial renders
    updateBadges();
    renderCartDrawer();
    renderWishlistDrawer();
  }

  // Auto-init on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommon);
  } else {
    initCommon();
  }

  // Public API
  return {
    state,
    PROMO_CODES,
    FREE_SHIPPING_THRESHOLD_USD,
    formatMoney,
    setCurrency,
    showToast,
    getPlaceholderSvg,
    addToCart,
    updateCartItemQty,
    removeCartItem,
    toggleWishlist,
    isWishlisted,
    openCartDrawer,
    closeCartDrawer,
    openWishlistDrawer,
    closeWishlistDrawer,
    openSearch,
    closeSearch,
    updateBadges
  };
})();


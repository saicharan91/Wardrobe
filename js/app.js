/**
 * WARDROBE — Interactive Application Controller
 * Handles catalog filtering, shopping cart, wishlist, quick view, lookbook hotspots,
 * currency conversion, search overlay, and checkout simulation.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currency: localStorage.getItem('wd_currency') || 'USD',
    cart: JSON.parse(localStorage.getItem('wd_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('wd_wishlist') || '[]'),
    activeCategory: 'all',
    activeGender: 'all',
    activeSort: 'featured',
    gridMode: 'standard', // 'standard' (4 cols) or 'editorial' (2 cols)
    activeLookIndex: 0,
    activePromo: JSON.parse(localStorage.getItem('wd_promo') || 'null'),
    currentQuickViewProduct: null,
    selectedSize: null,
    selectedColor: null
  };

  // Promo Codes Directory
  const PROMO_CODES = {
    WARDROBE10: { discount: 0.10, label: "10% VIP Discount" },
    MINIMAL: { discount: 0.15, label: "15% Minimalist Atelier" },
    ATELIER: { discount: 0.20, label: "20% Private Capsule" }
  };

  const FREE_SHIPPING_THRESHOLD_USD = 350;

  // DOM Elements
  const elements = {
    productsGrid: document.getElementById('productsGrid'),
    catalogCount: document.getElementById('catalogCount'),
    filterPills: document.querySelectorAll('.filter-pill'),
    sortSelect: document.getElementById('sortSelect'),
    viewButtons: document.querySelectorAll('.view-btn'),
    currencySelects: document.querySelectorAll('.currency-select'),
    
    // Cart & Wishlist Triggers
    cartBtn: document.getElementById('cartBtn'),
    cartCount: document.getElementById('cartCount'),
    cartDrawer: document.getElementById('cartDrawer'),
    cartBackdrop: document.getElementById('cartBackdrop'),
    cartCloseBtn: document.getElementById('cartCloseBtn'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartSubtotal: document.getElementById('cartSubtotal'),
    cartDiscountRow: document.getElementById('cartDiscountRow'),
    cartDiscountAmt: document.getElementById('cartDiscountAmt'),
    cartShippingAmt: document.getElementById('cartShippingAmt'),
    cartTotal: document.getElementById('cartTotal'),
    shippingProgressText: document.getElementById('shippingProgressText'),
    shippingProgressBar: document.getElementById('shippingProgressBar'),
    promoInput: document.getElementById('promoInput'),
    promoApplyBtn: document.getElementById('promoApplyBtn'),
    checkoutBtn: document.getElementById('checkoutBtn'),

    // Wishlist Drawer
    wishlistBtn: document.getElementById('wishlistBtn'),
    wishlistCount: document.getElementById('wishlistCount'),
    wishlistDrawer: document.getElementById('wishlistDrawer'),
    wishlistBackdrop: document.getElementById('wishlistBackdrop'),
    wishlistCloseBtn: document.getElementById('wishlistCloseBtn'),
    wishlistItemsList: document.getElementById('wishlistItemsList'),

    // Quick View Modal
    quickViewModal: document.getElementById('quickViewModal'),
    quickViewCloseBtn: document.getElementById('quickViewCloseBtn'),
    qvImgMain: document.getElementById('qvImgMain'),
    qvThumbs: document.getElementById('qvThumbs'),
    qvTitle: document.getElementById('qvTitle'),
    qvPrice: document.getElementById('qvPrice'),
    qvDesc: document.getElementById('qvDesc'),
    qvBadges: document.getElementById('qvBadges'),
    qvColors: document.getElementById('qvColors'),
    qvSizes: document.getElementById('qvSizes'),
    qvAddToCartBtn: document.getElementById('qvAddToCartBtn'),
    qvComposition: document.getElementById('qvComposition'),
    qvOrigin: document.getElementById('qvOrigin'),
    qvCare: document.getElementById('qvCare'),

    // Lookbook Section
    lookbookViewer: document.getElementById('lookbookViewer'),
    lookbookImg: document.getElementById('lookbookImg'),
    lookbookHotspots: document.getElementById('lookbookHotspots'),
    lookbookCounter: document.getElementById('lookbookCounter'),
    lookbookTitle: document.getElementById('lookbookTitle'),
    lookbookDesc: document.getElementById('lookbookDesc'),
    lookItemsList: document.getElementById('lookItemsList'),
    lookPrevBtn: document.getElementById('lookPrevBtn'),
    lookNextBtn: document.getElementById('lookNextBtn'),
    shopLookBtn: document.getElementById('shopLookBtn'),

    // Search Overlay
    searchBtn: document.getElementById('searchBtn'),
    searchOverlay: document.getElementById('searchOverlay'),
    searchCloseBtn: document.getElementById('searchCloseBtn'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    searchTagPills: document.querySelectorAll('.search-tag-pill'),

    // Checkout Modal
    checkoutModal: document.getElementById('checkoutModal'),
    checkoutCloseBtn: document.getElementById('checkoutCloseBtn'),
    checkoutNextBtn: document.getElementById('checkoutNextBtn'),
    checkoutBackBtn: document.getElementById('checkoutBackBtn'),
    checkoutOrderNum: document.getElementById('checkoutOrderNum'),
    checkoutOrderDate: document.getElementById('checkoutOrderDate'),
    checkoutSummaryTotal: document.getElementById('checkoutSummaryTotal'),

    // Newsletter & Header
    newsletterForm: document.getElementById('newsletterForm'),
    newsletterEmail: document.getElementById('newsletterEmail'),
    newsletterSuccess: document.getElementById('newsletterSuccess'),
    siteHeader: document.querySelector('.site-header'),
    backToTopBtn: document.getElementById('backToTopBtn'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileNavDrawer: document.getElementById('mobileNavDrawer'),
    mobileNavClose: document.getElementById('mobileNavClose'),
    toastContainer: document.getElementById('toastContainer')
  };

  // Helper: Format Currency
  function formatMoney(amountInUSD) {
    const curr = CURRENCIES[state.currency] || CURRENCIES.USD;
    const converted = amountInUSD * curr.rate;
    if (state.currency === 'JPY') {
      return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${curr.symbol}${converted.toFixed(2)}`;
  }

  // SVG Fallback Generator for Offline / Missing Images
  function getPlaceholderSvg(title, category) {
    const encodedTitle = encodeURIComponent(title || 'Wardrobe Atelier');
    const encodedCat = encodeURIComponent((category || 'Luxury Ready-to-Wear').toUpperCase());
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%23F3EFE8"/><rect x="30" y="30" width="540" height="740" fill="none" stroke="%23D8D3C8" stroke-width="1.5"/><text x="50%" y="46%" font-family="serif" font-size="24" fill="%23121212" text-anchor="middle" letter-spacing="2">${encodedTitle}</text><text x="50%" y="52%" font-family="sans-serif" font-size="12" fill="%238C8880" text-anchor="middle" letter-spacing="4">${encodedCat}</text><text x="50%" y="58%" font-family="serif" font-size="14" font-style="italic" fill="%23B85D43" text-anchor="middle">Atelier Wardrobe</text></svg>`;
  }

  // Update All Currency Displays Across Page
  function updateCurrencyEverywhere() {
    elements.currencySelects.forEach(select => {
      select.value = state.currency;
    });
    renderCatalog();
    renderCart();
    renderWishlist();
    renderLookbook();
    if (state.currentQuickViewProduct) {
      elements.qvPrice.textContent = formatMoney(state.currentQuickViewProduct.price);
    }
  }

  // Toast Notification System
  function showToast(message, actionLabel = null, actionCallback = null) {
    if (!elements.toastContainer) return;
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

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  // Catalog Filtering & Sorting
  function getFilteredProducts() {
    let list = [...PRODUCTS];

    if (state.activeCategory !== 'all') {
      list = list.filter(p => p.category === state.activeCategory);
    }

    if (state.activeGender !== 'all') {
      list = list.filter(p => p.gender === state.activeGender || p.gender === 'unisex');
    }

    if (state.activeSort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (state.activeSort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (state.activeSort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  // Render Product Catalog
  function renderCatalog() {
    const products = getFilteredProducts();
    if (elements.catalogCount) {
      elements.catalogCount.textContent = `(${products.length} Pieces)`;
    }

    if (!elements.productsGrid) return;

    if (products.length === 0) {
      elements.productsGrid.innerHTML = `
        <div class="empty-catalog">
          <h3>No garments found</h3>
          <p>Please select another category or reset your filter.</p>
          <button class="btn-secondary" id="resetFiltersBtn">Reset All Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.activeCategory = 'all';
          state.activeGender = 'all';
          elements.filterPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
          renderCatalog();
        });
      }
      return;
    }

    elements.productsGrid.innerHTML = products.map(product => {
      const isWishlisted = state.wishlist.some(item => item.id === product.id);
      const badgesHtml = product.badges
        ? product.badges.map(b => `<span class="product-badge">${b}</span>`).join('')
        : '';
      const colorsHtml = product.colors
        ? product.colors.map(c => `
            <span class="color-dot" style="background-color: ${c.hex};" title="${c.name}"></span>
          `).join('')
        : '';
      const sizesHtml = product.sizes
        ? product.sizes.map(s => `
            <button class="quick-size-btn" data-product-id="${product.id}" data-size="${s}">${s}</button>
          `).join('')
        : '';

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-media">
            <div class="product-badges">${badgesHtml}</div>
            <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-product-id="${product.id}" aria-label="Save to Wishlist" title="Save to Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <img class="product-img" src="${product.images[0]}" alt="${product.name}" loading="lazy" onerror="this.onerror=null; this.src='${getPlaceholderSvg(product.name, product.category)}';" />
            ${product.images[1] ? `<img class="product-img-secondary" src="${product.images[1]}" alt="${product.name} alternate view" loading="lazy" onerror="this.onerror=null; this.src='${getPlaceholderSvg(product.name, product.category)}';" />` : ''}
            
            <div class="product-quick-actions">
              <span class="quick-sizes-title">Quick Select Size:</span>
              <div class="quick-sizes-list">
                ${sizesHtml}
              </div>
              <a href="product.html?id=${product.id}" class="quick-view-trigger">
                Inspect Details & Fit →
              </a>
            </div>
          </div>

          <div class="product-info">
            <div class="product-colors">${colorsHtml}</div>
            <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
            <p class="product-subtitle">${product.subtitle}</p>
            <div class="product-footer-row">
              <span class="product-price">${formatMoney(product.price)}</span>
              <span class="product-meta-origin">${product.origin ? product.origin.split('in ')[1] || 'Italy' : 'Atelier'}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    bindProductCardListeners();
  }

  // Bind Listeners to Product Cards
  function bindProductCardListeners() {
    // Wishlist Click
    elements.productsGrid.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.dataset.productId;
        toggleWishlist(pid);
      });
    });

    // Quick Size Click
    elements.productsGrid.querySelectorAll('.quick-size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.dataset.productId;
        const size = btn.dataset.size;
        const product = PRODUCTS.find(p => p.id === pid);
        if (product) {
          addToCart(product, size, product.colors[0]?.name || 'Standard');
        }
      });
    });

    // Navigation links are standard <a href="product.html?id=...">
  }

  // Wishlist Functions
  function toggleWishlist(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = state.wishlist.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      state.wishlist.splice(existingIndex, 1);
      showToast(`Removed "${product.name}" from Wishlist`);
    } else {
      state.wishlist.push(product);
      showToast(`Saved "${product.name}" to Wishlist`, 'View Wishlist', openWishlistDrawer);
    }

    localStorage.setItem('wd_wishlist', JSON.stringify(state.wishlist));
    updateWishlistBadge();
    renderCatalog();
    renderWishlist();
  }

  function updateWishlistBadge() {
    const count = state.wishlist.length;
    if (elements.wishlistCount) {
      elements.wishlistCount.textContent = count;
      elements.wishlistCount.classList.add('bump');
      setTimeout(() => elements.wishlistCount.classList.remove('bump'), 300);
    }
  }

  function renderWishlist() {
    if (!elements.wishlistItemsList) return;

    if (state.wishlist.length === 0) {
      elements.wishlistItemsList.innerHTML = `
        <div class="empty-drawer-view">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-width="1.5"/>
          </svg>
          <h4>Your Wishlist is Empty</h4>
          <p>Curate your personal collection of timeless pieces.</p>
        </div>
      `;
      return;
    }

    elements.wishlistItemsList.innerHTML = state.wishlist.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.images[0]}" alt="${item.name}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(item.name, item.category)}';" />
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-variant">${item.subtitle}</span>
          <span class="cart-item-price">${formatMoney(item.price)}</span>
          <button class="btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.68rem; margin-top: 0.5rem;" data-move-id="${item.id}">
            Select & Move to Bag
          </button>
        </div>
        <button class="cart-item-remove" data-remove-wishlist="${item.id}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `).join('');

    // Listeners inside Wishlist drawer
    elements.wishlistItemsList.querySelectorAll('[data-remove-wishlist]').forEach(btn => {
      btn.addEventListener('click', () => {
        toggleWishlist(btn.dataset.removeWishlist);
      });
    });

    elements.wishlistItemsList.querySelectorAll('[data-move-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = PRODUCTS.find(p => p.id === btn.dataset.moveId);
        if (item) {
          closeWishlistDrawer();
          openQuickView(item);
        }
      });
    });
  }

  function openWishlistDrawer() {
    closeCartDrawer();
    closeQuickView();
    elements.wishlistDrawer.classList.add('active');
    elements.wishlistBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeWishlistDrawer() {
    elements.wishlistDrawer.classList.remove('active');
    elements.wishlistBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Cart Functions
  function addToCart(product, size, color) {
    const existing = state.cart.find(
      item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        selectedSize: size,
        selectedColor: color,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    openCartDrawer();
    showToast(`Added "${product.name}" (${size}) to Bag`, 'View Bag', openCartDrawer);
  }

  function updateCartItemQty(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      state.cart.splice(index, 1);
    }
    saveCart();
    renderCart();
  }

  function removeCartItem(index) {
    if (!state.cart[index]) return;
    const item = state.cart[index];
    state.cart.splice(index, 1);
    saveCart();
    renderCart();
    showToast(`Removed "${item.name}" from Bag`);
  }

  function saveCart() {
    localStorage.setItem('wd_cart', JSON.stringify(state.cart));
    updateCartBadge();
  }

  function updateCartBadge() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (elements.cartCount) {
      elements.cartCount.textContent = totalCount;
      elements.cartCount.classList.add('bump');
      setTimeout(() => elements.cartCount.classList.remove('bump'), 300);
    }
  }

  function renderCart() {
    updateCartBadge();

    if (!elements.cartItemsList) return;

    if (state.cart.length === 0) {
      elements.cartItemsList.innerHTML = `
        <div class="empty-drawer-view">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" stroke-width="1.5"/>
            <line x1="3" y1="6" x2="21" y2="6" stroke-width="1.5"/>
            <path d="M16 10a4 4 0 0 1-8 0" stroke-width="1.5"/>
          </svg>
          <h4>Your Shopping Bag is Empty</h4>
          <p>Invest in foundational pieces designed to endure.</p>
          <button class="btn-primary" id="drawerExploreBtn">Explore Collection</button>
        </div>
      `;
      const expBtn = document.getElementById('drawerExploreBtn');
      if (expBtn) {
        expBtn.addEventListener('click', () => {
          closeCartDrawer();
          window.location.hash = '#collection';
        });
      }

      // Hide or zero summary values
      elements.cartSubtotal.textContent = formatMoney(0);
      elements.cartShippingAmt.textContent = formatMoney(0);
      elements.cartTotal.textContent = formatMoney(0);
      elements.shippingProgressBar.style.width = '0%';
      elements.shippingProgressText.innerHTML = `Add <strong>${formatMoney(FREE_SHIPPING_THRESHOLD_USD)}</strong> for complimentary express delivery.`;
      if (elements.cartDiscountRow) elements.cartDiscountRow.style.display = 'none';
      if (elements.checkoutBtn) elements.checkoutBtn.disabled = true;
      return;
    }

    if (elements.checkoutBtn) elements.checkoutBtn.disabled = false;

    // Render items list
    elements.cartItemsList.innerHTML = state.cart.map((item, index) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(item.name, 'Garment')}';" />
        <div class="cart-item-details">
          <h4 class="cart-item-title">${item.name}</h4>
          <span class="cart-item-variant">Size: ${item.selectedSize} | ${item.selectedColor}</span>
          <span class="cart-item-price">${formatMoney(item.price)}</span>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" data-qty-idx="${index}" data-delta="-1" aria-label="Decrease quantity">−</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" data-qty-idx="${index}" data-delta="1" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-remove-idx="${index}" aria-label="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    `).join('');

    // Calculate financials
    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountUSD = 0;
    if (state.activePromo) {
      discountUSD = subtotalUSD * state.activePromo.discount;
      if (elements.cartDiscountRow) {
        elements.cartDiscountRow.style.display = 'flex';
        elements.cartDiscountAmt.textContent = `-${formatMoney(discountUSD)} (${state.activePromo.code})`;
      }
    } else {
      if (elements.cartDiscountRow) elements.cartDiscountRow.style.display = 'none';
    }

    const freeShipping = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD;
    const shippingUSD = freeShipping ? 0 : 35;
    const totalUSD = subtotalUSD - discountUSD + shippingUSD;

    elements.cartSubtotal.textContent = formatMoney(subtotalUSD);
    elements.cartShippingAmt.textContent = freeShipping ? 'Complimentary' : formatMoney(shippingUSD);
    elements.cartTotal.textContent = formatMoney(totalUSD);

    // Free shipping bar
    const progressPercent = Math.min(100, Math.round((subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100));
    elements.shippingProgressBar.style.width = `${progressPercent}%`;

    if (freeShipping) {
      elements.shippingProgressText.innerHTML = `✓ You have unlocked <strong>Complimentary Worldwide Express Shipping</strong>!`;
    } else {
      const remainingUSD = FREE_SHIPPING_THRESHOLD_USD - subtotalUSD;
      elements.shippingProgressText.innerHTML = `Add <strong>${formatMoney(remainingUSD)}</strong> more for complimentary shipping.`;
    }

    // Attach cart item quantity and delete listeners
    elements.cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.qtyIdx, 10);
        const delta = parseInt(btn.dataset.delta, 10);
        updateCartItemQty(idx, delta);
      });
    });

    elements.cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.removeIdx, 10);
        removeCartItem(idx);
      });
    });
  }

  function openCartDrawer() {
    closeWishlistDrawer();
    closeQuickView();
    elements.cartDrawer.classList.add('active');
    elements.cartBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    elements.cartDrawer.classList.remove('active');
    elements.cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Quick View Modal
  function openQuickView(product) {
    state.currentQuickViewProduct = product;
    state.selectedSize = product.sizes ? product.sizes[0] : 'One Size';
    state.selectedColor = product.colors ? product.colors[0].name : 'Default';

    elements.qvTitle.textContent = product.name;
    elements.qvPrice.textContent = formatMoney(product.price);
    elements.qvDesc.textContent = product.description;
    elements.qvImgMain.src = product.images[0];
    elements.qvImgMain.alt = product.name;
    elements.qvImgMain.onerror = function() {
      this.onerror = null;
      this.src = getPlaceholderSvg(product.name, product.category);
    };

    // Badges
    elements.qvBadges.innerHTML = product.badges
      ? product.badges.map(b => `<span class="product-badge">${b}</span>`).join('')
      : '';

    // Thumbs
    elements.qvThumbs.innerHTML = product.images.map((imgUrl, i) => `
      <div class="modal-thumb ${i === 0 ? 'active' : ''}" data-thumb-idx="${i}">
        <img src="${imgUrl}" alt="Thumbnail ${i + 1}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(product.name, product.category)}';" />
      </div>
    `).join('');

    elements.qvThumbs.querySelectorAll('.modal-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const idx = parseInt(thumb.dataset.thumbIdx, 10);
        elements.qvImgMain.src = product.images[idx];
        elements.qvThumbs.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });

    // Colors
    elements.qvColors.innerHTML = product.colors.map((c, i) => `
      <div class="modal-swatch ${i === 0 ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}" data-color-name="${c.name}"></div>
    `).join('');

    elements.qvColors.querySelectorAll('.modal-swatch').forEach(sw => {
      sw.addEventListener('click', () => {
        state.selectedColor = sw.dataset.colorName;
        elements.qvColors.querySelectorAll('.modal-swatch').forEach(s => s.classList.remove('active'));
        sw.classList.add('active');
      });
    });

    // Sizes
    elements.qvSizes.innerHTML = product.sizes.map((s, i) => `
      <button class="modal-size-btn ${i === 0 ? 'active' : ''}" data-size-val="${s}">${s}</button>
    `).join('');

    elements.qvSizes.querySelectorAll('.modal-size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedSize = btn.dataset.sizeVal;
        elements.qvSizes.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Accordion details
    elements.qvComposition.textContent = product.composition || '100% Traceable Sustainable Natural Fibers';
    elements.qvOrigin.textContent = product.origin || 'Tailored in Western Europe';
    elements.qvCare.textContent = product.care || 'Specialist care recommended';

    elements.quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    elements.quickViewModal.classList.remove('active');
    state.currentQuickViewProduct = null;
    document.body.style.overflow = '';
  }

  // Lookbook Story
  function renderLookbook() {
    const look = LOOKBOOK[state.activeLookIndex];
    if (!look) return;

    elements.lookbookImg.src = look.image;
    elements.lookbookImg.alt = look.title;
    elements.lookbookCounter.textContent = `LOOK 0${state.activeLookIndex + 1} / 0${LOOKBOOK.length}`;
    elements.lookbookTitle.textContent = look.title;
    elements.lookbookDesc.textContent = look.subtitle;

    // Render Hotspots
    elements.lookbookHotspots.innerHTML = look.items.map(item => `
      <div class="lookbook-hotspot" style="left: ${item.x}%; top: ${item.y}%;" data-product-id="${item.id}" aria-label="View ${item.label}">
        <span class="hotspot-tooltip">${item.label} — ${formatMoney(item.price)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
        </svg>
      </div>
    `).join('');

    // Attach Hotspot Clicks
    elements.lookbookHotspots.querySelectorAll('.lookbook-hotspot').forEach(spot => {
      spot.addEventListener('click', () => {
        const pid = spot.dataset.productId;
        const prod = PRODUCTS.find(p => p.id === pid);
        if (prod) openQuickView(prod);
      });
    });

    // Render Items Breakdown in Story Column
    elements.lookItemsList.innerHTML = look.items.map(item => {
      const fullProd = PRODUCTS.find(p => p.id === item.id);
      return `
        <div class="look-item-card" data-product-id="${item.id}" style="cursor: pointer;">
          <div>
            <h4 class="look-item-title">${item.label}</h4>
            <span class="eyebrow">${fullProd ? fullProd.category : 'Wardrobe Essential'}</span>
          </div>
          <span class="look-item-price">${formatMoney(item.price)}</span>
        </div>
      `;
    }).join('');

    elements.lookItemsList.querySelectorAll('.look-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const pid = card.dataset.productId;
        const prod = PRODUCTS.find(p => p.id === pid);
        if (prod) openQuickView(prod);
      });
    });
  }

  // Search Functions
  function openSearch() {
    elements.searchOverlay.classList.add('active');
    elements.searchInput.value = '';
    elements.searchInput.focus();
    renderSearchResults('');
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    elements.searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function renderSearchResults(query) {
    const q = query.trim().toLowerCase();
    let matches = [];

    if (q.length > 0) {
      matches = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q)
      );
    } else {
      matches = PRODUCTS.slice(0, 3); // show 3 suggestions when empty
    }

    if (matches.length === 0) {
      elements.searchResults.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-muted);">
          <p>No results found matching "<strong>${query}</strong>". Explore our curated outerwear, knitwear or tailoring.</p>
        </div>
      `;
      return;
    }

    elements.searchResults.innerHTML = matches.map(p => `
      <div class="look-item-card" data-search-id="${p.id}" style="cursor: pointer; display: flex; gap: 1rem; align-items: center;">
        <img src="${p.images[0]}" alt="${p.name}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(p.name, p.category)}';" style="width: 50px; height: 65px; object-fit: cover; border-radius: 2px;" />
        <div style="flex-grow: 1;">
          <h4 class="look-item-title" style="font-size: 1.05rem;">${p.name}</h4>
          <span class="eyebrow">${p.category}</span>
        </div>
        <span class="product-price">${formatMoney(p.price)}</span>
      </div>
    `).join('');

    elements.searchResults.querySelectorAll('[data-search-id]').forEach(card => {
      card.addEventListener('click', () => {
        const p = PRODUCTS.find(prod => prod.id === card.dataset.searchId);
        if (p) {
          closeSearch();
          openQuickView(p);
        }
      });
    });
  }

  // Simulated Checkout Experience
  let checkoutStep = 1;

  function openCheckout() {
    if (state.cart.length === 0) {
      showToast('Your shopping bag is empty.');
      return;
    }
    closeCartDrawer();
    checkoutStep = 1;
    updateCheckoutStepUI();

    const subtotalUSD = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discountUSD = 0;
    if (state.activePromo) discountUSD = subtotalUSD * state.activePromo.discount;
    const shippingUSD = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD ? 0 : 35;
    const totalUSD = subtotalUSD - discountUSD + shippingUSD;

    elements.checkoutSummaryTotal.textContent = formatMoney(totalUSD);
    elements.checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckout() {
    elements.checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateCheckoutStepUI() {
    document.querySelectorAll('.checkout-step-indicator').forEach(ind => {
      const step = parseInt(ind.dataset.step, 10);
      ind.classList.toggle('active', step <= checkoutStep);
    });

    document.querySelectorAll('.checkout-step-panel').forEach(panel => {
      const step = parseInt(panel.dataset.step, 10);
      panel.classList.toggle('active', step === checkoutStep);
    });

    if (checkoutStep === 1) {
      elements.checkoutBackBtn.style.display = 'none';
      elements.checkoutNextBtn.textContent = 'Continue to Payment';
      elements.checkoutNextBtn.style.display = 'inline-flex';
    } else if (checkoutStep === 2) {
      elements.checkoutBackBtn.style.display = 'inline-flex';
      elements.checkoutNextBtn.textContent = 'Place Order & Complete';
      elements.checkoutNextBtn.style.display = 'inline-flex';
    } else if (checkoutStep === 3) {
      // Order Confirmed
      elements.checkoutBackBtn.style.display = 'none';
      elements.checkoutNextBtn.style.display = 'none';
      const orderNum = 'WD-' + Math.floor(100000 + Math.random() * 900000);
      elements.checkoutOrderNum.textContent = `Order Reference: #${orderNum}`;
      elements.checkoutOrderDate.textContent = `Placed on ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      
      // Clear cart
      state.cart = [];
      saveCart();
      renderCart();
    }
  }

  // Initialize Event Listeners
  function initListeners() {
    // Header Scroll Effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        elements.siteHeader.classList.add('scrolled');
      } else {
        elements.siteHeader.classList.remove('scrolled');
      }
    });

    // Category Filter Pills
    elements.filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        elements.filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.activeCategory = pill.dataset.category;
        renderCatalog();
      });
    });

    // Sort Dropdown
    if (elements.sortSelect) {
      elements.sortSelect.addEventListener('change', (e) => {
        state.activeSort = e.target.value;
        renderCatalog();
      });
    }

    // View Mode Toggle (Standard 4 cols vs Editorial 2 cols)
    elements.viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.view;
        state.gridMode = mode;
        if (mode === 'editorial') {
          elements.productsGrid.classList.add('grid-editorial');
        } else {
          elements.productsGrid.classList.remove('grid-editorial');
        }
      });
    });

    // Currency Switcher
    elements.currencySelects.forEach(select => {
      select.addEventListener('change', (e) => {
        state.currency = e.target.value;
        localStorage.setItem('wd_currency', state.currency);
        updateCurrencyEverywhere();
      });
    });

    // Cart Drawer Open/Close
    elements.cartBtn.addEventListener('click', openCartDrawer);
    elements.cartCloseBtn.addEventListener('click', closeCartDrawer);
    elements.cartBackdrop.addEventListener('click', closeCartDrawer);

    // Wishlist Drawer Open/Close
    elements.wishlistBtn.addEventListener('click', openWishlistDrawer);
    elements.wishlistCloseBtn.addEventListener('click', closeWishlistDrawer);
    elements.wishlistBackdrop.addEventListener('click', closeWishlistDrawer);

    // Quick View Modal Close
    elements.quickViewCloseBtn.addEventListener('click', closeQuickView);
    elements.quickViewModal.addEventListener('click', (e) => {
      if (e.target === elements.quickViewModal) closeQuickView();
    });

    // Quick View Add To Cart Button
    elements.qvAddToCartBtn.addEventListener('click', () => {
      if (!state.currentQuickViewProduct) return;
      addToCart(state.currentQuickViewProduct, state.selectedSize, state.selectedColor);
      closeQuickView();
    });

    // Accordions inside Quick View
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.accordion-item');
        item.classList.toggle('active');
      });
    });

    // Lookbook Navigation
    elements.lookPrevBtn.addEventListener('click', () => {
      state.activeLookIndex = (state.activeLookIndex - 1 + LOOKBOOK.length) % LOOKBOOK.length;
      renderLookbook();
    });

    elements.lookNextBtn.addEventListener('click', () => {
      state.activeLookIndex = (state.activeLookIndex + 1) % LOOKBOOK.length;
      renderLookbook();
    });

    elements.shopLookBtn.addEventListener('click', () => {
      const look = LOOKBOOK[state.activeLookIndex];
      look.items.forEach(item => {
        const fullProd = PRODUCTS.find(p => p.id === item.id);
        if (fullProd) {
          addToCart(fullProd, fullProd.sizes ? fullProd.sizes[0] : 'One Size', fullProd.colors[0]?.name || 'Standard');
        }
      });
      showToast(`Added all pieces from ${look.title} to Bag!`, 'View Bag', openCartDrawer);
    });

    // Promo Code Application
    elements.promoApplyBtn.addEventListener('click', () => {
      const code = elements.promoInput.value.trim().toUpperCase();
      if (!code) return;

      if (PROMO_CODES[code]) {
        state.activePromo = { code, ...PROMO_CODES[code] };
        localStorage.setItem('wd_promo', JSON.stringify(state.activePromo));
        renderCart();
        showToast(`Promo "${code}" applied: ${PROMO_CODES[code].label}!`);
      } else {
        showToast(`Invalid promo code. Try "WARDROBE10" or "MINIMAL".`);
      }
    });

    // Search Overlay Open/Close & Keyboard Shortcut
    elements.searchBtn.addEventListener('click', openSearch);
    elements.searchCloseBtn.addEventListener('click', closeSearch);

    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
        closeCartDrawer();
        closeWishlistDrawer();
        closeQuickView();
        closeCheckout();
      }
    });

    elements.searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });

    elements.searchTagPills.forEach(tag => {
      tag.addEventListener('click', () => {
        elements.searchInput.value = tag.textContent;
        renderSearchResults(tag.textContent);
      });
    });

    // Checkout Flow
    elements.checkoutBtn.addEventListener('click', openCheckout);
    elements.checkoutCloseBtn.addEventListener('click', closeCheckout);

    elements.checkoutNextBtn.addEventListener('click', () => {
      if (checkoutStep === 1) {
        // Validation check for mock form
        const email = document.getElementById('shipEmail');
        if (email && !email.value) {
          showToast('Please provide a valid delivery email.');
          return;
        }
        checkoutStep = 2;
        updateCheckoutStepUI();
      } else if (checkoutStep === 2) {
        // Process payment mock
        elements.checkoutNextBtn.textContent = 'Processing Payment...';
        elements.checkoutNextBtn.disabled = true;
        setTimeout(() => {
          elements.checkoutNextBtn.disabled = false;
          checkoutStep = 3;
          updateCheckoutStepUI();
        }, 1000);
      }
    });

    elements.checkoutBackBtn.addEventListener('click', () => {
      if (checkoutStep > 1) {
        checkoutStep -= 1;
        updateCheckoutStepUI();
      }
    });

    const finishCheckoutBtn = document.getElementById('finishCheckoutBtn');
    if (finishCheckoutBtn) {
      finishCheckoutBtn.addEventListener('click', closeCheckout);
    }

    // Delivery Card Selectors
    document.querySelectorAll('.delivery-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.delivery-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Newsletter Submission
    if (elements.newsletterForm) {
      elements.newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = elements.newsletterEmail.value.trim();
        if (email) {
          elements.newsletterForm.style.display = 'none';
          elements.newsletterSuccess.style.display = 'block';
          showToast('Welcome to the Atelier Private Gazette. Check your inbox.');
        }
      });
    }

    // Back to Top
    if (elements.backToTopBtn) {
      elements.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Navigation Drawer
    if (elements.mobileMenuBtn && elements.mobileNavDrawer) {
      elements.mobileMenuBtn.addEventListener('click', () => {
        elements.mobileNavDrawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      });

      elements.mobileNavClose.addEventListener('click', () => {
        elements.mobileNavDrawer.classList.remove('active');
        document.body.style.overflow = '';
      });

      elements.mobileNavDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
          elements.mobileNavDrawer.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }
  }

  // App Initialization
  function init() {
    initListeners();
    updateCurrencyEverywhere();
    updateCartBadge();
    updateWishlistBadge();
    renderCatalog();
    renderCart();
    renderWishlist();
    renderLookbook();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

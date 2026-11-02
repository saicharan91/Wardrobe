/**
 * WARDROBE — Streamlined Store Engine
 * Cart Management, Product Grid, PDP Gallery, Checkout, Order Confirmation & Auth
 */

(function () {
  'use strict';

  // --- SVG Image Fallback ---
  function getPlaceholderSvg(title, category) {
    const encodedTitle = encodeURIComponent(title || 'WARDROBE');
    const encodedCat = encodeURIComponent((category || 'COLLECTION').toUpperCase());
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="100%" height="100%" fill="%23F3F4F6"/><text x="50%" y="48%" font-family="sans-serif" font-weight="600" font-size="20" fill="%23111827" text-anchor="middle">${encodedTitle}</text><text x="50%" y="53%" font-family="sans-serif" font-size="12" fill="%236B7280" text-anchor="middle" letter-spacing="2">${encodedCat}</text></svg>`;
  }

  // --- Cart State Management ---
  const CART_KEY = 'wardrobe_cart';
  const USER_KEY = 'wardrobe_user';
  const ORDER_KEY = 'wardrobe_last_order';

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
    updateCartBadge();
  }

  function addToCart(productId, size = null, color = null, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const chosenSize = size || (product.sizes ? product.sizes[0] : 'One Size');
    const chosenColor = color || (product.colors ? product.colors[0].name : 'Default');
    const cart = getCart();

    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === chosenSize && item.color === chosenColor
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.images[0],
        size: chosenSize,
        color: chosenColor,
        quantity: quantity
      });
    }

    saveCart(cart);
    showToast(`Added "${product.name}" to bag`);
  }

  function updateCartQty(index, delta) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    saveCart(cart);
    if (document.getElementById('cartPageContainer')) {
      renderCartPage();
    }
  }

  function removeFromCart(index) {
    const cart = getCart();
    if (!cart[index]) return;
    const removed = cart.splice(index, 1)[0];
    saveCart(cart);
    if (document.getElementById('cartPageContainer')) {
      renderCartPage();
    }
    showToast(`Removed "${removed.name}" from bag`);
  }

  function updateCartBadge() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
    });
  }

  // --- Auth / User State ---
  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY)) || null;
    } catch (e) {
      return null;
    }
  }

  function setUser(userData) {
    if (userData) {
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    updateUserNav();
  }

  function updateUserNav() {
    const user = getUser();
    document.querySelectorAll('.nav-user-btn').forEach(btn => {
      if (user && user.loggedIn) {
        btn.textContent = user.name || 'Account';
        btn.title = `Signed in as ${user.email} (Click to sign out)`;
      } else {
        btn.textContent = 'Sign In';
        btn.title = 'Sign In / Account';
      }
    });
  }

  function initAuthModal() {
    updateUserNav();

    const backdrop = document.getElementById('loginModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const form = document.getElementById('loginForm');
    const demoBtn = document.getElementById('btnDemoLogin');

    function openModal() {
      const user = getUser();
      if (user && user.loggedIn) {
        if (confirm(`You are signed in as ${user.email}. Do you want to sign out?`)) {
          setUser(null);
          showToast('Signed out successfully');
        }
        return;
      }
      if (backdrop) backdrop.classList.add('open');
    }

    function closeModal() {
      if (backdrop) backdrop.classList.remove('open');
    }

    document.querySelectorAll('.nav-user-btn').forEach(btn => {
      btn.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const namePart = email.split('@')[0] || 'Member';
        const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        setUser({ email, name: capitalized, loggedIn: true });
        closeModal();
        showToast(`Welcome, ${capitalized}!`);
      });
    }

    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        setUser({ email: 'client@wardrobe.com', name: 'Alex M.', loggedIn: true });
        closeModal();
        showToast('Signed in as Alex M. (Demo Account)');
      });
    }
  }

  // --- Toast Notification ---
  function showToast(message) {
    let toast = document.getElementById('storeToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'storeToast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // --- Formatting Helpers ---
  function formatMoney(amount) {
    return `$${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  // ==========================================================================
  // Storefront Logic (index.html)
  // ==========================================================================
  function initStorefront() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    let activeCategory = 'all';

    function renderProducts() {
      const filtered = activeCategory === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

      grid.innerHTML = filtered.map(product => {
        const fallbackImg = getPlaceholderSvg(product.name, product.category);
        return `
          <article class="product-card">
            <a href="product.html?id=${product.id}" class="product-image-link" aria-label="View ${product.name}">
              <img 
                src="${product.images[0]}" 
                alt="${product.name}" 
                class="product-image"
                loading="lazy"
                onerror="this.onerror=null; this.src='${fallbackImg}';"
              />
            </a>
            <div class="product-info">
              <div class="product-meta">
                <span class="product-category">${product.category}</span>
                <span class="product-price">${formatMoney(product.price)}</span>
              </div>
              <h3 class="product-title">
                <a href="product.html?id=${product.id}">${product.name}</a>
              </h3>
              <button 
                type="button" 
                class="btn-add-cart" 
                data-id="${product.id}"
                aria-label="Add ${product.name} to Bag"
              >
                Add to Bag
              </button>
            </div>
          </article>
        `;
      }).join('');

      // Bind quick add buttons
      grid.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          addToCart(id);
          const originalText = e.currentTarget.textContent;
          e.currentTarget.textContent = 'Added ✓';
          e.currentTarget.classList.add('added');
          setTimeout(() => {
            e.currentTarget.textContent = originalText;
            e.currentTarget.classList.remove('added');
          }, 1200);
        });
      });
    }

    // Category Tabs Handler
    const tabsContainer = document.getElementById('categoryTabs');
    if (tabsContainer) {
      tabsContainer.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          tabsContainer.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          activeCategory = pill.getAttribute('data-category');
          renderProducts();
        });
      });
    }

    renderProducts();
  }

  // ==========================================================================
  // Product Detail Page (product.html)
  // ==========================================================================
  function initProductDetail() {
    const container = document.getElementById('productDetailContainer');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id') || 'wd-01';
    const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

    document.title = `${product.name} — WARDROBE`;

    let selectedColor = product.colors && product.colors.length ? product.colors[0].name : '';
    let selectedSize = product.sizes && product.sizes.length ? product.sizes[0] : '';
    let quantity = 1;

    const fallbackImg = getPlaceholderSvg(product.name, product.category);

    container.innerHTML = `
      <a href="index.html" class="pdp-back-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Collection
      </a>

      <div class="pdp-layout">
        <!-- Gallery -->
        <div class="pdp-gallery">
          <div class="pdp-main-image-wrap">
            <img 
              id="pdpMainImg" 
              src="${product.images[0]}" 
              alt="${product.name}" 
              class="pdp-main-image"
              onerror="this.onerror=null; this.src='${fallbackImg}';"
            />
          </div>
          <div class="pdp-thumbnails">
            ${product.images.map((img, idx) => `
              <button 
                type="button" 
                class="pdp-thumb ${idx === 0 ? 'active' : ''}" 
                data-src="${img}"
                aria-label="View photo ${idx + 1}"
              >
                <img src="${img}" alt="" onerror="this.onerror=null; this.src='${fallbackImg}';" />
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Product Details -->
        <div class="pdp-details">
          <span class="pdp-category">${product.category}</span>
          <h1 class="pdp-title">${product.name}</h1>
          <div class="pdp-price">${formatMoney(product.price)}</div>

          <!-- Color Selector -->
          ${product.colors && product.colors.length ? `
            <div class="pdp-section-label">Color: <span id="selectedColorLabel" style="font-weight: 400; color: var(--text-muted);">${selectedColor}</span></div>
            <div class="pdp-swatches" id="colorSwatches">
              ${product.colors.map((c, idx) => `
                <button 
                  type="button" 
                  class="swatch-btn ${idx === 0 ? 'active' : ''}" 
                  data-color="${c.name}" 
                  title="${c.name}"
                  aria-label="Select color ${c.name}"
                >
                  <span class="swatch-inner" style="background-color: ${c.hex};"></span>
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Size Selector -->
          ${product.sizes && product.sizes.length ? `
            <div class="pdp-section-label">Size</div>
            <div class="pdp-sizes" id="sizeSelector">
              ${product.sizes.map((s, idx) => `
                <button 
                  type="button" 
                  class="size-btn ${idx === 0 ? 'active' : ''}" 
                  data-size="${s}"
                  aria-label="Select size ${s}"
                >
                  ${s}
                </button>
              `).join('')}
            </div>
          ` : ''}

          <!-- Quantity and Add to Bag Button -->
          <div class="pdp-actions">
            <div class="qty-input-wrap">
              <button type="button" class="qty-btn" id="qtyMinus" aria-label="Decrease quantity">−</button>
              <span class="qty-display" id="qtyDisplay">1</span>
              <button type="button" class="qty-btn" id="qtyPlus" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="pdp-add-btn" id="pdpAddBtn">
              Add to Bag
            </button>
          </div>

          <!-- Description & Details -->
          <div class="pdp-desc-box">
            <p class="pdp-desc-text">${product.description || ''}</p>
            <div class="pdp-spec-list">
              ${product.composition ? `
                <div class="pdp-spec-item">
                  <span class="pdp-spec-name">Composition</span>
                  <span class="pdp-spec-value">${product.composition}</span>
                </div>
              ` : ''}
              ${product.origin ? `
                <div class="pdp-spec-item">
                  <span class="pdp-spec-name">Origin</span>
                  <span class="pdp-spec-value">${product.origin}</span>
                </div>
              ` : ''}
              ${product.care ? `
                <div class="pdp-spec-item">
                  <span class="pdp-spec-name">Care</span>
                  <span class="pdp-spec-value">${product.care}</span>
                </div>
              ` : ''}
              <div class="pdp-spec-item">
                <span class="pdp-spec-name">Shipping</span>
                <span class="pdp-spec-value">Complimentary express delivery</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Related Products -->
      <section class="related-section">
        <h2>You May Also Like</h2>
        <div class="products-grid" id="relatedGrid"></div>
      </section>
    `;

    // Gallery Thumbnails Binding
    const mainImg = document.getElementById('pdpMainImg');
    container.querySelectorAll('.pdp-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        container.querySelectorAll('.pdp-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const newSrc = thumb.getAttribute('data-src');
        if (mainImg) mainImg.src = newSrc;
      });
    });

    // Swatches Binding
    const colorLabel = document.getElementById('selectedColorLabel');
    container.querySelectorAll('.swatch-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedColor = btn.getAttribute('data-color');
        if (colorLabel) colorLabel.textContent = selectedColor;
      });
    });

    // Size Selector Binding
    container.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.getAttribute('data-size');
      });
    });

    // Quantity Handlers
    const qtyDisplay = document.getElementById('qtyDisplay');
    const minusBtn = document.getElementById('qtyMinus');
    const plusBtn = document.getElementById('qtyPlus');

    if (minusBtn && plusBtn && qtyDisplay) {
      minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
          quantity -= 1;
          qtyDisplay.textContent = quantity;
        }
      });
      plusBtn.addEventListener('click', () => {
        quantity += 1;
        qtyDisplay.textContent = quantity;
      });
    }

    // Add to Bag Binding
    const addBtn = document.getElementById('pdpAddBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart(product.id, selectedSize, selectedColor, quantity);
        const originalText = addBtn.textContent;
        addBtn.textContent = 'Added to Bag ✓';
        addBtn.style.backgroundColor = 'var(--success)';
        setTimeout(() => {
          addBtn.textContent = originalText;
          addBtn.style.backgroundColor = '';
        }, 1200);
      });
    }

    // Render Related Products
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
      const related = (product.relatedIds || [])
        .map(id => PRODUCTS.find(p => p.id === id))
        .filter(Boolean)
        .slice(0, 4);

      const displayItems = related.length ? related : PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

      relatedGrid.innerHTML = displayItems.map(item => `
        <article class="product-card">
          <a href="product.html?id=${item.id}" class="product-image-link" aria-label="View ${item.name}">
            <img 
              src="${item.images[0]}" 
              alt="${item.name}" 
              class="product-image" 
              loading="lazy"
              onerror="this.onerror=null; this.src='${getPlaceholderSvg(item.name, item.category)}';"
            />
          </a>
          <div class="product-info">
            <div class="product-meta">
              <span class="product-category">${item.category}</span>
              <span class="product-price">${formatMoney(item.price)}</span>
            </div>
            <h3 class="product-title">
              <a href="product.html?id=${item.id}">${item.name}</a>
            </h3>
            <button 
              type="button" 
              class="btn-add-cart" 
              data-id="${item.id}"
              aria-label="Add ${item.name} to Bag"
            >
              Add to Bag
            </button>
          </div>
        </article>
      `).join('');

      relatedGrid.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          addToCart(id);
          const orig = e.currentTarget.textContent;
          e.currentTarget.textContent = 'Added ✓';
          e.currentTarget.classList.add('added');
          setTimeout(() => {
            e.currentTarget.textContent = orig;
            e.currentTarget.classList.remove('added');
          }, 1200);
        });
      });
    }
  }

  // ==========================================================================
  // Shopping Cart Page (cart.html)
  // ==========================================================================
  function renderCartPage() {
    const container = document.getElementById('cartPageContainer');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <h2>Your Bag is Empty</h2>
          <p>Discover our enduring garments and timeless essentials.</p>
          <a href="index.html" class="checkout-btn" style="max-width: 240px; margin: 0 auto; text-decoration: none;">
            Explore Collection
          </a>
        </div>
      `;
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    container.innerHTML = `
      <div class="cart-layout">
        <div class="cart-items-wrap">
          ${cart.map((item, idx) => {
            const fallbackImg = getPlaceholderSvg(item.name, item.category);
            return `
              <div class="cart-item-row">
                <div class="cart-item-img">
                  <a href="product.html?id=${item.id}">
                    <img 
                      src="${item.image}" 
                      alt="${item.name}" 
                      onerror="this.onerror=null; this.src='${fallbackImg}';"
                    />
                  </a>
                </div>
                <div class="cart-item-info">
                  <h3 class="cart-item-name">
                    <a href="product.html?id=${item.id}">${item.name}</a>
                  </h3>
                  <div class="cart-item-attr">
                    ${item.color ? `Color: ${item.color}` : ''} 
                    ${item.size ? `• Size: ${item.size}` : ''}
                  </div>
                  <div class="cart-item-price">${formatMoney(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                  <div class="cart-qty-wrap">
                    <button type="button" class="cart-qty-btn btn-cart-minus" data-index="${idx}" aria-label="Decrease quantity">−</button>
                    <span class="cart-qty-val">${item.quantity}</span>
                    <button type="button" class="cart-qty-btn btn-cart-plus" data-index="${idx}" aria-label="Increase quantity">+</button>
                  </div>
                  <button type="button" class="cart-remove-btn" data-index="${idx}">
                    Remove
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Order Summary -->
        <aside class="cart-summary-box">
          <h2 class="cart-summary-title">Order Summary</h2>
          <div class="summary-line">
            <span>Subtotal</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
          <div class="summary-line">
            <span>Shipping</span>
            <span>Complimentary</span>
          </div>
          <div class="summary-line total">
            <span>Estimated Total</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
          <a href="checkout.html" class="checkout-btn" style="text-decoration: none;">
            Proceed to Checkout
          </a>
          <a href="index.html" class="continue-shopping-link">
            ← Continue Shopping
          </a>
        </aside>
      </div>
    `;

    // Quantity Increment / Decrement
    container.querySelectorAll('.btn-cart-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        updateCartQty(idx, -1);
      });
    });

    container.querySelectorAll('.btn-cart-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        updateCartQty(idx, 1);
      });
    });

    // Remove buttons
    container.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        removeFromCart(idx);
      });
    });
  }

  // ==========================================================================
  // Checkout Page (checkout.html)
  // ==========================================================================
  function initCheckoutPage() {
    const container = document.getElementById('checkoutContainer');
    if (!container) return;

    const cart = getCart();
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <h2>Your Bag is Empty</h2>
          <p>Please add items to your shopping bag before proceeding to checkout.</p>
          <a href="index.html" class="checkout-btn" style="max-width: 240px; margin: 0 auto; text-decoration: none;">
            Explore Collection
          </a>
        </div>
      `;
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const user = getUser();

    container.innerHTML = `
      <div class="checkout-layout">
        <!-- Form Column -->
        <form id="checkoutForm" class="checkout-form">
          <!-- 1. Contact -->
          <section class="checkout-section">
            <div class="checkout-section-title">
              <span>1. Contact Details</span>
              <button type="button" class="demo-fill-btn" id="btnFillDemo">Auto-fill Demo Info</button>
            </div>
            <div class="checkout-grid">
              <div class="checkout-col-full">
                <label class="checkout-field-label" for="custEmail">Email Address</label>
                <input type="email" id="custEmail" required placeholder="name@example.com" value="${user ? user.email : ''}" />
              </div>
              <div class="checkout-col-full">
                <label class="checkout-field-label" for="custPhone">Phone Number</label>
                <input type="tel" id="custPhone" required placeholder="+1 (555) 019-2834" />
              </div>
            </div>
          </section>

          <!-- 2. Shipping Address -->
          <section class="checkout-section">
            <h2 class="checkout-section-title">2. Shipping Address</h2>
            <div class="checkout-grid">
              <div>
                <label class="checkout-field-label" for="shipFirst">First Name</label>
                <input type="text" id="shipFirst" required placeholder="Elena" value="${user && user.name ? user.name.split(' ')[0] : ''}" />
              </div>
              <div>
                <label class="checkout-field-label" for="shipLast">Last Name</label>
                <input type="text" id="shipLast" required placeholder="Rostova" value="${user && user.name && user.name.split(' ')[1] ? user.name.split(' ')[1] : ''}" />
              </div>
              <div class="checkout-col-full">
                <label class="checkout-field-label" for="shipAddr">Street Address</label>
                <input type="text" id="shipAddr" required placeholder="428 Mercer Street, Floor 4" />
              </div>
              <div>
                <label class="checkout-field-label" for="shipCity">City</label>
                <input type="text" id="shipCity" required placeholder="New York" />
              </div>
              <div>
                <label class="checkout-field-label" for="shipPostal">Postal / ZIP Code</label>
                <input type="text" id="shipPostal" required placeholder="10013" />
              </div>
              <div class="checkout-col-full">
                <label class="checkout-field-label" for="shipCountry">Country</label>
                <select id="shipCountry" required>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
          </section>

          <!-- 3. Payment Method -->
          <section class="checkout-section">
            <h2 class="checkout-section-title">3. Payment Method (Demo)</h2>
            <div class="payment-pill-tabs">
              <button type="button" class="payment-tab active" data-tab="card">Credit Card</button>
              <button type="button" class="payment-tab" data-tab="apple">Apple Pay</button>
              <button type="button" class="payment-tab" data-tab="cod">Pay on Delivery</button>
            </div>

            <div id="cardFields" class="checkout-grid">
              <div class="checkout-col-full">
                <label class="checkout-field-label" for="cardNum">Card Number</label>
                <input type="text" id="cardNum" required placeholder="4242 •••• •••• 4242" value="4242 4242 4242 4242" />
              </div>
              <div>
                <label class="checkout-field-label" for="cardExp">Expiry Date</label>
                <input type="text" id="cardExp" required placeholder="MM/YY" value="12/28" />
              </div>
              <div>
                <label class="checkout-field-label" for="cardCvc">CVC</label>
                <input type="text" id="cardCvc" required placeholder="CVC" value="345" />
              </div>
            </div>
          </section>

          <button type="submit" class="checkout-btn" style="height: 52px; font-size: 1rem;">
            Place Order (${formatMoney(subtotal)})
          </button>
        </form>

        <!-- Right Summary Column -->
        <aside class="cart-summary-box">
          <h2 class="cart-summary-title">Order Items (${cart.reduce((s, i) => s + i.quantity, 0)})</h2>
          
          <div class="checkout-items-list">
            ${cart.map(item => `
              <div class="checkout-item-compact">
                <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null; this.src='${getPlaceholderSvg(item.name, item.category)}';" />
                <div class="checkout-item-compact-info">
                  <div class="checkout-item-compact-title">${item.name}</div>
                  <div class="checkout-item-compact-meta">
                    Qty: ${item.quantity} ${item.color ? `• ${item.color}` : ''} ${item.size ? `• ${item.size}` : ''}
                  </div>
                </div>
                <div class="checkout-item-compact-price">${formatMoney(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>

          <div class="summary-line">
            <span>Subtotal</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
          <div class="summary-line">
            <span>Express Courier</span>
            <span>Complimentary</span>
          </div>
          <div class="summary-line total">
            <span>Total to Pay</span>
            <span>${formatMoney(subtotal)}</span>
          </div>
        </aside>
      </div>
    `;

    // Demo fill button
    const demoFillBtn = document.getElementById('btnFillDemo');
    if (demoFillBtn) {
      demoFillBtn.addEventListener('click', () => {
        document.getElementById('custEmail').value = 'elena.rostova@atelier.com';
        document.getElementById('custPhone').value = '+1 (212) 555-0198';
        document.getElementById('shipFirst').value = 'Elena';
        document.getElementById('shipLast').value = 'Rostova';
        document.getElementById('shipAddr').value = '428 Mercer Street, Loft 6';
        document.getElementById('shipCity').value = 'New York';
        document.getElementById('shipPostal').value = '10013';
        document.getElementById('shipCountry').value = 'United States';
        showToast('Demo checkout information filled');
      });
    }

    // Payment tab switcher
    container.querySelectorAll('.payment-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        container.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cardFields = document.getElementById('cardFields');
        if (tab.getAttribute('data-tab') === 'card') {
          if (cardFields) cardFields.style.display = 'grid';
        } else {
          if (cardFields) cardFields.style.display = 'none';
        }
      });
    });

    // Form submit -> generate order & redirect
    const form = document.getElementById('checkoutForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const orderId = 'WD-' + Math.floor(100000 + Math.random() * 900000);
        const orderData = {
          orderId,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          items: cart,
          subtotal,
          email: document.getElementById('custEmail').value,
          customerName: `${document.getElementById('shipFirst').value} ${document.getElementById('shipLast').value}`,
          shippingAddress: `${document.getElementById('shipAddr').value}, ${document.getElementById('shipCity').value}, ${document.getElementById('shipPostal').value}, ${document.getElementById('shipCountry').value}`
        };

        try {
          localStorage.setItem(ORDER_KEY, JSON.stringify(orderData));
          localStorage.removeItem(CART_KEY);
        } catch (err) {
          console.error('Failed to store order:', err);
        }

        updateCartBadge();
        window.location.href = 'order-confirmation.html';
      });
    }
  }

  // ==========================================================================
  // Order Confirmation (Thank-You) Page (order-confirmation.html)
  // ==========================================================================
  function initConfirmationPage() {
    const container = document.getElementById('confirmationContainer');
    if (!container) return;

    let order = null;
    try {
      order = JSON.parse(localStorage.getItem(ORDER_KEY));
    } catch (e) {
      order = null;
    }

    if (!order) {
      // Sample mock order if opened directly
      order = {
        orderId: 'WD-782914',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        items: [
          {
            name: 'Double-Faced Cashmere Wrap Coat',
            price: 1150,
            quantity: 1,
            color: 'Oatmeal Camel',
            size: 'S'
          }
        ],
        subtotal: 1150,
        email: 'client@wardrobe.com',
        customerName: 'Elena Rostova',
        shippingAddress: '428 Mercer Street, New York, 10013, United States'
      };
    }

    container.innerHTML = `
      <div class="confirmation-card">
        <div class="conf-check-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h1 class="conf-title">Thank You For Your Order</h1>
        <p class="conf-order-id">Order Reference: <strong>#${order.orderId}</strong> • Placed on ${order.date}</p>
        <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 2rem;">
          A digital invoice and order confirmation has been dispatched to <strong>${order.email}</strong>.
        </p>

        <div class="conf-details-box">
          <div class="conf-row">
            <span style="font-weight: 600;">Recipient</span>
            <span>${order.customerName}</span>
          </div>
          <div class="conf-row">
            <span style="font-weight: 600;">Shipping Destination</span>
            <span style="text-align: right; max-width: 60%;">${order.shippingAddress}</span>
          </div>
          <div class="conf-row">
            <span style="font-weight: 600;">Shipping Method</span>
            <span>Complimentary Express Courier</span>
          </div>
          <div class="conf-row" style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-top: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--border);">
            <span>Total Paid</span>
            <span>${formatMoney(order.subtotal)}</span>
          </div>
        </div>

        <div style="margin-bottom: 2rem; text-align: left;">
          <h3 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.75rem;">Garments Ordered</h3>
          <div style="border-top: 1px solid var(--border);">
            ${order.items.map(item => `
              <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-size: 0.88rem;">
                <div>
                  <div style="font-weight: 600;">${item.name}</div>
                  <div style="color: var(--text-muted); font-size: 0.78rem;">Qty: ${item.quantity} ${item.color ? `• ${item.color}` : ''} ${item.size ? `• ${item.size}` : ''}</div>
                </div>
                <div style="font-weight: 600;">${formatMoney(item.price * item.quantity)}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <a href="index.html" class="checkout-btn" style="text-decoration: none; max-width: 260px; margin: 0 auto;">
          Continue Shopping
        </a>
      </div>
    `;
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    initAuthModal();

    if (document.getElementById('productsGrid')) {
      initStorefront();
    }

    if (document.getElementById('productDetailContainer')) {
      initProductDetail();
    }

    if (document.getElementById('cartPageContainer')) {
      renderCartPage();
    }

    if (document.getElementById('checkoutContainer')) {
      initCheckoutPage();
    }

    if (document.getElementById('confirmationContainer')) {
      initConfirmationPage();
    }
  });

  // Export functions to window
  window.WardrobeStore = {
    addToCart,
    getCart,
    updateCartQty,
    removeFromCart,
    getUser,
    setUser
  };
})();

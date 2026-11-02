/**
 * WARDROBE — Streamlined Store Engine
 * Cart Management, Product Grid, PDP Gallery & Cart Page Rendering
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

      // If no relatedIds, pick products from same category
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
          <button type="button" class="checkout-btn" id="btnCheckout">
            Proceed to Checkout
          </button>
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

    // Checkout button demo action
    const checkoutBtn = document.getElementById('btnCheckout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        alert('Thank you for exploring WARDROBE! This is a demo checkout order.');
      });
    }
  }

  // --- Initializer ---
  document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    if (document.getElementById('productsGrid')) {
      initStorefront();
    }

    if (document.getElementById('productDetailContainer')) {
      initProductDetail();
    }

    if (document.getElementById('cartPageContainer')) {
      renderCartPage();
    }
  });

  // Export functions to window if needed
  window.WardrobeStore = {
    addToCart,
    getCart,
    updateCartQty,
    removeFromCart
  };
})();

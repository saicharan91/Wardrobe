/**
 * WARDROBE — Product Detail Page (PDP) Interactive Controller
 * Dynamic data population from query parameter, gallery zoom, size guide, reviews & cross-sell.
 */

(function () {
  'use strict';

  let currentProduct = null;
  let selectedSize = null;
  let selectedColor = null;
  let quantity = 1;

  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  function initPDP() {
    const productId = getQueryParam('id') || 'wd-01';
    currentProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

    selectedSize = currentProduct.sizes ? currentProduct.sizes[0] : 'One Size';
    selectedColor = currentProduct.colors ? currentProduct.colors[0].name : 'Standard';
    quantity = 1;

    renderBreadcrumbs();
    renderGallery();
    renderProductInfo();
    renderSizeGuideModal();
    renderRelatedProducts();
    renderReviews();
    bindActionListeners();

    // Re-render when currency changes
    window.addEventListener('wardrobe:currency-changed', () => {
      renderProductInfo();
      renderRelatedProducts();
    });

    window.addEventListener('wardrobe:wishlist-updated', () => {
      updateWishlistButton();
    });
  }

  function renderBreadcrumbs() {
    const bcContainer = document.getElementById('pdpBreadcrumbs');
    if (!bcContainer) return;
    bcContainer.innerHTML = `
      <a href="index.html">Home</a>
      <span class="separator">/</span>
      <a href="shop.html">Shop</a>
      <span class="separator">/</span>
      <a href="shop.html?category=${currentProduct.category}">${currentProduct.category}</a>
      <span class="separator">/</span>
      <span class="current">${currentProduct.name}</span>
    `;
    document.title = `${currentProduct.name} — WARDROBE Atelier`;
  }

  function renderGallery() {
    const mainImg = document.getElementById('pdpMainImg');
    const thumbsCol = document.getElementById('pdpThumbsCol');

    if (mainImg) {
      mainImg.src = currentProduct.images[0];
      mainImg.alt = currentProduct.name;
      mainImg.onerror = function() {
        this.onerror = null;
        this.src = Wardrobe.getPlaceholderSvg(currentProduct.name, currentProduct.category);
      };
    }

    if (thumbsCol) {
      thumbsCol.innerHTML = currentProduct.images.map((img, idx) => `
        <div class="pdp-thumb-item ${idx === 0 ? 'active' : ''}" data-thumb-idx="${idx}">
          <img src="${img}" alt="${currentProduct.name} view ${idx + 1}" onerror="this.onerror=null; this.src='${Wardrobe.getPlaceholderSvg(currentProduct.name, currentProduct.category)}';" />
        </div>
      `).join('');

      thumbsCol.querySelectorAll('.pdp-thumb-item').forEach(thumb => {
        thumb.addEventListener('click', () => {
          const idx = parseInt(thumb.dataset.thumbIdx, 10);
          if (mainImg) mainImg.src = currentProduct.images[idx];
          thumbsCol.querySelectorAll('.pdp-thumb-item').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }
  }

  function renderProductInfo() {
    const titleEl = document.getElementById('pdpTitle');
    const priceEl = document.getElementById('pdpPrice');
    const descEl = document.getElementById('pdpDesc');
    const badgesRow = document.getElementById('pdpBadgesRow');
    const ratingJump = document.getElementById('pdpRatingJump');
    const stockBadge = document.getElementById('pdpStockBadge');
    const activeColorLabel = document.getElementById('pdpActiveColorLabel');
    const swatchesContainer = document.getElementById('pdpColorSwatches');
    const sizesContainer = document.getElementById('pdpSizesList');
    const compositionEl = document.getElementById('pdpComposition');
    const originEl = document.getElementById('pdpOrigin');
    const careEl = document.getElementById('pdpCare');
    const modelStatsEl = document.getElementById('pdpModelStats');

    if (titleEl) titleEl.textContent = currentProduct.name;
    if (priceEl) priceEl.textContent = Wardrobe.formatMoney(currentProduct.price);
    if (descEl) descEl.textContent = currentProduct.description;

    if (badgesRow) {
      badgesRow.innerHTML = currentProduct.badges.map(b => `
        <span class="product-badge">${b}</span>
      `).join('');
    }

    if (ratingJump) {
      ratingJump.innerHTML = `
        <span class="review-stars">★ ★ ★ ★ ★</span>
        <span>${currentProduct.rating.toFixed(1)} (${currentProduct.reviewsCount} Reviews)</span>
      `;
    }

    if (stockBadge) {
      if (currentProduct.stockStatus === 'Low Stock') {
        stockBadge.style.display = 'inline-flex';
        stockBadge.innerHTML = `<span class="dot"></span> Only ${currentProduct.stockRemaining} items remaining in atelier stock`;
      } else {
        stockBadge.style.display = 'inline-flex';
        stockBadge.style.background = '#F0FDF4';
        stockBadge.style.color = '#15803D';
        stockBadge.style.borderColor = '#DCFCE7';
        stockBadge.innerHTML = `<span class="dot" style="background: #16A34A;"></span> In Stock — Tailored and ready for dispatch`;
      }
    }

    if (activeColorLabel) activeColorLabel.textContent = selectedColor;

    if (swatchesContainer) {
      swatchesContainer.innerHTML = currentProduct.colors.map(c => `
        <div class="pdp-color-swatch ${c.name === selectedColor ? 'active' : ''}" style="background-color: ${c.hex};" title="${c.name}" data-color-name="${c.name}"></div>
      `).join('');

      swatchesContainer.querySelectorAll('.pdp-color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          selectedColor = sw.dataset.colorName;
          if (activeColorLabel) activeColorLabel.textContent = selectedColor;
          swatchesContainer.querySelectorAll('.pdp-color-swatch').forEach(s => s.classList.remove('active'));
          sw.classList.add('active');
        });
      });
    }

    if (sizesContainer) {
      sizesContainer.innerHTML = currentProduct.sizes.map(s => `
        <button class="pdp-size-btn ${s === selectedSize ? 'active' : ''}" data-size-val="${s}">${s}</button>
      `).join('');

      sizesContainer.querySelectorAll('.pdp-size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedSize = btn.dataset.sizeVal;
          sizesContainer.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
    }

    if (compositionEl) compositionEl.textContent = currentProduct.composition;
    if (originEl) originEl.textContent = currentProduct.origin;
    if (careEl) careEl.textContent = currentProduct.care;
    if (modelStatsEl) modelStatsEl.textContent = currentProduct.modelStats || "Model is 5'10\" wearing size S.";

    updateWishlistButton();
  }

  function updateWishlistButton() {
    const wishBtn = document.getElementById('pdpWishBtn');
    if (!wishBtn) return;
    const isFav = Wardrobe.isWishlisted(currentProduct.id);
    wishBtn.classList.toggle('active', isFav);
  }

  function bindActionListeners() {
    // Quantity picker
    const decBtn = document.getElementById('pdpQtyDec');
    const incBtn = document.getElementById('pdpQtyInc');
    const qtyVal = document.getElementById('pdpQtyVal');

    if (decBtn) {
      decBtn.addEventListener('click', () => {
        if (quantity > 1) {
          quantity -= 1;
          if (qtyVal) qtyVal.textContent = quantity;
        }
      });
    }

    if (incBtn) {
      incBtn.addEventListener('click', () => {
        quantity += 1;
        if (qtyVal) qtyVal.textContent = quantity;
      });
    }

    // Add to Bag Button
    const addBtn = document.getElementById('pdpAddBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addBtn.textContent = 'Adding to Bag...';
        addBtn.disabled = true;

        setTimeout(() => {
          Wardrobe.addToCart(currentProduct, selectedSize, selectedColor, quantity);
          addBtn.textContent = 'Added to Bag ✓';
          setTimeout(() => {
            addBtn.textContent = 'Add to Shopping Bag';
            addBtn.disabled = false;
          }, 1500);
        }, 400);
      });
    }

    // Wishlist Button
    const wishBtn = document.getElementById('pdpWishBtn');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        Wardrobe.toggleWishlist(currentProduct.id);
      });
    }

    // Accordions
    document.querySelectorAll('.accordion-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const item = hdr.closest('.accordion-item');
        item.classList.toggle('active');
      });
    });

    // Rating jump link
    const ratingJump = document.getElementById('pdpRatingJump');
    if (ratingJump) {
      ratingJump.addEventListener('click', () => {
        const rev = document.getElementById('reviewsSection');
        if (rev) rev.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // Size Guide Modal
  function renderSizeGuideModal() {
    const modal = document.getElementById('sizeGuideModal');
    const trigger = document.getElementById('openSizeGuideBtn');
    const closeBtn = document.getElementById('closeSizeGuideBtn');

    if (trigger && modal) {
      trigger.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // Cross-Sell Recommendations
  function renderRelatedProducts() {
    const container = document.getElementById('pdpRelatedGrid');
    if (!container) return;

    const related = currentProduct.relatedIds
      ? PRODUCTS.filter(p => currentProduct.relatedIds.includes(p.id))
      : PRODUCTS.filter(p => p.id !== currentProduct.id).slice(0, 3);

    container.innerHTML = related.map(p => `
      <article class="product-card">
        <div class="product-media">
          <a href="product.html?id=${p.id}">
            <img class="product-img" src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='${Wardrobe.getPlaceholderSvg(p.name, p.category)}';" />
          </a>
        </div>
        <div class="product-info">
          <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
          <p class="product-subtitle">${p.subtitle}</p>
          <div class="product-footer-row">
            <span class="product-price">${Wardrobe.formatMoney(p.price)}</span>
            <span class="product-meta-origin">${p.material}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Customer Reviews & Rating Form
  function renderReviews() {
    const listEl = document.getElementById('reviewsList');
    const countEl = document.getElementById('reviewsCountHeading');
    const avgEl = document.getElementById('reviewsAvgNumber');

    if (countEl) countEl.textContent = `Client Appraisals (${currentProduct.reviews ? currentProduct.reviews.length : 0})`;
    if (avgEl) avgEl.textContent = currentProduct.rating.toFixed(1);

    if (listEl && currentProduct.reviews) {
      listEl.innerHTML = currentProduct.reviews.map(r => `
        <div class="review-card-item">
          <div class="review-meta-row">
            <div>
              <strong>${r.author}</strong>
              <span style="font-size: 0.68rem; background: var(--bg-subtle); padding: 0.15rem 0.45rem; border-radius: 2px; margin-left: 0.5rem; text-transform: uppercase;">Verified Collector</span>
            </div>
            <span>${r.date}</span>
          </div>
          <div class="review-stars">★ ★ ★ ★ ★</div>
          <h4 style="font-family: var(--font-serif); font-size: 1.15rem; margin-top: 0.25rem;">${r.title}</h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">${r.comment}</p>
        </div>
      `).join('');
    }

    // Write a review form
    const reviewForm = document.getElementById('writeReviewForm');
    if (reviewForm) {
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const author = document.getElementById('revAuthor').value.trim();
        const title = document.getElementById('revTitle').value.trim();
        const comment = document.getElementById('revComment').value.trim();

        if (author && title && comment) {
          const newReview = {
            author: author,
            rating: 5,
            date: "Today",
            title: title,
            comment: comment
          };
          if (!currentProduct.reviews) currentProduct.reviews = [];
          currentProduct.reviews.unshift(newReview);
          renderReviews();
          reviewForm.reset();
          Wardrobe.showToast('Thank you. Your review has been submitted for editorial moderation.');
        }
      });
    }
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDP);
  } else {
    initPDP();
  }
})();


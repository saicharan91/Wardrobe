/**
 * WARDROBE — Dedicated Shop / Catalog Engine
 * Comprehensive multi-criteria filtering, sorting, pagination, and URL sync.
 */

(function () {
  'use strict';

  // State
  const filterState = {
    search: '',
    category: 'all',
    gender: 'all',
    materials: new Set(),
    colorFamily: 'all',
    sizes: new Set(),
    priceMax: 1500,
    inStockOnly: false,
    sort: 'featured',
    view: 'standard', // 'standard' (3 cols in sidebar view) or 'editorial' (2 cols)
    page: 1,
    perPage: 9
  };

  // Parse URL Parameters
  function syncStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('category')) filterState.category = params.get('category').toLowerCase();
    if (params.has('gender')) filterState.gender = params.get('gender').toLowerCase();
    if (params.has('search')) filterState.search = params.get('search').toLowerCase();
    if (params.has('sort')) filterState.sort = params.get('sort');
    if (params.has('material')) {
      params.get('material').split(',').forEach(m => filterState.materials.add(m));
    }
  }

  // Filter Logic
  function getFilteredProducts() {
    let list = [...PRODUCTS];

    // Search query
    if (filterState.search) {
      const q = filterState.search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q)
      );
    }

    // Category
    if (filterState.category !== 'all') {
      list = list.filter(p => p.category === filterState.category);
    }

    // Gender
    if (filterState.gender !== 'all') {
      list = list.filter(p => p.gender === filterState.gender || p.gender === 'unisex');
    }

    // Materials
    if (filterState.materials.size > 0) {
      list = list.filter(p => filterState.materials.has(p.material));
    }

    // Color Family
    if (filterState.colorFamily !== 'all') {
      list = list.filter(p => p.colorFamily === filterState.colorFamily);
    }

    // Sizes
    if (filterState.sizes.size > 0) {
      list = list.filter(p => p.sizes && p.sizes.some(s => filterState.sizes.has(s)));
    }

    // Price Max
    list = list.filter(p => p.price <= filterState.priceMax);

    // In Stock Only
    if (filterState.inStockOnly) {
      list = list.filter(p => p.stockStatus === 'In Stock');
    }

    // Sorting
    if (filterState.sort === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filterState.sort === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filterState.sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filterState.sort === 'newest') {
      list.sort((a, b) => (b.badges.includes('New Season') ? 1 : 0) - (a.badges.includes('New Season') ? 1 : 0));
    }

    return list;
  }

  // Render Active Filter Chips
  function renderActiveChips() {
    const container = document.getElementById('activeFiltersContainer');
    if (!container) return;

    const chips = [];

    if (filterState.category !== 'all') {
      chips.push({ label: `Category: ${filterState.category}`, clear: () => { filterState.category = 'all'; updateCategoryRadios(); } });
    }
    if (filterState.gender !== 'all') {
      chips.push({ label: `Gender: ${filterState.gender}`, clear: () => { filterState.gender = 'all'; updateGenderRadios(); } });
    }
    if (filterState.colorFamily !== 'all') {
      chips.push({ label: `Color: ${filterState.colorFamily}`, clear: () => { filterState.colorFamily = 'all'; updateColorSwatches(); } });
    }
    filterState.materials.forEach(mat => {
      chips.push({ label: `Material: ${mat}`, clear: () => { filterState.materials.delete(mat); updateMaterialCheckboxes(); } });
    });
    filterState.sizes.forEach(sz => {
      chips.push({ label: `Size: ${sz}`, clear: () => { filterState.sizes.delete(sz); updateSizeButtons(); } });
    });
    if (filterState.priceMax < 1500) {
      chips.push({ label: `Max ${Wardrobe.formatMoney(filterState.priceMax)}`, clear: () => { filterState.priceMax = 1500; updatePriceInput(); } });
    }
    if (filterState.inStockOnly) {
      chips.push({ label: `In Stock Only`, clear: () => { filterState.inStockOnly = false; updateStockCheckbox(); } });
    }
    if (filterState.search) {
      chips.push({ label: `Search: "${filterState.search}"`, clear: () => { filterState.search = ''; document.getElementById('catalogSearchInput').value = ''; } });
    }

    if (chips.length === 0) {
      container.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    container.style.display = 'flex';
    container.innerHTML = `
      <span class="eyebrow" style="margin-right: 0.5rem;">Active:</span>
      ${chips.map((chip, idx) => `
        <span class="active-filter-chip">
          ${chip.label}
          <button data-clear-chip="${idx}" aria-label="Remove filter">✕</button>
        </span>
      `).join('')}
      <button class="clear-filters-btn" id="clearAllFiltersBtn" style="margin-left: auto;">Reset All</button>
    `;

    container.querySelectorAll('[data-clear-chip]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.clearChip, 10);
        chips[idx].clear();
        filterState.page = 1;
        renderShop();
      });
    });

    const resetAll = document.getElementById('clearAllFiltersBtn');
    if (resetAll) {
      resetAll.addEventListener('click', resetAllFilters);
    }
  }

  function resetAllFilters() {
    filterState.category = 'all';
    filterState.gender = 'all';
    filterState.materials.clear();
    filterState.colorFamily = 'all';
    filterState.sizes.clear();
    filterState.priceMax = 1500;
    filterState.inStockOnly = false;
    filterState.search = '';
    filterState.page = 1;

    updateCategoryRadios();
    updateGenderRadios();
    updateMaterialCheckboxes();
    updateColorSwatches();
    updateSizeButtons();
    updatePriceInput();
    updateStockCheckbox();
    const searchInp = document.getElementById('catalogSearchInput');
    if (searchInp) searchInp.value = '';

    renderShop();
  }

  // Helper updates for form controls
  function updateCategoryRadios() {
    document.querySelectorAll('input[name="categoryFilter"]').forEach(r => {
      r.checked = r.value === filterState.category;
    });
  }
  function updateGenderRadios() {
    document.querySelectorAll('input[name="genderFilter"]').forEach(r => {
      r.checked = r.value === filterState.gender;
    });
  }
  function updateMaterialCheckboxes() {
    document.querySelectorAll('input[name="materialFilter"]').forEach(cb => {
      cb.checked = filterState.materials.has(cb.value);
    });
  }
  function updateColorSwatches() {
    document.querySelectorAll('.swatch-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.colorFamily === filterState.colorFamily);
    });
  }
  function updateSizeButtons() {
    document.querySelectorAll('.size-filter-btn').forEach(btn => {
      btn.classList.toggle('active', filterState.sizes.has(btn.dataset.size));
    });
  }
  function updatePriceInput() {
    const range = document.getElementById('priceRangeSlider');
    const label = document.getElementById('priceRangeMaxLabel');
    if (range) range.value = filterState.priceMax;
    if (label) label.textContent = Wardrobe.formatMoney(filterState.priceMax);
  }
  function updateStockCheckbox() {
    const cb = document.getElementById('inStockOnlyFilter');
    if (cb) cb.checked = filterState.inStockOnly;
  }

  // Render Catalog Grid
  function renderShop() {
    const allFiltered = getFilteredProducts();
    const grid = document.getElementById('shopProductsGrid');
    const countEl = document.getElementById('shopResultsCount');

    if (countEl) {
      countEl.textContent = `Showing ${allFiltered.length} of ${PRODUCTS.length} Pieces`;
    }

    renderActiveChips();

    if (!grid) return;

    if (allFiltered.length === 0) {
      grid.innerHTML = `
        <div class="empty-catalog" style="grid-column: 1 / -1;">
          <h3>No garments match your criteria</h3>
          <p>Try resetting some filters or searching for another term.</p>
          <button class="btn-primary" onclick="window.WardrobeShop.resetAllFilters()">Reset All Filters</button>
        </div>
      `;
      renderPagination(0);
      return;
    }

    // Pagination slice
    const totalPages = Math.ceil(allFiltered.length / filterState.perPage);
    if (filterState.page > totalPages) filterState.page = 1;

    const startIdx = (filterState.page - 1) * filterState.perPage;
    const paginated = allFiltered.slice(startIdx, startIdx + filterState.perPage);

    grid.innerHTML = paginated.map(p => {
      const isFav = Wardrobe.isWishlisted(p.id);
      const badgesHtml = p.badges ? p.badges.map(b => `<span class="product-badge">${b}</span>`).join('') : '';
      const colorsHtml = p.colors ? p.colors.map(c => `<span class="color-dot" style="background-color: ${c.hex};" title="${c.name}"></span>`).join('') : '';
      const sizesHtml = p.sizes ? p.sizes.map(s => `<button class="quick-size-btn" data-shop-add="${p.id}" data-size="${s}">${s}</button>`).join('') : '';

      return `
        <article class="product-card" data-id="${p.id}">
          <div class="product-media">
            <div class="product-badges">${badgesHtml}</div>
            <button class="wishlist-btn ${isFav ? 'active' : ''}" data-wishlist-id="${p.id}" aria-label="Save to Wishlist" title="Save to Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <a href="product.html?id=${p.id}" style="display: block; width: 100%; height: 100%;">
              <img class="product-img" src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='${Wardrobe.getPlaceholderSvg(p.name, p.category)}';" />
              ${p.images[1] ? `<img class="product-img-secondary" src="${p.images[1]}" alt="${p.name} secondary view" loading="lazy" onerror="this.onerror=null; this.src='${Wardrobe.getPlaceholderSvg(p.name, p.category)}';" />` : ''}
            </a>

            <div class="product-quick-actions">
              <span class="quick-sizes-title">Quick Select Size:</span>
              <div class="quick-sizes-list">
                ${sizesHtml}
              </div>
              <a href="product.html?id=${p.id}" class="quick-view-trigger">Inspect Details & Specs</a>
            </div>
          </div>

          <div class="product-info">
            <div class="product-colors">${colorsHtml}</div>
            <a href="product.html?id=${p.id}" class="product-name">${p.name}</a>
            <p class="product-subtitle">${p.subtitle}</p>
            <div class="product-footer-row">
              <span class="product-price">${Wardrobe.formatMoney(p.price)}</span>
              <span class="product-meta-origin">${p.material} • ${p.origin.split('in ')[1] || 'Italy'}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    bindGridListeners();
    renderPagination(totalPages);
  }

  // Bind Grid Item Interactions
  function bindGridListeners() {
    const grid = document.getElementById('shopProductsGrid');
    if (!grid) return;

    // Wishlist Toggle
    grid.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        Wardrobe.toggleWishlist(btn.dataset.wishlistId);
      });
    });

    // Quick Size Add
    grid.querySelectorAll('[data-shop-add]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const p = PRODUCTS.find(item => item.id === btn.dataset.shopAdd);
        if (p) {
          Wardrobe.addToCart(p, btn.dataset.size);
        }
      });
    });
  }

  // Render Pagination
  function renderPagination(totalPages) {
    const container = document.getElementById('shopPagination');
    if (!container) return;

    if (totalPages <= 1) {
      container.innerHTML = '';
      return;
    }

    let buttons = '';
    for (let i = 1; i <= totalPages; i++) {
      buttons += `
        <button class="page-btn ${i === filterState.page ? 'active' : ''}" data-page="${i}">
          ${i}
        </button>
      `;
    }

    container.innerHTML = `
      <button class="page-btn" id="prevPageBtn" ${filterState.page === 1 ? 'disabled' : ''} aria-label="Previous Page">←</button>
      ${buttons}
      <button class="page-btn" id="nextPageBtn" ${filterState.page === totalPages ? 'disabled' : ''} aria-label="Next Page">→</button>
    `;

    container.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterState.page = parseInt(btn.dataset.page, 10);
        renderShop();
        window.scrollTo({ top: 300, behavior: 'smooth' });
      });
    });

    const prev = document.getElementById('prevPageBtn');
    if (prev) {
      prev.addEventListener('click', () => {
        if (filterState.page > 1) {
          filterState.page -= 1;
          renderShop();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }
      });
    }

    const next = document.getElementById('nextPageBtn');
    if (next) {
      next.addEventListener('click', () => {
        if (filterState.page < totalPages) {
          filterState.page += 1;
          renderShop();
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }
      });
    }
  }

  // Setup Sidebar Filter Event Listeners
  function initShopFilters() {
    syncStateFromURL();

    // Catalog Search Input
    const searchInp = document.getElementById('catalogSearchInput');
    if (searchInp) {
      if (filterState.search) searchInp.value = filterState.search;
      searchInp.addEventListener('input', (e) => {
        filterState.search = e.target.value.trim();
        filterState.page = 1;
        renderShop();
      });
    }

    // Category Radios
    document.querySelectorAll('input[name="categoryFilter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        filterState.category = e.target.value;
        filterState.page = 1;
        renderShop();
      });
    });

    // Gender Radios
    document.querySelectorAll('input[name="genderFilter"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        filterState.gender = e.target.value;
        filterState.page = 1;
        renderShop();
      });
    });

    // Material Checkboxes
    document.querySelectorAll('input[name="materialFilter"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        if (e.target.checked) {
          filterState.materials.add(e.target.value);
        } else {
          filterState.materials.delete(e.target.value);
        }
        filterState.page = 1;
        renderShop();
      });
    });

    // Color Swatches
    document.querySelectorAll('.swatch-filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.colorFamily;
        if (filterState.colorFamily === val) {
          filterState.colorFamily = 'all';
        } else {
          filterState.colorFamily = val;
        }
        updateColorSwatches();
        filterState.page = 1;
        renderShop();
      });
    });

    // Sizes
    document.querySelectorAll('.size-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sz = btn.dataset.size;
        if (filterState.sizes.has(sz)) {
          filterState.sizes.delete(sz);
        } else {
          filterState.sizes.add(sz);
        }
        updateSizeButtons();
        filterState.page = 1;
        renderShop();
      });
    });

    // Price Slider
    const priceSlider = document.getElementById('priceRangeSlider');
    const priceLabel = document.getElementById('priceRangeMaxLabel');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        filterState.priceMax = parseInt(e.target.value, 10);
        if (priceLabel) priceLabel.textContent = Wardrobe.formatMoney(filterState.priceMax);
        filterState.page = 1;
        renderShop();
      });
    }

    // In Stock Only
    const inStockCb = document.getElementById('inStockOnlyFilter');
    if (inStockCb) {
      inStockCb.addEventListener('change', (e) => {
        filterState.inStockOnly = e.target.checked;
        filterState.page = 1;
        renderShop();
      });
    }

    // Sort Dropdown
    const sortSel = document.getElementById('shopSortSelect');
    if (sortSel) {
      if (filterState.sort) sortSel.value = filterState.sort;
      sortSel.addEventListener('change', (e) => {
        filterState.sort = e.target.value;
        renderShop();
      });
    }

    // View Density Switcher
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.dataset.view;
        const grid = document.getElementById('shopProductsGrid');
        if (mode === 'editorial') {
          grid.classList.add('grid-editorial');
        } else {
          grid.classList.remove('grid-editorial');
        }
      });
    });

    // Re-render when currency changes
    window.addEventListener('wardrobe:currency-changed', () => {
      updatePriceInput();
      renderShop();
    });

    // Re-render when wishlist updates
    window.addEventListener('wardrobe:wishlist-updated', () => {
      renderShop();
    });

    // Initial render
    updateCategoryRadios();
    updateGenderRadios();
    updateMaterialCheckboxes();
    updatePriceInput();
    renderShop();
  }

  // Public API
  window.WardrobeShop = {
    init: initShopFilters,
    resetAllFilters: resetAllFilters
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShopFilters);
  } else {
    initShopFilters();
  }
})();


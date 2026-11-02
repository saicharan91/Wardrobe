/**
 * WARDROBE — Dedicated Full Cart Page Engine (cart.html)
 * Line-item editing, gift notes, shipping calculator, promo discounts, and checkout handoff.
 */

(function () {
  'use strict';

  let courierFee = 0; // 0 for DHL Express, 45 for White Glove

  function initCartPage() {
    renderFullCartPage();

    // Re-render when currency changes
    window.addEventListener('wardrobe:currency-changed', renderFullCartPage);
    window.addEventListener('wardrobe:cart-updated', renderFullCartPage);

    // Promo code apply
    const applyBtn = document.getElementById('cartPagePromoApplyBtn');
    const input = document.getElementById('cartPagePromoInput');
    if (applyBtn && input) {
      applyBtn.addEventListener('click', () => {
        const code = input.value.trim().toUpperCase();
        if (!code) return;
        if (Wardrobe.PROMO_CODES[code]) {
          Wardrobe.state.promo = { code, ...Wardrobe.PROMO_CODES[code] };
          localStorage.setItem('wd_promo', JSON.stringify(Wardrobe.state.promo));
          renderFullCartPage();
          Wardrobe.showToast(`Promo "${code}" applied: ${Wardrobe.PROMO_CODES[code].label}!`);
        } else {
          Wardrobe.showToast('Invalid promo code. Try "WARDROBE10" or "MINIMAL".');
        }
      });
    }

    // Shipping method select
    document.querySelectorAll('input[name="cartCourierOption"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        courierFee = parseFloat(e.target.value);
        updateCartSummary();
      });
    });
  }

  function renderFullCartPage() {
    const tableBody = document.getElementById('cartTableBody');
    const emptyState = document.getElementById('cartPageEmptyState');
    const layout = document.getElementById('cartPageContentGrid');

    if (!tableBody) return;

    if (Wardrobe.state.cart.length === 0) {
      if (layout) layout.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (layout) layout.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';

    tableBody.innerHTML = Wardrobe.state.cart.map((item, index) => {
      const lineTotal = item.price * item.quantity;
      return `
        <tr>
          <td>
            <div style="display: flex; gap: 1.25rem; align-items: center;">
              <a href="product.html?id=${item.id}">
                <img src="${item.image}" alt="${item.name}" style="width: 75px; height: 95px; object-fit: cover; border-radius: 2px;" onerror="this.onerror=null; this.src='${Wardrobe.getPlaceholderSvg(item.name, item.category)}';" />
              </a>
              <div>
                <a href="product.html?id=${item.id}" style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 500; display: block; margin-bottom: 0.25rem;">${item.name}</a>
                <span style="font-size: 0.75rem; color: var(--text-muted);">Size: ${item.selectedSize} &bull; ${item.selectedColor}</span>
              </div>
            </div>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-size: 0.95rem;">${Wardrobe.formatMoney(item.price)}</span>
          </td>
          <td>
            <div class="cart-qty-ctrl">
              <button class="qty-btn" data-page-cart-delta="-1" data-idx="${index}">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" data-page-cart-delta="1" data-idx="${index}">+</button>
            </div>
          </td>
          <td>
            <span style="font-family: var(--font-mono); font-weight: 600;">${Wardrobe.formatMoney(lineTotal)}</span>
          </td>
          <td style="text-align: right;">
            <button class="cart-item-remove" data-page-cart-remove="${index}" title="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners
    tableBody.querySelectorAll('[data-page-cart-delta]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const delta = parseInt(btn.dataset.pageCartDelta, 10);
        Wardrobe.updateCartItemQty(idx, delta);
      });
    });

    tableBody.querySelectorAll('[data-page-cart-remove]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.pageCartRemove, 10);
        Wardrobe.removeCartItem(idx);
      });
    });

    updateCartSummary();
  }

  function updateCartSummary() {
    const subtotalEl = document.getElementById('cartPageSubtotal');
    const discountRow = document.getElementById('cartPageDiscountRow');
    const discountAmtEl = document.getElementById('cartPageDiscountAmt');
    const shippingEl = document.getElementById('cartPageShipping');
    const taxEl = document.getElementById('cartPageTax');
    const totalEl = document.getElementById('cartPageTotal');

    const subtotalUSD = Wardrobe.state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    let discountUSD = 0;
    if (Wardrobe.state.promo) {
      discountUSD = subtotalUSD * Wardrobe.state.promo.discount;
      if (discountRow) {
        discountRow.style.display = 'flex';
        discountAmtEl.textContent = `-${Wardrobe.formatMoney(discountUSD)} (${Wardrobe.state.promo.code})`;
      }
    } else {
      if (discountRow) discountRow.style.display = 'none';
    }

    const freeBaseShipping = subtotalUSD >= Wardrobe.FREE_SHIPPING_THRESHOLD_USD;
    const finalShippingUSD = freeBaseShipping ? courierFee : (35 + courierFee);
    const taxUSD = (subtotalUSD - discountUSD) * 0.08; // estimated 8% tax
    const totalUSD = subtotalUSD - discountUSD + finalShippingUSD + taxUSD;

    if (subtotalEl) subtotalEl.textContent = Wardrobe.formatMoney(subtotalUSD);
    if (shippingEl) shippingEl.textContent = finalShippingUSD === 0 ? 'Complimentary' : Wardrobe.formatMoney(finalShippingUSD);
    if (taxEl) taxEl.textContent = Wardrobe.formatMoney(taxUSD);
    if (totalEl) totalEl.textContent = Wardrobe.formatMoney(totalUSD);
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCartPage);
  } else {
    initCartPage();
  }
})();


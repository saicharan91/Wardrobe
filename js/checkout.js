/**
 * WARDROBE — Dedicated Multi-Step Checkout Controller (checkout.html)
 * Form validation, step transitions, financial reconciliation, and order submission.
 */

(function () {
  'use strict';

  let checkoutStep = 1;
  let courierFee = 0;

  function initCheckout() {
    if (Wardrobe.state.cart.length === 0) {
      // If someone visits checkout with an empty cart
      const container = document.getElementById('checkoutMainContainer');
      if (container) {
        container.innerHTML = `
          <div class="empty-catalog" style="text-align: center; padding: 6rem 1rem;">
            <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.5rem;">Your Shopping Bag is Empty</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Please select at least one garment before checking out.</p>
            <a href="shop.html" class="btn-primary">Return to Collection</a>
          </div>
        `;
      }
      return;
    }

    renderCheckoutSummary();
    bindCheckoutListeners();

    window.addEventListener('wardrobe:currency-changed', renderCheckoutSummary);
  }

  function renderCheckoutSummary() {
    const itemsList = document.getElementById('checkoutSummaryItemsList');
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const discountRow = document.getElementById('checkoutDiscountRow');
    const discountAmtEl = document.getElementById('checkoutDiscountAmt');
    const shippingEl = document.getElementById('checkoutShipping');
    const taxEl = document.getElementById('checkoutTax');
    const totalEl = document.getElementById('checkoutTotal');

    if (itemsList) {
      itemsList.innerHTML = Wardrobe.state.cart.map(item => `
        <div style="display: flex; gap: 1rem; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--border-light);">
          <div style="position: relative;">
            <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 65px; object-fit: cover; border-radius: 2px;" onerror="this.onerror=null; this.src='${Wardrobe.getPlaceholderSvg(item.name, item.category)}';" />
            <span style="position: absolute; top: -6px; right: -6px; background: var(--text-primary); color: #fff; font-size: 0.65rem; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600;">${item.quantity}</span>
          </div>
          <div style="flex-grow: 1;">
            <h4 style="font-family: var(--font-serif); font-size: 1rem; margin-bottom: 0.15rem;">${item.name}</h4>
            <span style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase;">Size: ${item.selectedSize} • ${item.selectedColor}</span>
          </div>
          <span style="font-family: var(--font-mono); font-size: 0.88rem; font-weight: 600;">${Wardrobe.formatMoney(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }

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
    const taxUSD = (subtotalUSD - discountUSD) * 0.08;
    const totalUSD = subtotalUSD - discountUSD + finalShippingUSD + taxUSD;

    if (subtotalEl) subtotalEl.textContent = Wardrobe.formatMoney(subtotalUSD);
    if (shippingEl) shippingEl.textContent = finalShippingUSD === 0 ? 'Complimentary' : Wardrobe.formatMoney(finalShippingUSD);
    if (taxEl) taxEl.textContent = Wardrobe.formatMoney(taxUSD);
    if (totalEl) totalEl.textContent = Wardrobe.formatMoney(totalUSD);
  }

  function bindCheckoutListeners() {
    const toStep2Btn = document.getElementById('checkoutToStep2Btn');
    const backTo1Btn = document.getElementById('checkoutBackToStep1Btn');
    const toStep3Btn = document.getElementById('checkoutToStep3Btn');
    const backTo2Btn = document.getElementById('checkoutBackToStep2Btn');
    const placeOrderBtn = document.getElementById('checkoutPlaceOrderBtn');

    // Courier selection
    document.querySelectorAll('.delivery-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.delivery-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        courierFee = parseFloat(card.dataset.courierFee || 0);
        renderCheckoutSummary();
      });
    });

    if (toStep2Btn) {
      toStep2Btn.addEventListener('click', () => {
        const email = document.getElementById('checkoutEmail');
        const firstName = document.getElementById('checkoutFirstName');
        const address = document.getElementById('checkoutAddress');

        if (!email.value || !firstName.value || !address.value) {
          Wardrobe.showToast('Please fill in your contact and delivery address.');
          return;
        }

        goToStep(2);
      });
    }

    if (backTo1Btn) backTo1Btn.addEventListener('click', () => goToStep(1));
    if (toStep3Btn) toStep3Btn.addEventListener('click', () => goToStep(3));
    if (backTo2Btn) backTo2Btn.addEventListener('click', () => goToStep(2));

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        placeOrderBtn.textContent = 'Processing Authorization...';
        placeOrderBtn.disabled = true;

        setTimeout(() => {
          // Build order object
          const orderNum = 'WD-' + Math.floor(100000 + Math.random() * 900000);
          const orderData = {
            orderNumber: orderNum,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            email: document.getElementById('checkoutEmail').value,
            name: `${document.getElementById('checkoutFirstName').value} ${document.getElementById('checkoutLastName').value}`,
            address: document.getElementById('checkoutAddress').value,
            city: document.getElementById('checkoutCity').value,
            postal: document.getElementById('checkoutPostal').value,
            items: [...Wardrobe.state.cart],
            totalFormatted: document.getElementById('checkoutTotal').textContent,
            currency: Wardrobe.state.currency
          };

          localStorage.setItem('wd_last_order', JSON.stringify(orderData));

          // Clear cart
          Wardrobe.state.cart = [];
          localStorage.setItem('wd_cart', '[]');
          Wardrobe.updateBadges();

          // Redirect to Confirmation
          window.location.href = 'order-confirmation.html';
        }, 1200);
      });
    }
  }

  function goToStep(step) {
    checkoutStep = step;

    // Update panels
    document.querySelectorAll('.checkout-step-panel').forEach(panel => {
      panel.classList.toggle('active', parseInt(panel.dataset.step, 10) === step);
    });

    // Update indicator dots
    document.querySelectorAll('.checkout-step-indicator').forEach(ind => {
      ind.classList.toggle('active', parseInt(ind.dataset.step, 10) <= step);
    });

    window.scrollTo({ top: 120, behavior: 'smooth' });
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckout);
  } else {
    initCheckout();
  }
})();


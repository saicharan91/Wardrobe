# W A R D R O B E
### Minimalist E-Commerce Storefront

A clean, modern, and uncluttered e-commerce website for timeless fashion garments and accessories. Designed with a pure white background, crisp imagery, and intuitive navigation.

---

## 🏛️ Architecture

A streamlined multi-page store built with pure vanilla HTML, modern CSS, and JavaScript.

```
Wardrobe/
├── index.html              # Storefront with hero banner, category tabs & product grid
├── product.html            # Clean product detail page with gallery & options
├── cart.html               # Shopping bag with quantities & order summary
├── checkout.html           # Express dummy checkout with address & payment options
├── order-confirmation.html # Order receipt & thank-you page
├── 404.html                # Automatic redirect for invalid / legacy URLs
├── .nojekyll               # Bypasses Jekyll for GitHub Pages
├── css/
│   └── styles.css          # Clean, minimal stylesheet
├── js/
│   ├── products.js         # Curated 16-product catalog
│   └── store.js            # Unified store engine (cart, checkout, auth, rendering)
└── README.md               # Documentation
```

---

## 🌟 Key Features

### 1. Storefront (`index.html`)
- **Minimal Header**: Sticky navigation with brand logo, account login modal trigger, and live bag badge.
- **Hero Banner**: Crisp visual hero highlighting the Autumn / Winter capsule with quick action buttons.
- **Category Tabs**: Filter between `All`, `Outerwear`, `Tailoring`, `Knitwear`, `Dresses`, and `Accessories`.
- **Responsive Product Grid**: 4 columns on desktop, 3 on tablets, 2 on mobile devices.
- **One-Click Add to Bag**: Instant feedback button that adds garments directly to the shopping cart.

### 2. Product Detail (`product.html?id=...`)
- **Dynamic Routing**: Loads any product dynamically via `?id=` query parameter.
- **Image Gallery**: Primary view with interactive thumbnail selector.
- **Color & Size Selectors**: Visual color swatches and clear size buttons.
- **Quantity Selector**: Increment/decrement items before adding to bag.
- **Garment Specifications**: Clear composition, origin, and care instructions.
- **Related Recommendations**: Curated cross-sell pieces at the bottom of the page.

### 3. Shopping Bag (`cart.html`)
- **Itemized Overview**: Shows product image, title, selected color, selected size, and unit price.
- **Quantity Controls**: Adjust item counts or remove items with one click.
- **Order Summary**: Subtotal, complimentary shipping notice, and estimated order total.
- **Direct Checkout Link**: Smoothly proceeds to the express checkout page.

### 4. Express Checkout & Thank-You Flow (`checkout.html` & `order-confirmation.html`)
- **Express Checkout**: Contact details, shipping address, and simulated payment methods (Credit Card, Apple Pay, Pay on Delivery).
- **Auto-Fill Demo Info**: One-click demo filler for immediate end-to-end testing.
- **Thank-You Confirmation**: Generates a unique order reference (`#WD-XXXXXX`), order summary breakdown, and shipping details.

### 5. Account & Dummy Login
- **Universal Sign-In Modal**: Available on every page header.
- **One-Click Demo Login**: Sign in as demo member (`Alex M.`), which personalizes the header navigation.
- **Sign Out Control**: Clicking the account pill prompts to sign out.

### 6. Robust Design & Tracking
- **Zero Heavy Dependencies**: Pure system sans-serif font stack and vanilla JavaScript.
- **Graceful Fallbacks**: Built-in SVG vector generator ensures images always render even when offline.
- **Adobe Launch Integrated**: Script tag included across all HTML `<head>` tags.

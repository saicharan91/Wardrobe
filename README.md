# W A R D R O B E
### Minimalist E-Commerce Storefront

A clean, modern, and uncluttered e-commerce website for timeless fashion garments and accessories. Designed with a pure white background, crisp imagery, and intuitive navigation.

---

## 🏛️ Architecture

A streamlined 3-page store built with pure vanilla HTML, modern CSS, and JavaScript.

```
Wardrobe/
├── index.html          # Storefront with category tabs & product grid
├── product.html        # Clean product detail page with gallery & options
├── cart.html           # Shopping bag with quantities & order summary
├── css/
│   └── styles.css      # Clean, minimal stylesheet (~450 lines)
├── js/
│   ├── products.js     # Curated 16-product catalog
│   └── store.js        # Unified cart, filtering, and page rendering logic
└── README.md           # Documentation
```

---

## 🌟 Key Features

### 1. Storefront (`index.html`)
- **Clean Header**: Sticky minimal navigation with logo and live shopping bag count.
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
- **Persistent State**: Cart items are automatically saved in `localStorage`.
- **Friendly Empty State**: Helpful message and quick link back to shop when empty.

### 4. Robust Design
- **Zero Heavy Dependencies**: Pure system sans-serif font stack and vanilla JavaScript.
- **Graceful Fallbacks**: Built-in SVG vector generator ensures images always render even when offline.
- **Adobe Launch Integrated**: Script tag included across all HTML `<head>` tags.

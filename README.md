# W A R D R O B E
### Atelier de Haute Confection & Ready-to-Wear

A comprehensive, production-grade, multi-page minimalist luxury e-commerce platform. Inspired by the quiet luxury design languages of *The Row*, *Lemaire*, *Totême*, *Jil Sander*, and *Céline*.

---

## 🏛️ Multi-Page Architecture

This is a complete, fully functional multi-page web application with interconnected navigation, shared persistent state (`localStorage`), multi-currency conversion, and responsive luxury styling.

```
Wardrobe/
├── index.html               # Home storefront & editorial storytelling
├── shop.html                # Full collection catalog with multi-criteria sidebar filters
├── product.html             # Detailed PDP (gallery zoom, size guide, reviews, cross-sell)
├── lookbook.html            # Campaign lookbook with interactive radar hotspots
├── atelier.html             # Maison manifesto, zero-waste cutting & sustainability
├── cart.html                # Dedicated shopping bag with gift options & tax calculation
├── checkout.html            # Multi-step checkout with delivery validation & payment mock
├── order-confirmation.html  # Order confirmation receipt with tracking waybill & print invoice
├── wishlist.html            # Saved archives with "Move All to Bag" batch action
├── contact.html             # Flagship salons (Paris, Tokyo, NY, London, Zurich) & appointment booking
├── css/
│   └── styles.css           # Complete luxury design system & responsive styling
├── js/
│   ├── products.js          # Catalog database (16 garments, 4 lookbooks, 5 boutiques)
│   ├── core.js              # Shared state engine (Cart, Wishlist, Currency, Drawers, Search)
│   ├── shop.js              # Catalog filtering, multi-criteria sidebar, sorting, pagination
│   ├── product-detail.js    # PDP controller, query param reader, size modal, reviews
│   ├── cart-page.js         # Dedicated cart page calculations & gift options
│   └── checkout.js          # Checkout stepper, payment validation, & order generation
└── README.md                # Project documentation
```

---

## 🌟 E-Commerce Functionalities & Criteria

### 1. Multi-Criteria Filtering & Search (`shop.html`)
- **Category Filter**: *Outerwear & Coats*, *Architectural Tailoring*, *Pure Cashmere & Knitwear*, *Raw Silk Dresses & Skirts*, and *Leather Goods & Accessories*.
- **Silhouette Filter**: *All Silhouettes*, *Women's Edit*, *Men's Edit*, and *Unisex Foundations*.
- **Material Provenance Filter**: *Grade-A Mongolian Cashmere*, *Biella 130s Virgin Wool*, *Sandwashed Mulberry Silk*, *Japanese Gabardine Cotton*, *Tuscan Calfskin*, and *Peruvian Baby Alpaca*.
- **Color Palette Filter**: Visual swatch pills for *Ecru/Chalk*, *Noir/Charcoal*, *Camel/Umber*, and *Deep Ink Navy*.
- **Size Filter**: Filter by *XS*, *S*, *M*, *L*, *XL*, *One Size*.
- **Maximum Price Slider**: Real-time slider filter up to $1,500.
- **In-Stock Availability**: Filter for immediate atelier dispatch.
- **Active Filter Chips**: Dynamically generated tags with one-click individual dismissal and a "Reset All" button.
- **URL Parameter Synchronization**: Links such as `shop.html?category=outerwear` or `shop.html?search=trench` automatically configure filters.
- **Sorting**: *Featured First*, *Price: Low to High*, *Price: High to Low*, *Highest Rated*, and *New Season*.
- **Grid Layout Density Switcher**: Toggle between a **3/4-Column Catalog Grid** and a **2-Column Editorial Spread**.
- **Pagination**: Paginated navigation with previous, next, and numbered page controls.

### 2. Product Detail Experience (`product.html?id=...`)
- **Dynamic Routing**: Automatically loads any garment by ID (e.g. `product.html?id=wd-01` through `wd-16`).
- **High-Resolution Gallery**: Multi-angle vertical thumbnail strip with smooth main image swap and hover magnification.
- **Breadcrumb Navigation**: `Home / Shop / [Category] / [Garment Name]`.
- **Interactive Size & Fit Guide**: Modal popup with an EU, IT, US, UK size conversion chart and centimetre/inch measurements.
- **Stock Urgency Indicator**: Live inventory alerts (e.g., *"Only 3 items remaining in atelier stock"*).
- **Quantity Selector**: Increment/decrement controls with instant line calculation.
- **Direct Wishlist & Cart Actions**: Add to bag with loading animation and persistent wishlist toggling.
- **Specification Accordions**: Expandable sections for *Composition & Weight (gsm)*, *Provenance & Tailoring*, *Model Fit Proportions*, and *Lifetime Care*.
- **"Complete The Look" Recommendations**: Cross-sell suggestions pairing complementary garments.
- **Client Appraisals & Reviews**: Overall rating score, verified collector reviews, and an interactive **"Submit an Appraisal"** form.

### 3. Shopping Bag & Checkout Flow
- **Slide-Out Drawer & Dedicated Cart Page (`cart.html`)**: Line-item table, quantity changers, and trash removal.
- **Free Shipping Progress Meter**: Dynamic live calculation towards the $350 complimentary shipping threshold.
- **VIP Promo Discount Codes**:
  - `WARDROBE10` — 10% VIP Discount
  - `MINIMAL` — 15% Minimalist Capsule Discount
  - `ATELIER` — 20% Private Archive Discount
- **Packaging Customization**: Toggle complimentary sustainable packaging or request a handwritten calligraphy gift card.
- **Multi-Step Checkout (`checkout.html`)**:
  - *Step 1: Contact & Delivery Address* with validation.
  - *Step 2: Courier Dispatch* (DHL Express Worldwide - Complimentary, White Glove Atelier Courier - $45, Boutique Pick-up).
  - *Step 3: Payment Simulation* (Credit Card, Apple Pay mock, Klarna 3-installment calculation).
- **Order Confirmation (`order-confirmation.html`)**:
  - Unique generated Order ID (`#WD-XXXXXX`).
  - Itemized receipt breakdown.
  - Simulated DHL Express tracking waybill.
  - One-click "Print Invoice" button.

### 4. Editorial Lookbook (`lookbook.html`)
- Campaign Volume 04: *"The Architecture of Drape"*.
- Full-bleed photographic spreads with **pulsing radar hotspots** positioned on models.
- Hovering shows garment specs and prices; clicking navigates directly to the piece.
- **"Add Full Look to Shopping Bag"** batch action.

### 5. Brand Heritage & Salons (`atelier.html` & `contact.html`)
- Dedicated **Atelier Manifesto** exploring zero-waste cutting, 3D seamless circular knitting, and lifetime repairs.
- **Flagship Salons Directory**: Paris (Rue Saint-Honoré), Tokyo (Minami-Aoyama), New York (Mercer Street, SoHo), London (Mayfair), Zurich (Bahnhofstrasse).
- **Private Appointment Booking Form**: Schedule a private salon fitting with a stylist.
- **Client Concierge FAQ**: Expandable accordions covering deliveries, returns, and bespoke tailoring.

### 6. Universal Utilities
- **Multi-Currency Engine**: Instant live recalculation across **USD ($)**, **EUR (€)**, **GBP (£)**, and **JPY (¥)** across every page, cart, and modal.
- **Quick Search Overlay**: Accessible anywhere via clicking **Search** or pressing <kbd>Cmd</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>.
- **Offline Resilience**: Built-in SVG vector fallback generator so images gracefully render even without an active internet connection.

---

## 🚀 How to Run & Preview

Open any page directly in your browser without any build tools or installations:

```bash
# Simply double click index.html or run:
index.html

# Or using any static HTTP server:
python -m http.server 8000
# or
npx serve .
```

Navigate across all pages using the header links:
- [Home Storefront (`index.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/index.html)
- [The Collection with Filter Sidebar (`shop.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/shop.html)
- [Product Detail Page (`product.html?id=wd-01`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/product.html?id=wd-01)
- [Editorial Lookbook (`lookbook.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/lookbook.html)
- [The Atelier & Manifesto (`atelier.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/atelier.html)
- [Shopping Bag (`cart.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/cart.html)
- [Multi-Step Checkout (`checkout.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/checkout.html)
- [Saved Wishlist (`wishlist.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/wishlist.html)
- [Boutiques & Appointments (`contact.html`)](file:///c:/Users/capta/OneDrive/Documents/github/Wardrobe/contact.html)

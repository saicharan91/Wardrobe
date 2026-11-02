/**
 * WARDROBE — Product Catalog & E-Commerce Dataset
 * Curated minimalist luxury garments, accessories, lookbook data, and exchange rates.
 */

const PRODUCTS = [
  {
    id: "wd-01",
    name: "Double-Faced Cashmere Wrap Coat",
    subtitle: "Architectural silhouette with self-fabric sash belt",
    category: "outerwear",
    gender: "women",
    price: 1150,
    badges: ["Iconic", "Pure Cashmere"],
    rating: 4.9,
    reviewsCount: 38,
    material: "Cashmere",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 5,
    colors: [
      { name: "Oatmeal Camel", hex: "#C4A482" },
      { name: "Obsidian Black", hex: "#191919" },
      { name: "Chalk Ecru", hex: "#E9E5DE" }
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "An unlined, double-faced wrap coat hand-crafted from 100% Grade-A Mongolian cashmere. Engineered with fluid raglan sleeves, dropped shoulders, and a clean self-fabric belt for effortless cinching.",
    composition: "100% Mongolian Virgin Cashmere (520gsm). Hand-split and stitched seams.",
    origin: "Tailored in Reggio Emilia, Italy",
    care: "Dry clean only. Store on wide cedar hangers with supplied breathable garment bag.",
    modelStats: "Model is 5'10\" (178cm), bust 32\", waist 24\", wearing size S.",
    relatedIds: ["wd-04", "wd-05", "wd-09"],
    reviews: [
      { author: "Helena V.", rating: 5, date: "Oct 14, 2026", title: "Sculptural perfection", comment: "The drape of this cashmere is unparalleled. Light yet warm, with seams so clean they are almost invisible." },
      { author: "Claire B.", rating: 5, date: "Sep 28, 2026", title: "An enduring investment", comment: "The oatmeal tone matches everything. Beautiful movement when walking." },
      { author: "Astrid M.", rating: 4.8, date: "Aug 19, 2026", title: "Exquisite craftsmanship", comment: "Very generous cut. If between sizes, recommend sizing down." }
    ],
    featured: true
  },
  {
    id: "wd-02",
    name: "Architectural Structured Trench",
    subtitle: "High-density Japanese gabardine cotton",
    category: "outerwear",
    gender: "unisex",
    price: 890,
    badges: ["New Season", "Water-Repellent"],
    rating: 4.8,
    reviewsCount: 24,
    material: "Japanese Cotton",
    colorFamily: "earth",
    stockStatus: "In Stock",
    stockRemaining: 8,
    colors: [
      { name: "Sand Dune", hex: "#D2C29D" },
      { name: "Olive Night", hex: "#4A4E44" },
      { name: "Deep Charcoal", hex: "#2A2A2A" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "A sculptural reimagining of the classic trench coat. Cut with a generous exaggerated collar, storm flap, and horn buttons. Treated with a fluorocarbon-free water-repellent coating.",
    composition: "100% Long-Staple Japanese Cotton Gabardine (380gsm). Water-repellent finish.",
    origin: "Crafted in Osaka, Japan",
    care: "Specialist dry clean. Cool iron with pressing cloth.",
    modelStats: "Model is 6'1\" (185cm), chest 38\", waist 30\", wearing size M.",
    relatedIds: ["wd-04", "wd-07", "wd-10"],
    reviews: [
      { author: "Marcus K.", rating: 5, date: "Oct 22, 2026", title: "The ultimate modern trench", comment: "The stiffness and structure of this Japanese gabardine holds its shape like architectural paper." },
      { author: "Sonia L.", rating: 4.6, date: "Oct 05, 2026", title: "Striking silhouette", comment: "Very chic oversized look. Storm flap detail is beautifully proportioned." }
    ],
    featured: true
  },
  {
    id: "wd-03",
    name: "Double-Breasted Wool Atelier Blazer",
    subtitle: "Precise canvassed tailoring from Biella wool",
    category: "tailoring",
    gender: "women",
    price: 720,
    badges: ["Best Seller"],
    rating: 5.0,
    reviewsCount: 46,
    material: "Virgin Wool",
    colorFamily: "charcoals",
    stockStatus: "In Stock",
    stockRemaining: 6,
    colors: [
      { name: "Dark Espresso", hex: "#2B211B" },
      { name: "Flint Grey", hex: "#636466" },
      { name: "Midnight Navy", hex: "#1C2333" }
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "A masterclass in modern proportion. Featuring sharp peak lapels, structured roped shoulders, and a relaxed straight cut that flows seamlessly from day to evening.",
    composition: "100% Super 130s Virgin Wool from Biella, Italy; 100% Bemberg Cupro lining.",
    origin: "Tailored in Milan, Italy",
    care: "Dry clean gently. Steam vertically.",
    modelStats: "Model is 5'9\" (175cm), bust 33\", waist 25\", wearing size S.",
    relatedIds: ["wd-04", "wd-07", "wd-09"],
    reviews: [
      { author: "Elena R.", rating: 5, date: "Oct 18, 2026", title: "Flawless roped shoulders", comment: "The canvassing feels like Savile Row bespoke. The espresso color has wonderful depth." }
    ],
    featured: true
  },
  {
    id: "wd-04",
    name: "Relaxed Pleated Wide-Leg Trouser",
    subtitle: "High-waist double pleat in fluid wool",
    category: "tailoring",
    gender: "unisex",
    price: 420,
    badges: ["Core Essential"],
    rating: 4.9,
    reviewsCount: 52,
    material: "Virgin Wool",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 12,
    colors: [
      { name: "Tonal Greige", hex: "#A8A29A" },
      { name: "Pitch Noir", hex: "#121212" },
      { name: "Warm Olive", hex: "#5C5F4D" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Designed for effortless movement with deep forward double pleats, slanted pockets, and an unhemmed extra length allowing tailored individual break preferences.",
    composition: "98% Tropical Virgin Wool, 2% Elastane for recovery.",
    origin: "Meticulously made in Porto, Portugal",
    care: "Dry clean only. Press with medium steam.",
    modelStats: "Model is 5'11\" (180cm), waist 28\", wearing size M.",
    relatedIds: ["wd-03", "wd-07", "wd-10"],
    reviews: [
      { author: "Julian P.", rating: 5, date: "Sep 30, 2026", title: "Best trousers I own", comment: "The drape as you move is unmatched. Fabric breathes beautifully." }
    ],
    featured: true
  },
  {
    id: "wd-05",
    name: "Seamless Chunky Mockneck Sweater",
    subtitle: "7-gauge rib knit in lambswool & cashmere",
    category: "knitwear",
    gender: "unisex",
    price: 480,
    badges: ["Winter Atelier"],
    rating: 4.8,
    reviewsCount: 31,
    material: "Cashmere",
    colorFamily: "neutrals",
    stockStatus: "Low Stock",
    stockRemaining: 3,
    colors: [
      { name: "Raw Ivory", hex: "#EBE7DF" },
      { name: "Slate Charcoal", hex: "#3A3C3E" },
      { name: "Warm Tobacco", hex: "#7E5233" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Knitted entirely on 3D seamless circular looms in the Scottish borders. Features an ergonomic standing rib neck, raglan armholes, and dense yet breathable handfeel.",
    composition: "70% Ultra-fine Geelong Lambswool, 30% Cashmere.",
    origin: "Knitted in Hawick, Scotland",
    care: "Hand wash in cool water with wool detergent. Dry flat on towels.",
    modelStats: "Model is 6'0\" (183cm), chest 39\", wearing size L.",
    relatedIds: ["wd-01", "wd-04", "wd-11"],
    reviews: [
      { author: "Miriam T.", rating: 5, date: "Oct 12, 2026", title: "Soft beyond belief", comment: "Zero itchy feel on the neck. Chunky without feeling heavy." }
    ],
    featured: true
  },
  {
    id: "wd-06",
    name: "Raw Silk Bias-Cut Column Dress",
    subtitle: "Fluid drape with delicate cowl neckline",
    category: "dresses",
    gender: "women",
    price: 590,
    badges: ["Limited Capsule"],
    rating: 4.9,
    reviewsCount: 19,
    material: "Mulberry Silk",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 4,
    colors: [
      { name: "Champagne Alabaster", hex: "#EDE6D9" },
      { name: "Obsidian", hex: "#161616" },
      { name: "Terracotta Clay", hex: "#A85D44" }
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "An ode to 90s minimalism. Cut diagonally across the grain to skim the contours of the body without clinging. Rolled baby hems and low-cut back detail.",
    composition: "100% Sandwashed Mulberry Silk (22 Momme). Matte velvet texture.",
    origin: "Atelier in Lyon, France",
    care: "Professional silk dry clean or cold gentle hand wash.",
    modelStats: "Model is 5'10\" (178cm), bust 32\", waist 24\", wearing size S.",
    relatedIds: ["wd-01", "wd-09", "wd-10"],
    reviews: [
      { author: "Camille D.", rating: 5, date: "Sep 15, 2026", title: "The epitome of elegance", comment: "Wore this to a gallery vernissage and received compliments all night." }
    ],
    featured: false
  },
  {
    id: "wd-07",
    name: "The Minimalist Boxy Poplin Shirt",
    subtitle: "Crisp Egyptian long-staple cotton",
    category: "tailoring",
    gender: "unisex",
    price: 290,
    badges: ["Organic Cotton"],
    rating: 4.7,
    reviewsCount: 64,
    material: "Japanese Cotton",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 15,
    colors: [
      { name: "Optical White", hex: "#FDFDFD" },
      { name: "Glacier Blue", hex: "#D6E2E9" },
      { name: "Micro Pinstripe", hex: "#C7D1DB" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "The quintessential shirt with subtle forward-thinking updates: dropped shoulder seams, hidden placket with Australian mother-of-pearl buttons, and a clean square hem.",
    composition: "100% Giza 87 Certified Organic Egyptian Cotton (120/2 yarn count).",
    origin: "Woven in Bergamo, Italy",
    care: "Machine wash cold gentle. Line dry, warm iron.",
    modelStats: "Model is 6'1\" (185cm), chest 38\", wearing size L.",
    relatedIds: ["wd-03", "wd-04", "wd-10"],
    reviews: [
      { author: "Liam H.", rating: 5, date: "Oct 11, 2026", title: "Crisp and structured", comment: "The collar holds its posture without needing stiff synthetic interlinings." }
    ],
    featured: false
  },
  {
    id: "wd-08",
    name: "Fine-Gauge Merino Cardigan",
    subtitle: "19.5-micron extrafine wool knit",
    category: "knitwear",
    gender: "women",
    price: 380,
    badges: ["Sustainable"],
    rating: 4.8,
    reviewsCount: 28,
    material: "Virgin Wool",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 7,
    colors: [
      { name: "Almond Ecru", hex: "#DEC8B5" },
      { name: "Deep Espresso", hex: "#32251F" },
      { name: "French Navy", hex: "#1A2238" }
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Silky, feather-light layering piece knitted from non-mulesed merino wool. Features a delicate V-neck, elongated ribbed cuffs, and tonal corozo nut buttons.",
    composition: "100% Extra-fine Merino Wool (RWS Certified).",
    origin: "Knitted in Florence, Italy",
    care: "Hand wash cold. Dry flat away from direct sunlight.",
    modelStats: "Model is 5'9\" (175cm), wearing size S.",
    relatedIds: ["wd-04", "wd-06", "wd-11"],
    reviews: [
      { author: "Sarah W.", rating: 4.9, date: "Sep 22, 2026", title: "Pure luxury staple", comment: "So thin yet surprisingly warm. Layering dream." }
    ],
    featured: false
  },
  {
    id: "wd-09",
    name: "Sculptural Calfskin Tote Bag",
    subtitle: "Hand-buffed vegetable-tanned leather",
    category: "accessories",
    gender: "unisex",
    price: 860,
    badges: ["Handcrafted"],
    rating: 5.0,
    reviewsCount: 39,
    material: "French Calfskin",
    colorFamily: "charcoals",
    stockStatus: "In Stock",
    stockRemaining: 4,
    colors: [
      { name: "Black Box Leather", hex: "#151515" },
      { name: "Cognac Tan", hex: "#8A4E2B" },
      { name: "Cream Butter", hex: "#F3EAD7" }
    ],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "A geometric, unlined tote formed from two seamless panels of full-grain Tuscan saddle leather. Equipped with interior magnetic closure, detachable zip pouch, and reinforced straps.",
    composition: "100% Full-grain Tuscan Calf Leather. Natural suede reverse.",
    origin: "Handcrafted in Florence, Italy",
    care: "Treat annually with natural leather balm. Avoid direct rain.",
    modelStats: "Dimensions: 42cm width, 36cm height, 14cm depth. Handle drop: 26cm.",
    relatedIds: ["wd-01", "wd-03", "wd-10"],
    reviews: [
      { author: "David M.", rating: 5, date: "Oct 19, 2026", title: "Artisan perfection", comment: "The leather smells heavenly. Develops a gorgeous patina with wear." }
    ],
    featured: true
  },
  {
    id: "wd-10",
    name: "Minimalist Leather Chelsea Boot",
    subtitle: "Single-piece French calfskin with bevelled waist",
    category: "accessories",
    gender: "unisex",
    price: 640,
    badges: ["Goodyear Welted"],
    rating: 4.9,
    reviewsCount: 41,
    material: "French Calfskin",
    colorFamily: "charcoals",
    stockStatus: "In Stock",
    stockRemaining: 9,
    colors: [
      { name: "Polished Black", hex: "#111111" },
      { name: "Burnished Umber", hex: "#4E3629" }
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Constructed with whole-cut calfskin upper eliminating side seams for a clean, sculptural silhouette. Goodyear-welted construction with channelled leather outsole and low-profile elastic side gussets.",
    composition: "100% French Box Calf Upper, Vegetable-tanned leather sole with Vibram rubber cap.",
    origin: "Northamptonshire, England",
    care: "Polish with beeswax shoe cream. Always insert cedar shoe trees.",
    modelStats: "Fits true to European sizing. If half size, size up.",
    relatedIds: ["wd-02", "wd-04", "wd-09"],
    reviews: [
      { author: "Nico G.", rating: 5, date: "Sep 29, 2026", title: "Flawless sleek profile", comment: "Cleanest toe box I have ever seen. No clunkiness whatsoever." }
    ],
    featured: false
  },
  {
    id: "wd-11",
    name: "Heavyweight Brushed Alpaca Scarf",
    subtitle: "Ultra-soft thermal weave with fringe",
    category: "accessories",
    gender: "unisex",
    price: 240,
    badges: ["Pure Alpaca"],
    rating: 4.8,
    reviewsCount: 35,
    material: "Baby Alpaca",
    colorFamily: "earth",
    stockStatus: "In Stock",
    stockRemaining: 14,
    colors: [
      { name: "Alpaca Oatmeal", hex: "#CFBAA2" },
      { name: "Charcoal Melange", hex: "#3A3937" },
      { name: "Warm Terracotta", hex: "#9E543C" }
    ],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "An enveloping, oversized winter scarf woven from sustainably sheared Peruvian baby alpaca. Brushed with natural thistle teasels for a cloud-like texture and thermal warmth.",
    composition: "100% Royal Baby Alpaca.",
    origin: "Arequipa, Peru",
    care: "Dry clean or spot clean with cold water.",
    modelStats: "Dimensions: 220cm length x 50cm width with 10cm fringed ends.",
    relatedIds: ["wd-01", "wd-02", "wd-05"],
    reviews: [
      { author: "Hannah S.", rating: 5, date: "Oct 27, 2026", title: "Like wearing a warm cloud", comment: "Massive size, keeps you cocooned all winter." }
    ],
    featured: false
  },
  {
    id: "wd-12",
    name: "Tailored Boiled Wool Overshirt",
    subtitle: "Dense water-resistant virgin wool layer",
    category: "outerwear",
    gender: "men",
    price: 510,
    badges: ["New Arrival"],
    rating: 4.9,
    reviewsCount: 22,
    material: "Virgin Wool",
    colorFamily: "charcoals",
    stockStatus: "In Stock",
    stockRemaining: 7,
    colors: [
      { name: "Graphite Charcoal", hex: "#333436" },
      { name: "Forest Moss", hex: "#3E4639" },
      { name: "Warm Taupe", hex: "#8F857D" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Versatile transitional outer layer crafted from dense 450gsm boiled virgin wool. Features minimal welt chest pockets, point collar, and custom matte horn hardware.",
    composition: "100% Austrian Boiled Virgin Wool (450gsm).",
    origin: "Coimbra, Portugal",
    care: "Spot clean or dry clean only.",
    modelStats: "Model is 6'2\" (188cm), wearing size L.",
    relatedIds: ["wd-04", "wd-07", "wd-10"],
    reviews: [
      { author: "Stefan B.", rating: 5, date: "Oct 15, 2026", title: "Dense, handsome wool", comment: "Works as a light jacket in autumn or midlayer under a coat." }
    ],
    featured: false
  },
  {
    id: "wd-13",
    name: "Pleated Silk-Georgette Midi Skirt",
    subtitle: "Knife-pleated fluid skirt with concealed waistband",
    category: "dresses",
    gender: "women",
    price: 540,
    badges: ["Pure Silk"],
    rating: 4.9,
    reviewsCount: 17,
    material: "Mulberry Silk",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 5,
    colors: [
      { name: "Ecru Chalk", hex: "#EBE6DD" },
      { name: "Pitch Noir", hex: "#141414" }
    ],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Precision heat-set accordion pleats that retain razor sharpness through movement. Cut from heavy 18mm silk-georgette with a natural fluid drape and concealed side zip.",
    composition: "100% Mulberry Silk Georgette; 100% Silk Habotai lining.",
    origin: "Como, Italy",
    care: "Specialist dry clean only.",
    modelStats: "Model is 5'10\" (178cm), waist 24\", wearing size S.",
    relatedIds: ["wd-03", "wd-08", "wd-09"],
    reviews: [
      { author: "Genevieve K.", rating: 5, date: "Sep 18, 2026", title: "Hypnotic movement", comment: "The pleats swish with absolute grace. A wardrobe treasure." }
    ],
    featured: false
  },
  {
    id: "wd-14",
    name: "Architectural Stand-Collar Cocoon Coat",
    subtitle: "Heavyweight melton wool in sculptural egg-shape",
    category: "outerwear",
    gender: "women",
    price: 1080,
    badges: ["Limited Atelier"],
    rating: 5.0,
    reviewsCount: 14,
    material: "Virgin Wool",
    colorFamily: "charcoals",
    stockStatus: "Low Stock",
    stockRemaining: 2,
    colors: [
      { name: "Anthracite", hex: "#2E3033" },
      { name: "Bone Ivory", hex: "#F2EFE9" }
    ],
    sizes: ["XS", "S", "M"],
    images: [
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Voluminous cocoon silhouette with sculptural funnel neck and hidden horn button closure. Lined in silky cupro silk with high side slits for easy pocket access.",
    composition: "100% Heavy Melton Virgin Wool (620gsm).",
    origin: "Kyoto Atelier, Japan",
    care: "Dry clean only. Cedar storage.",
    modelStats: "Model is 5'9\" (176cm), wearing size S.",
    relatedIds: ["wd-04", "wd-10", "wd-11"],
    reviews: [
      { author: "Valerie P.", rating: 5, date: "Oct 24, 2026", title: "Sculptural art piece", comment: "Feels like armor made of the softest wool. Worth every single penny." }
    ],
    featured: false
  },
  {
    id: "wd-15",
    name: "The Cashmere Ribbed Beanie & Glove Set",
    subtitle: "Seamless 4-ply cashmere cold-weather set",
    category: "accessories",
    gender: "unisex",
    price: 210,
    badges: ["Pure Cashmere"],
    rating: 4.8,
    reviewsCount: 42,
    material: "Cashmere",
    colorFamily: "neutrals",
    stockStatus: "In Stock",
    stockRemaining: 18,
    colors: [
      { name: "Oatmeal", hex: "#C7B89E" },
      { name: "Charcoal", hex: "#2C2D30" },
      { name: "Black", hex: "#111111" }
    ],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Knitted from dense 4-ply Grade-A cashmere. Ribbed turn-up cuff beanie paired with seamless touchscreen-compatible finger gloves.",
    composition: "100% Grade-A Mongolian Cashmere.",
    origin: "Hawick, Scotland",
    care: "Hand wash cold, dry flat.",
    modelStats: "Unisex one size fits all.",
    relatedIds: ["wd-01", "wd-05", "wd-11"],
    reviews: [
      { author: "Mark R.", rating: 5, date: "Oct 01, 2026", title: "Perfect winter essentials", comment: "No seams digging into the forehead. Sublimely soft." }
    ],
    featured: false
  },
  {
    id: "wd-16",
    name: "Single-Breasted Tropical Wool Suit Jacket",
    subtitle: "Half-canvassed unstructured summer-to-fall suiting",
    category: "tailoring",
    gender: "men",
    price: 760,
    badges: ["New Season"],
    rating: 4.9,
    reviewsCount: 16,
    material: "Virgin Wool",
    colorFamily: "blues",
    stockStatus: "In Stock",
    stockRemaining: 5,
    colors: [
      { name: "Deep Ink Navy", hex: "#151B29" },
      { name: "Flint Stone", hex: "#5E5F63" }
    ],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Cut with a natural soft shoulder and minimal canvas, allowing the lightweight tropical wool to move unconstrained. Pair with matching wide-leg trousers.",
    composition: "100% High-twist Tropical Wool (240gsm); butterfly half-lining.",
    origin: "Milan, Italy",
    care: "Dry clean only.",
    modelStats: "Model is 6'1\" (186cm), wearing size 40R / L.",
    relatedIds: ["wd-04", "wd-07", "wd-10"],
    reviews: [
      { author: "Christian W.", rating: 5, date: "Sep 20, 2026", title: "Modern Italian tailoring", comment: "Incredibly light, breathes like a linen shirt with the polish of fine wool." }
    ],
    featured: false
  }
];

// Curated Lookbook Ensembles
const LOOKBOOK = [
  {
    id: "look-01",
    title: "Look 01: The Monolithic Drape",
    subtitle: "Architectural cashmere wrap coat paired with fluid virgin wool trousers",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1400&q=85",
    items: [
      { id: "wd-01", label: "Cashmere Wrap Coat", price: 1150, x: 48, y: 35 },
      { id: "wd-04", label: "Wide-Leg Trouser", price: 420, x: 50, y: 78 }
    ],
    editorialNote: "In this study of proportion, the oversized wrap coat cascades into soft forward pleats, balancing sculptural weight with kinetic movement."
  },
  {
    id: "look-02",
    title: "Look 02: Sculpted Fluidity",
    subtitle: "Pure Mulberry silk column dress paired with hand-buffed calfskin tote",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1400&q=85",
    items: [
      { id: "wd-06", label: "Raw Silk Slip Dress", price: 590, x: 45, y: 48 },
      { id: "wd-09", label: "Sculptural Calfskin Tote", price: 860, x: 68, y: 65 }
    ],
    editorialNote: "A 90s bias cut rendered in heavyweight 22mm silk georgette, meeting the geometric rigidity of Florentine vegetable-tanned leather."
  },
  {
    id: "look-03",
    title: "Look 03: The Modern Suiting",
    subtitle: "Super 130s double-breasted tailoring in dark espresso with crisp Egyptian poplin",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1400&q=85",
    items: [
      { id: "wd-03", label: "Wool Atelier Blazer", price: 720, x: 52, y: 38 },
      { id: "wd-07", label: "Boxy Poplin Shirt", price: 290, x: 48, y: 28 },
      { id: "wd-04", label: "Wide-Leg Trouser", price: 420, x: 55, y: 82 }
    ],
    editorialNote: "Subtle peak lapels and roped shoulders provide structural authority, softened by the relaxed boxy silhouette of the organic cotton shirt."
  },
  {
    id: "look-04",
    title: "Look 04: The Winter Minimalist",
    subtitle: "7-gauge rib knit lambswool sweater cocooned in Peruvian baby alpaca",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85",
    items: [
      { id: "wd-05", label: "Chunky Mockneck Sweater", price: 480, x: 50, y: 40 },
      { id: "wd-11", label: "Brushed Alpaca Scarf", price: 240, x: 46, y: 22 }
    ],
    editorialNote: "Seamless 3D knitting technology from the Scottish borders delivers zero-chafe thermal insulation without excess bulk."
  }
];

// Curated Flagship Boutiques
const BOUTIQUES = [
  {
    city: "Paris",
    address: "248 Rue Saint-Honoré, 75001 Paris",
    phone: "+33 1 42 68 55 00",
    hours: "Mon – Sat: 10:30 – 19:30 | Sun: Private Appointments",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
  },
  {
    city: "Tokyo",
    address: "5-7-22 Minami-Aoyama, Minato-ku, Tokyo 107-0062",
    phone: "+81 3 5468 9120",
    hours: "Daily: 11:00 – 20:00",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
  },
  {
    city: "New York",
    address: "452 Mercer Street, SoHo, NY 10013",
    phone: "+1 212 941 7800",
    hours: "Mon – Sat: 11:00 – 19:00 | Sun: 12:00 – 18:00",
    image: "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80"
  },
  {
    city: "London",
    address: "18 Mount Street, Mayfair, London W1K 2RN",
    phone: "+44 20 7499 6300",
    hours: "Mon – Sat: 10:00 – 18:30",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80"
  },
  {
    city: "Zurich",
    address: "Bahnhofstrasse 32, 8001 Zürich",
    phone: "+41 44 211 44 10",
    hours: "Mon – Fri: 10:00 – 19:00 | Sat: 10:00 – 17:00",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80"
  }
];

// Multi-Currency Directory
const CURRENCIES = {
  USD: { symbol: "$", rate: 1.0, label: "USD ($)" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR (€)" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP (£)" },
  JPY: { symbol: "¥", rate: 152.0, label: "JPY (¥)" }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PRODUCTS, LOOKBOOK, BOUTIQUES, CURRENCIES };
}

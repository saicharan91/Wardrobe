/**
 * WARDROBE — Curated 16 Minimalist Fashion Garments & Accessories
 */

const PRODUCTS = [
  {
    id: "wd-01",
    name: "Double-Faced Cashmere Wrap Coat",
    category: "outerwear",
    price: 1150,
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
    care: "Dry clean only. Store on wide cedar hangers with supplied garment bag.",
    relatedIds: ["wd-04", "wd-05", "wd-09"]
  },
  {
    id: "wd-02",
    name: "Architectural Structured Trench",
    category: "outerwear",
    price: 890,
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
    relatedIds: ["wd-04", "wd-07", "wd-10"]
  },
  {
    id: "wd-03",
    name: "Double-Breasted Wool Atelier Blazer",
    category: "tailoring",
    price: 720,
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
    relatedIds: ["wd-04", "wd-07", "wd-09"]
  },
  {
    id: "wd-04",
    name: "Relaxed Pleated Wide-Leg Trouser",
    category: "tailoring",
    price: 420,
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
    relatedIds: ["wd-03", "wd-07", "wd-10"]
  },
  {
    id: "wd-05",
    name: "Seamless Chunky Mockneck Sweater",
    category: "knitwear",
    price: 480,
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
    relatedIds: ["wd-01", "wd-04", "wd-11"]
  },
  {
    id: "wd-06",
    name: "Raw Silk Bias-Cut Column Dress",
    category: "dresses",
    price: 590,
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
    relatedIds: ["wd-01", "wd-09", "wd-10"]
  },
  {
    id: "wd-07",
    name: "The Minimalist Boxy Poplin Shirt",
    category: "tailoring",
    price: 290,
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
    relatedIds: ["wd-03", "wd-04", "wd-10"]
  },
  {
    id: "wd-08",
    name: "Fine-Gauge Merino Cardigan",
    category: "knitwear",
    price: 380,
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
    relatedIds: ["wd-04", "wd-06", "wd-11"]
  },
  {
    id: "wd-09",
    name: "Sculptural Calfskin Tote Bag",
    category: "accessories",
    price: 860,
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
    relatedIds: ["wd-01", "wd-03", "wd-10"]
  },
  {
    id: "wd-10",
    name: "Minimalist Leather Chelsea Boot",
    category: "accessories",
    price: 640,
    colors: [
      { name: "Polished Black", hex: "#111111" },
      { name: "Burnished Umber", hex: "#4E3629" }
    ],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Constructed with whole-cut calfskin upper eliminating side seams for a clean, sculptural silhouette. Goodyear-welted construction with channelled leather outsole.",
    composition: "100% French Box Calf Upper, Vegetable-tanned leather sole with Vibram rubber cap.",
    origin: "Northamptonshire, England",
    care: "Polish with beeswax shoe cream. Always insert cedar shoe trees.",
    relatedIds: ["wd-02", "wd-04", "wd-09"]
  },
  {
    id: "wd-11",
    name: "Heavyweight Brushed Alpaca Scarf",
    category: "accessories",
    price: 240,
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
    relatedIds: ["wd-01", "wd-02", "wd-05"]
  },
  {
    id: "wd-12",
    name: "Tailored Boiled Wool Overshirt",
    category: "outerwear",
    price: 510,
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
    relatedIds: ["wd-04", "wd-07", "wd-10"]
  },
  {
    id: "wd-13",
    name: "Pleated Silk-Georgette Midi Skirt",
    category: "dresses",
    price: 540,
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
    relatedIds: ["wd-03", "wd-08", "wd-09"]
  },
  {
    id: "wd-14",
    name: "Architectural Stand-Collar Cocoon Coat",
    category: "outerwear",
    price: 1080,
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
    relatedIds: ["wd-04", "wd-10", "wd-11"]
  },
  {
    id: "wd-15",
    name: "The Cashmere Ribbed Beanie & Glove Set",
    category: "accessories",
    price: 210,
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
    relatedIds: ["wd-01", "wd-05", "wd-11"]
  },
  {
    id: "wd-16",
    name: "Single-Breasted Tropical Wool Suit Jacket",
    category: "tailoring",
    price: 760,
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
    relatedIds: ["wd-04", "wd-07", "wd-10"]
  }
];

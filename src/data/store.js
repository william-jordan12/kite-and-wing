export const CATEGORIES = [
  {
    id: 'kiteboarding',
    name: 'Kiteboarding',
    tagline: 'Kites, bars, boards and harnesses',
    brands: ['Duotone', 'Core', 'North', 'Cabrinha', 'F-One', 'Ozone', 'Eleveight', 'Airush', 'Slingshot', 'Reedin'],
  },
  {
    id: 'wing-foiling',
    name: 'Wing & Foiling',
    tagline: 'Wings, foils and related gear',
    brands: ['Armstrong', 'Duotone', 'F-One', 'North', 'Axis Foils', 'Naish', 'Cabrinha', 'Code Foils', 'KT Foiling', 'Sabfoil'],
  },
  {
    id: 'windsurfing',
    name: 'Windsurfing',
    tagline: 'Sails, boards and rigs',
    brands: ['Severne', 'Duotone', 'NeilPryde', 'Starboard', 'JP Australia', 'Goya', 'Fanatic', 'Ezzy Sails', 'Point-7', 'RRD'],
  },
]

export const PRODUCTS = [
  // ---------------- Kiteboarding ----------------
  { id: 'rebel-2026', name: 'Rebel 2026', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1899, size: '12m', description: 'The legendary big-air machine, reworked for explosive boosts and smooth landings.' },
  { id: 'click-bar-2026', name: 'Click Bar 2026', brand: 'Duotone', category: 'kiteboarding', type: 'Control Bar', price: 549, size: '55cm', description: 'Tool-free trim and quick release in a compact, durable control bar.' },
  { id: 'xr7', name: 'XR7', brand: 'Core', category: 'kiteboarding', type: 'Kite', price: 1799, size: '12m', description: 'All-round high performance kite with massive hang time and easy relaunch.' },
  { id: 'orbit-2026', name: 'Orbit 2026', brand: 'North', category: 'kiteboarding', type: 'Kite', price: 1849, size: '9m', description: 'Freestyle flagship tuned for unhooked pop and fast, direct handling.' },
  { id: 'switchblade', name: 'Switchblade', brand: 'Cabrinha', category: 'kiteboarding', type: 'Kite', price: 1749, size: '10m', description: 'The go-to do-everything kite with predictable power and relaunch.' },
  { id: 'bandit', name: 'Bandit S', brand: 'F-One', category: 'kiteboarding', type: 'Kite', price: 1699, size: '12m', description: 'Lightweight, lively and forgiving — the rider favorite from F-One.' },
  { id: 'edge-2026', name: 'Edge 2026', brand: 'Ozone', category: 'kiteboarding', type: 'Kite', price: 1829, size: '13m', description: 'Widest wind range and massive hang time for foil and big-air riders.' },
  { id: 'rs-2026', name: 'RS 2026', brand: 'Eleveight', category: 'kiteboarding', type: 'Kite', price: 1649, size: '11m', description: 'Performance freeride kite blending drift, hang time and easy handling.' },
  { id: 'lithium', name: 'Lithium 2026', brand: 'Airush', category: 'kiteboarding', type: 'Kite', price: 1729, size: '10m', description: 'High-aspect all-rounder with great low-end power and stability.' },
  { id: 'rally', name: 'Rally', brand: 'Slingshot', category: 'kiteboarding', type: 'Kite', price: 1599, size: '12m', description: 'Versatile freeride kite with a playful feel and solid boosting.' },
  { id: 'supermodel', name: 'Supermodel', brand: 'Reedin', category: 'kiteboarding', type: 'Kite', price: 1679, size: '11m', description: 'New-school all-rounder designed for loops, surf and everything between.' },
  { id: 'jaime-foil', name: 'Jaime Foil', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 1199, size: '138cm', description: 'Freestyle twintip with light carve and massive pop.' },
  { id: 'atmos', name: 'Atmos', brand: 'North', category: 'kiteboarding', type: 'Twin Tip Board', price: 1099, size: '140cm', description: 'All-terrain twintip built for speed, comfort and durability.' },
  { id: 'xcaliber', name: 'XCaliber', brand: 'Cabrinha', category: 'kiteboarding', type: 'Twin Tip Board', price: 999, size: '138cm', description: 'Big-air twin tip engineered for height and stable landings.' },

  // ---- Duotone Sale 2025 (kiteboarding) ----
  { id: 'duotone-rebel-dlab-2025-6m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2174, size: '6m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-7m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2250, size: '7m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-8m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2326, size: '8m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-9m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2403, size: '9m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-10m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2479, size: '10m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-11m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2555, size: '11m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-12m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2632, size: '12m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-rebel-dlab-2025-13m', name: 'Rebel D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2708, size: '13m', description: 'Premium D/LAB big-air kite with explosive boost and razor-sharp handling.' },
  { id: 'duotone-neo-dlab-2025-7m', name: 'Neo D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2021, size: '7m', description: 'D/LAB freeride kite with massive low-end power and a light, precise feel.' },
  { id: 'duotone-neo-dlab-2025-8m', name: 'Neo D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2098, size: '8m', description: 'D/LAB freeride kite with massive low-end power and a light, precise feel.' },
  { id: 'duotone-neo-dlab-2025-9m', name: 'Neo D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2174, size: '9m', description: 'D/LAB freeride kite with massive low-end power and a light, precise feel.' },
  { id: 'duotone-neo-dlab-2025-10m', name: 'Neo D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2250, size: '10m', description: 'D/LAB freeride kite with massive low-end power and a light, precise feel.' },
  { id: 'duotone-neo-dlab-2025-11m', name: 'Neo D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2326, size: '11m', description: 'D/LAB freeride kite with massive low-end power and a light, precise feel.' },
  { id: 'duotone-neo-dlab-2025-12m', name: 'Neo D/LAB 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 2403, size: '12m', description: 'D/LAB freeride kite with massive low-end power and a light, precise feel.' },
  { id: 'duotone-mono-2025-3.5m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1205, size: '3.5m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-mono-2025-5m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1272, size: '5m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-mono-2025-7m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1340, size: '7m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-mono-2025-9m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1407, size: '9m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-mono-2025-11m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1474, size: '11m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-mono-2025-13m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1542, size: '13m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-mono-2025-15m', name: 'Mono 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1609, size: '15m', description: 'Versatile single-skin foil kite with a huge wind range and effortless drift.' },
  { id: 'duotone-neo-2025-3m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1131, size: '3m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-4m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1148, size: '4m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-5m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1166, size: '5m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-6m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1183, size: '6m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-7m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1201, size: '7m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-8m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1218, size: '8m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-9m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1235, size: '9m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-10m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1253, size: '10m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-11m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1270, size: '11m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-neo-2025-12m', name: 'Neo 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Kite', price: 1288, size: '12m', description: 'All-round freeride favorite with predictable power and easy relaunch.' },
  { id: 'duotone-ts-freestyle-sls-2025-136cm', name: 'TS Freestyle SLS 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 915, size: '136cm', description: 'Freestyle twintip with big pop and a light, snappy feel.' },
  { id: 'duotone-ts-freestyle-sls-2025-140cm', name: 'TS Freestyle SLS 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 915, size: '140cm', description: 'Freestyle twintip with big pop and a light, snappy feel.' },
  { id: 'duotone-ts-freestyle-sls-2025-144cm', name: 'TS Freestyle SLS 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 915, size: '144cm', description: 'Freestyle twintip with big pop and a light, snappy feel.' },
  { id: 'duotone-ts-park-2025-151cm', name: 'TS Park 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Twin Tip Board', price: 571, size: '151cm', description: 'Durable wakestyle board built for the cable park and boots.' },
  { id: 'duotone-boardbag-single-surf-2024', name: 'Boardbag Single Surf 2024', brand: 'Duotone', category: 'kiteboarding', type: 'Boardbag', price: 76, size: '6\'0"', description: 'Padded single surfboard bag with durable travel protection.' },
  { id: 'duotone-boardbag-single-compact-2025', name: 'Boardbag Single Compact 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Boardbag', price: 76, size: '5\'5"', description: 'Compact padded board bag built for easy travel.' },
  { id: 'duotone-traction-pad-sls-front-2025', name: 'Traction Pad SLS Front 2025', brand: 'Duotone', category: 'kiteboarding', type: 'Traction Pad', price: 76, size: '4mm', description: 'Superlight grip traction pad with plush, durable foam.' },
  { id: 'duotone-traction-pad-team-front', name: 'Traction Pad Team Front', brand: 'Duotone', category: 'kiteboarding', type: 'Traction Pad', price: 76, size: '3mm', description: 'Team grip traction pad with a proven, durable compound.' },
  { id: 'duotone-cap-new-era-undyed', name: 'Cap New Era Adjustable UNDYED', brand: 'Duotone', category: 'kiteboarding', type: 'Cap', price: 27, size: 'One Size', description: 'Undyed adjustable New Era cap for everyday wear.' },
  { id: 'duotone-tank-women-xs', name: 'Tank Duotone Women', brand: 'Duotone', category: 'kiteboarding', type: 'Tank', price: 44, size: 'XS', description: 'Lightweight women tank top with a soft, breathable feel.' },
  { id: 'duotone-tank-women-s', name: 'Tank Duotone Women', brand: 'Duotone', category: 'kiteboarding', type: 'Tank', price: 44, size: 'S', description: 'Lightweight women tank top with a soft, breathable feel.' },
  { id: 'duotone-tank-women-m', name: 'Tank Duotone Women', brand: 'Duotone', category: 'kiteboarding', type: 'Tank', price: 44, size: 'M', description: 'Lightweight women tank top with a soft, breathable feel.' },
  { id: 'duotone-tank-women-l', name: 'Tank Duotone Women', brand: 'Duotone', category: 'kiteboarding', type: 'Tank', price: 44, size: 'L', description: 'Lightweight women tank top with a soft, breathable feel.' },
  { id: 'duotone-tank-women-xl', name: 'Tank Duotone Women', brand: 'Duotone', category: 'kiteboarding', type: 'Tank', price: 44, size: 'XL', description: 'Lightweight women tank top with a soft, breathable feel.' },
  { id: 'duotone-hoody-team-zip-women-xs', name: 'Hoody Team Zip Women', brand: 'Duotone', category: 'kiteboarding', type: 'Hoody', price: 131, size: 'XS', description: 'Team zip hoody for women with a cozy, athletic fit.' },
  { id: 'duotone-hoody-team-zip-women-s', name: 'Hoody Team Zip Women', brand: 'Duotone', category: 'kiteboarding', type: 'Hoody', price: 131, size: 'S', description: 'Team zip hoody for women with a cozy, athletic fit.' },
  { id: 'duotone-hoody-team-zip-women-m', name: 'Hoody Team Zip Women', brand: 'Duotone', category: 'kiteboarding', type: 'Hoody', price: 131, size: 'M', description: 'Team zip hoody for women with a cozy, athletic fit.' },
  { id: 'duotone-hoody-team-zip-women-l', name: 'Hoody Team Zip Women', brand: 'Duotone', category: 'kiteboarding', type: 'Hoody', price: 131, size: 'L', description: 'Team zip hoody for women with a cozy, athletic fit.' },

  // ---------------- Wing & Foiling ----------------
  { id: 'unit-wing', name: 'Unit Wing', brand: 'Duotone', category: 'wing-foiling', type: 'Wing', price: 1099, size: '4.5m', description: 'Compact, powerful wing with excellent drift and featherlight feel.' },
  { id: 'swing-wing', name: 'Swing V4', brand: 'F-One', category: 'wing-foiling', type: 'Wing', price: 1149, size: '5.0m', description: 'Tried-and-tested wing with smooth power delivery and easy control.' },
  { id: 'armstrong-wing', name: 'CF Wing', brand: 'Armstrong', category: 'wing-foiling', type: 'Wing', price: 1199, size: '5.0m', description: "Armstrong's performance wing built for precision foiling." },
  { id: 'nova-wing', name: 'Nova Wing', brand: 'North', category: 'wing-foiling', type: 'Wing', price: 1099, size: '4.5m', description: 'Beginner-friendly yet high-performance wing from North.' },
  { id: 'naish-wing', name: 'Surf Wing', brand: 'Naish', category: 'wing-foiling', type: 'Wing', price: 1049, size: '4.5m', description: 'Lightweight surf-focused wing with huge usable range.' },
  { id: 'axis-foil', name: 'Axis Complete Foil', brand: 'Axis Foils', category: 'wing-foiling', type: 'Foil Set', price: 2499, size: 'Mast 85cm', description: 'Complete carbon foil kit with premium performance and range.' },
  { id: 'sabfoil', name: 'Sabfoil Cruise Set', brand: 'Sabfoil', category: 'wing-foiling', type: 'Foil Set', price: 2299, size: 'Mast 80cm', description: 'Versatile full foiling package ideal for wing and windsurf foiling.' },
  { id: 'kt-foil', name: 'KT Foiling Race', brand: 'KT Foiling', category: 'wing-foiling', type: 'Foil Set', price: 2199, size: 'Mast 90cm', description: 'Race-oriented foil set delivering speed and glide.' },
  { id: 'code-foil', name: 'Code Foil Package', brand: 'Code Foils', category: 'wing-foiling', type: 'Foil Set', price: 2099, size: 'Mast 80cm', description: 'Progressive foil package with a wide, confidence-building platform.' },
  { id: 'prism-wing', name: 'Prism Wing', brand: 'Cabrinha', category: 'wing-foiling', type: 'Wing', price: 1079, size: '5.0m', description: 'Balanced all-round wing with intuitive feel in the air.' },

  // ---- Duotone Sale 2025 (wing & foiling) ----
  { id: 'duotone-mast-fuselage-slim-75-67', name: 'Mast-Fuselage Set Slim AL QM', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 435, size: '75/67', description: 'Slim aluminium mast and fuselage set for clean foiling performance.' },
  { id: 'duotone-mast-fuselage-slim-90-67', name: 'Mast-Fuselage Set Slim AL QM', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 435, size: '90/67', description: 'Slim aluminium mast and fuselage set for clean foiling performance.' },
  { id: 'duotone-foil-set-al-surf-40-67-1250-250', name: 'Foil Set Complete AL Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 765, size: '40/67-1250/250', description: 'Complete aluminium foil set tuned for surf foiling and downwind.' },
  { id: 'duotone-foil-set-al-surf-40-67-1500-250', name: 'Foil Set Complete AL Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 765, size: '40/67-1500/250', description: 'Complete aluminium foil set tuned for surf foiling and downwind.' },
  { id: 'duotone-foil-set-al-surf-60-67-1250-250', name: 'Foil Set Complete AL Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 765, size: '60/67-1250/250', description: 'Complete aluminium foil set tuned for surf foiling and downwind.' },
  { id: 'duotone-foil-set-al-surf-60-67-1500-250', name: 'Foil Set Complete AL Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 765, size: '60/67-1500/250', description: 'Complete aluminium foil set tuned for surf foiling and downwind.' },
  { id: 'duotone-foil-set-al-surf-75-67-1250-250', name: 'Foil Set Complete AL Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 765, size: '75/67-1250/250', description: 'Complete aluminium foil set tuned for surf foiling and downwind.' },
  { id: 'duotone-foil-set-al-surf-75-67-1500-250', name: 'Foil Set Complete AL Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 765, size: '75/67-1500/250', description: 'Complete aluminium foil set tuned for surf foiling and downwind.' },
  { id: 'duotone-foil-set-al-gt-40-67-565-215', name: 'Foil Set Complete AL GT', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 725, size: '40/67-565/215', description: 'Complete aluminium foil set with a fast, glide-focused GT setup.' },
  { id: 'duotone-foil-set-al-gt-75-67-565-215', name: 'Foil Set Complete AL GT', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 725, size: '75/67-565/215', description: 'Complete aluminium foil set with a fast, glide-focused GT setup.' },
  { id: 'duotone-foil-set-al-gt-90-67-565-215', name: 'Foil Set Complete AL GT', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 725, size: '90/67-565/215', description: 'Complete aluminium foil set with a fast, glide-focused GT setup.' },
  { id: 'duotone-foil-set-al-freeride-40-67-700-255', name: 'Foil Set Complete AL Freeride', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 564, size: '40/67-700/255', description: 'Complete aluminium foil set for fun, user-friendly freeride foiling.' },
  { id: 'duotone-foil-set-al-freeride-60-67-700-255', name: 'Foil Set Complete AL Freeride', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 564, size: '60/67-700/255', description: 'Complete aluminium foil set for fun, user-friendly freeride foiling.' },
  { id: 'duotone-foil-set-al-freeride-75-67-700-255', name: 'Foil Set Complete AL Freeride', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 564, size: '75/67-700/255', description: 'Complete aluminium foil set for fun, user-friendly freeride foiling.' },
  { id: 'duotone-foil-set-al-freeride-90-67-700-255', name: 'Foil Set Complete AL Freeride', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 564, size: '90/67-700/255', description: 'Complete aluminium foil set for fun, user-friendly freeride foiling.' },
  { id: 'duotone-wing-set-surf-1250-250', name: 'Wing Set Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Wing', price: 381, size: '1250/250', description: 'Aluminium wing set with a smooth, forgiving feel for surf foiling.' },
  { id: 'duotone-wing-set-surf-1500-250', name: 'Wing Set Surf', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Wing', price: 381, size: '1500/250', description: 'Aluminium wing set with a smooth, forgiving feel for surf foiling.' },
  { id: 'duotone-mast-fuselage-3.0-90-67', name: 'Mast-Fuselage Set AL 3.0 90/67', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 326, size: '90/67', description: 'Aluminium 3.0 mast and fuselage set, 90/67.' },
  { id: 'duotone-mast-fuselage-3.0-75-67', name: 'Mast-Fuselage Set AL 3.0 75/67', brand: 'Duotone', category: 'wing-foiling', type: 'Foil Set', price: 326, size: '75/67', description: 'Aluminium 3.0 mast and fuselage set, 75/67.' },

  // ---------------- Windsurfing ----------------
  { id: 'super-hero', name: 'Super Hero', brand: 'Duotone', category: 'windsurfing', type: 'Sail', price: 999, size: '5.4m', description: 'Wave and freestyle sail with instant power and drift control.' },
  { id: 's1', name: 'S-1', brand: 'Severne', category: 'windsurfing', type: 'Sail', price: 899, size: '5.0m', description: 'Pro wave sail delivering performance and durability.' },
  { id: 'rs-racing', name: 'RS:Racing', brand: 'NeilPryde', category: 'windsurfing', type: 'Sail', price: 1099, size: '7.0m', description: 'High-performance racing sail with incredible range.' },
  { id: 'evo', name: 'Evo 100', brand: 'Starboard', category: 'windsurfing', type: 'Board', price: 2199, size: '100L', description: 'Freemove board that feels fast, loose and forgiving.' },
  { id: 'jp-air', name: 'A-Sonic 110', brand: 'JP Australia', category: 'windsurfing', type: 'Board', price: 2099, size: '110L', description: 'All-round freeride board with easy planing and control.' },
  { id: 'skate', name: 'Skate 105', brand: 'Fanatic', category: 'windsurfing', type: 'Board', price: 1999, size: '105L', description: 'Wave board built for tight turns in critical sections.' },
  { id: 'banzai', name: 'Banzai 94', brand: 'Goya', category: 'windsurfing', type: 'Board', price: 2099, size: '94L', description: 'Down-the-line wave board with lively, aggressive feel.' },
  { id: 'ezzy-wave', name: 'Wave 5.2', brand: 'Ezzy Sails', category: 'windsurfing', type: 'Sail', price: 849, size: '5.2m', description: 'Compact wave sail with forgiving power curve.' },
  { id: 'point7', name: 'AC-1 5.6', brand: 'Point-7', category: 'windsurfing', type: 'Sail', price: 949, size: '5.6m', description: 'Race sail with explosive power and excellent stability.' },
  { id: 'rrd-fire', name: 'Fire 5.8', brand: 'RRD', category: 'windsurfing', type: 'Sail', price: 899, size: '5.8m', description: 'Freeride sail with smooth handling and easy trim.' },
]

export const STORE_INFO = {
  name: 'Kite and Wind Supply',
  email: 'kiteandwindsupply@gmail.com',
  whatsapp: '+15551234567',
  locations: ['California, USA', 'Vilnius, Lithuania'],
  facebook: '',
  paymentMethods: [
    'Revolut',
    'Cards',
    'Google Pay',
    'Cash App',
    'PayPal',
    'Venmo',
    'Zelle',
    'Bitcoin',
    'Apple Pay',
    'Chime',
    'Bank Transfer',
    'Cryptocurrency',
    'Wire Transfer',
  ],
}

export function getCategory(id) {
  return CATEGORIES.find((c) => c.id === id)
}

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id)
}

export function getProductsByCategory(categoryId) {
  return PRODUCTS.filter((p) => p.category === categoryId)
}

export function getProductsByBrand(categoryId, brand) {
  return getProductsByCategory(categoryId).filter((p) => p.brand === brand)
}

export const formatPrice = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

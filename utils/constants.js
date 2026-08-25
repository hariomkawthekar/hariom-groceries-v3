export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Hariom Grocery'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const CATEGORIES = [
  'All',
  'Dairy, Bread ',
  'Atta, Rice & Dal',
  'Masala, Oil & More',
  'Sauces & Spreads',
  'Snacks & Munchies',
  'Sweet Tooth',
  'Tea, Coffee & Drinks',
  'Bakery & Biscuits',
  'Cleaning Essentials',
  'Personal Care'
]

export const FEATURED_CATEGORY_TILES = [
  {
    id: 'dairy-bread',
    name: 'Dairy, Bread ',
    subtitle: 'Milk, Paneer, Tofu, Butter ',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    bgColor: 'bg-blue-50/90 hover:bg-blue-100 border-blue-200 text-blue-900',
    categoryKey: 'Dairy, Bread & Eggs',
    keywords: ['dairy', 'milk', 'paneer', 'tofu', 'butter', 'bread']
  },
  {
    id: 'masala-oil',
    name: 'Masala, Oil & More',
    subtitle: 'Fortune Oil, Spices & Salt',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    bgColor: 'bg-amber-50/90 hover:bg-amber-100 border-amber-200 text-amber-900',
    categoryKey: 'Masala, Oil & More',
    keywords: ['oil', 'masala', 'spices', 'salt', 'tikhalal', 'chili']
  },
  {
    id: 'sauces-spreads',
    name: 'Sauces & Spreads',
    subtitle: 'Kissan Ketchup, Nutella & Jams',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400',
    bgColor: 'bg-rose-50/90 hover:bg-rose-100 border-rose-200 text-rose-900',
    categoryKey: 'Sauces & Spreads',
    keywords: ['sauce', 'ketchup', 'spread', 'nutella', 'jam']
  },
  {
    id: 'atta-rice-dal',
    name: 'Atta, Rice & Dal',
    subtitle: 'Basmati Rice, Wheat Atta & Pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    bgColor: 'bg-yellow-50/90 hover:bg-yellow-100 border-yellow-200 text-yellow-900',
    categoryKey: 'Atta, Rice & Dal',
    keywords: ['atta', 'rice', 'dal', 'pulses', 'grains', 'wheat']
  },
  {
    id: 'snacks-munchies',
    name: 'Snacks & Munchies',
    subtitle: 'Chips, Namkeen, Biscuits',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    bgColor: 'bg-orange-50/90 hover:bg-orange-100 border-orange-200 text-orange-900',
    categoryKey: 'Snacks & Munchies',
    keywords: ['snacks', 'chips', 'namkeen', 'biscuits', 'munchies']
  },
  {
    id: 'sweet-tooth',
    name: 'Sweet Tooth',
    subtitle: 'Dairy Milk Silk & Chocolates',
    image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=400',
    bgColor: 'bg-pink-50/90 hover:bg-pink-100 border-pink-200 text-pink-900',
    categoryKey: 'Sweet Tooth',
    keywords: ['sweet', 'chocolate', 'silk', 'icecream', 'candy']
  },
  {
    id: 'tea-coffee',
    name: 'Tea, Coffee & Drinks',
    subtitle: 'Tea, Nescafe Coffee, Juices',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400',
    bgColor: 'bg-purple-50/90 hover:bg-purple-100 border-purple-200 text-purple-900',
    categoryKey: 'Tea, Coffee & Drinks',
    keywords: ['tea', 'coffee', 'drinks', 'juices', 'beverages', 'pepsi']
  },
  {
    id: 'bakery-biscuits',
    name: 'Bakery & Biscuits',
    subtitle: 'Whole Wheat Bread & Cookies',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    bgColor: 'bg-emerald-50/90 hover:bg-emerald-100 border-emerald-200 text-emerald-900',
    categoryKey: 'Bakery & Biscuits',
    keywords: ['bakery', 'bread', 'biscuits', 'cookies', 'toast']
  },
  {
    id: 'cleaning-essentials',
    name: 'Cleaning Essentials',
    subtitle: 'Detergents & Cleaners',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400',
    bgColor: 'bg-teal-50/90 hover:bg-teal-100 border-teal-200 text-teal-900',
    categoryKey: 'Cleaning Essentials',
    keywords: ['cleaning', 'detergent', 'surf', 'harpic', 'soap']
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    subtitle: 'Shampoo, Soaps & Care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
    bgColor: 'bg-indigo-50/90 hover:bg-indigo-100 border-indigo-200 text-indigo-900',
    categoryKey: 'Personal Care',
    keywords: ['personal', 'care', 'shampoo', 'soap', 'facewash']
  }
]

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'rating', label: 'Highest Rated' }
]

export const DELIVERY_FEE = 40
export const FREE_DELIVERY_THRESHOLD = 499

export const DEFAULT_PRODUCTS = [
  // Dairy, Bread & Eggs
  {
    id: 1,
    name: 'Amul Gold Full Cream Milk',
    category: 'Dairy, Bread & Eggs',
    price: 55,
    originalPrice: 60,
    unit: '1 Liter',
    image: '/images/Amul-gold.webp',
    inStock: true,
    rating: 4.9,
    ratingCount: 620
  },
  {
    id: 2,
    name: 'Fresh Malai Paneer',
    category: 'Dairy, Bread & Eggs',
    price: 90,
    originalPrice: 110,
    unit: '200g Pack',
    image: 'https://images.unsplash.com/photo-1527156231393-7023794f363c?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 310
  },
  {
    id: 3,
    name: 'Organic Soya Tofu',
    category: 'Dairy, Bread & Eggs',
    price: 75,
    originalPrice: 95,
    unit: '200g Pack',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    inStock: true,
    rating: 4.7,
    ratingCount: 145
  },
  {
    id: 4,
    name: 'Amul Salted Butter',
    category: 'Dairy, Bread & Eggs',
    price: 58,
    originalPrice: 65,
    unit: '100g Pack',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 380
  },
  {
    id: 5,
    name: 'Farm Fresh White Eggs',
    category: 'Dairy, Bread & Eggs',
    price: 48,
    originalPrice: 60,
    unit: '6 Eggs Pack',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 290
  },
  {
    id: 6,
    name: 'Fresh Whole Wheat Bread',
    category: 'Dairy, Bread & Eggs',
    price: 45,
    originalPrice: 55,
    unit: '400g Pack',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    inStock: true,
    rating: 4.6,
    ratingCount: 150
  },

  // Atta, Rice & Dal
  {
    id: 7,
    name: 'Premium Basmati Rice',
    category: 'Atta, Rice & Dal',
    price: 80,
    originalPrice: 100,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 210
  },
  {
    id: 8,
    name: 'India Gate Basmati Rice',
    category: 'Atta, Rice & Dal',
    price: 120,
    originalPrice: 150,
    unit: '1 kg',
    image: '/images/india Gate Basmati Rice.jfif',
    inStock: true,
    rating: 4.9,
    ratingCount: 340
  },
  {
    id: 9,
    name: 'Samrat Whole Wheat Atta',
    category: 'Atta, Rice & Dal',
    price: 310,
    originalPrice: 360,
    unit: '5 kg',
    image: '/images/Samrat Atta.jfif',
    inStock: true,
    rating: 4.7,
    ratingCount: 195
  },
  {
    id: 10,
    name: 'Yellow Toor Dal / Arhar Dal',
    category: 'Atta, Rice & Dal',
    price: 160,
    originalPrice: 190,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1585994191611-72b3a39396d1?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 165
  },

  // Masala, Oil & More
  {
    id: 11,
    name: 'Fortune Sunflower Oil',
    category: 'Masala, Oil & More',
    price: 600,
    originalPrice: 720,
    unit: '5 Liter',
    image: '/images/fortune sunflower oil.jpg',
    inStock: true,
    rating: 4.8,
    ratingCount: 512
  },
  {
    id: 12,
    name: 'Everest Tikhalal Red Chili Powder',
    category: 'Masala, Oil & More',
    price: 75,
    originalPrice: 90,
    unit: '100g Pack',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 420
  },
  {
    id: 13,
    name: 'Tata Iodized Salt',
    category: 'Masala, Oil & More',
    price: 28,
    originalPrice: 32,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518110165401-4467c69992f0?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 530
  },

  // Sauces & Spreads
  {
    id: 14,
    name: 'Kissan Fresh Tomato Ketchup',
    category: 'Sauces & Spreads',
    price: 120,
    originalPrice: 145,
    unit: '950g Squeezy Pouch',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 480
  },
  {
    id: 15,
    name: 'Nutella Hazelnut Cocoa Spread',
    category: 'Sauces & Spreads',
    price: 360,
    originalPrice: 420,
    unit: '350g Jar',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500',
    inStock: true,
    rating: 5.0,
    ratingCount: 890
  },

  // Sweet Tooth
  {
    id: 16,
    name: 'Dairy Milk Silk Chocolate',
    category: 'Sweet Tooth',
    price: 99,
    originalPrice: 120,
    unit: '1 Pack',
    image: '/images/Dairy Milk Chocolate.jfif',
    inStock: true,
    rating: 5.0,
    ratingCount: 780
  },

  // Snacks & Munchies
  {
    id: 17,
    name: 'Parle-G Gold Biscuits',
    category: 'Snacks & Munchies',
    price: 25,
    originalPrice: 30,
    unit: '1 Pack',
    image: '/images/Parle-G.jfif',
    inStock: true,
    rating: 4.6,
    ratingCount: 450
  },
  {
    id: 18,
    name: 'Classic Potato Chips',
    category: 'Snacks & Munchies',
    price: 20,
    originalPrice: 25,
    unit: '50g Pack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    inStock: true,
    rating: 4.7,
    ratingCount: 230
  },

  // Tea, Coffee & Drinks
  {
    id: 19,
    name: 'Taj Mahal Premium Tea',
    category: 'Tea, Coffee & Drinks',
    price: 220,
    originalPrice: 260,
    unit: '500g Pack',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 270
  },
  {
    id: 20,
    name: 'Nescafe Classic Instant Coffee',
    category: 'Tea, Coffee & Drinks',
    price: 195,
    originalPrice: 230,
    unit: '100g Jar',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 410
  },

  // Cleaning Essentials
  {
    id: 21,
    name: 'Surf Excel Matic Liquid Detergent',
    category: 'Cleaning Essentials',
    price: 240,
    originalPrice: 280,
    unit: '1 Liter',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 340
  },
  {
    id: 22,
    name: 'Harpic Power Plus Toilet Cleaner',
    category: 'Cleaning Essentials',
    price: 95,
    originalPrice: 115,
    unit: '500ml Bottle',
    image: 'https://images.unsplash.com/photo-1584813470613-5a1c1cad2d87?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 280
  },

  // Personal Care
  {
    id: 23,
    name: 'Head & Shoulders Anti-Dandruff Shampoo',
    category: 'Personal Care',
    price: 180,
    originalPrice: 220,
    unit: '340ml Bottle',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
    inStock: true,
    rating: 4.7,
    ratingCount: 390
  }
];

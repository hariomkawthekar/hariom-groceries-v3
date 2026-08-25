export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Hariom Grocery'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const CATEGORIES = [
  'All',
  'Greens',
  'Oil',
  'Dairy',
  'Chocolate',
  'Snacks',
  'Pulses',
  'Spices',
  'Beverages',
  'Bakery',
  'Grains'
]

export const CATEGORY_DETAILS = [
  { id: 'All', name: 'All', icon: '🛒', color: 'from-emerald-500 to-teal-600', bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Greens', name: 'Greens', icon: '🥬', color: 'from-green-500 to-emerald-600', bgLight: 'bg-green-50 text-green-700 border-green-200' },
  { id: 'Oil', name: 'Oil', icon: '🛢️', color: 'from-amber-500 to-yellow-600', bgLight: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Dairy', name: 'Dairy', icon: '🥛', color: 'from-blue-500 to-indigo-600', bgLight: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Chocolate', name: 'Chocolate', icon: '🍫', color: 'from-amber-700 to-amber-900', bgLight: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'Snacks', name: 'Snacks', icon: '🍟', color: 'from-orange-500 to-amber-600', bgLight: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'Pulses', name: 'Pulses', icon: '🫘', color: 'from-yellow-600 to-amber-700', bgLight: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { id: 'Spices', name: 'Spices', icon: '🧂', color: 'from-red-500 to-rose-700', bgLight: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'Beverages', name: 'Beverages', icon: '☕', color: 'from-purple-500 to-indigo-600', bgLight: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Bakery', name: 'Bakery', icon: '🍞', color: 'from-amber-600 to-orange-600', bgLight: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'Grains', name: 'Grains', icon: '🌾', color: 'from-yellow-500 to-lime-600', bgLight: 'bg-yellow-50 text-yellow-700 border-yellow-200' }
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
  {
    id: 1,
    name: 'Fresh Organic Palak (Spinach)',
    category: 'Greens',
    price: 30,
    originalPrice: 40,
    unit: '250g Bunch',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 142
  },
  {
    id: 2,
    name: 'Fresh Coriander (Kothmir)',
    category: 'Greens',
    price: 20,
    originalPrice: 25,
    unit: '100g Bunch',
    image: 'https://images.unsplash.com/photo-1588879460618-924a73752e89?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 88
  },
  {
    id: 3,
    name: 'Organic Methi (Fenugreek Leaves)',
    category: 'Greens',
    price: 25,
    originalPrice: 35,
    unit: '250g Bunch',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    inStock: true,
    rating: 4.7,
    ratingCount: 64
  },
  {
    id: 4,
    name: 'Premium Basmati Rice',
    category: 'Grains',
    price: 80,
    originalPrice: 100,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 210
  },
  {
    id: 5,
    name: 'India Gate Basmati Rice',
    category: 'Grains',
    price: 120,
    originalPrice: 150,
    unit: '1 kg',
    image: '/images/india Gate Basmati Rice.jfif',
    inStock: true,
    rating: 4.9,
    ratingCount: 340
  },
  {
    id: 6,
    name: 'Samrat Whole Wheat Atta',
    category: 'Grains',
    price: 310,
    originalPrice: 360,
    unit: '5 kg',
    image: '/images/Samrat Atta.jfif',
    inStock: true,
    rating: 4.7,
    ratingCount: 195
  },
  {
    id: 7,
    name: 'Fortune Sunflower Oil',
    category: 'Oil',
    price: 600,
    originalPrice: 720,
    unit: '5 Liter',
    image: '/images/fortune sunflower oil.jpg',
    inStock: true,
    rating: 4.8,
    ratingCount: 512
  },
  {
    id: 8,
    name: 'Amul Gold Milk',
    category: 'Dairy',
    price: 55,
    originalPrice: 60,
    unit: '1 Liter',
    image: '/images/Amul-gold.webp',
    inStock: true,
    rating: 4.9,
    ratingCount: 620
  },
  {
    id: 9,
    name: 'Dairy Milk Silk Chocolate',
    category: 'Chocolate',
    price: 99,
    originalPrice: 120,
    unit: '1 Pack',
    image: '/images/Dairy Milk Chocolate.jfif',
    inStock: true,
    rating: 5.0,
    ratingCount: 780
  },
  {
    id: 10,
    name: 'Parle-G Gold Biscuits',
    category: 'Snacks',
    price: 25,
    originalPrice: 30,
    unit: '1 Pack',
    image: '/images/Parle-G.jfif',
    inStock: true,
    rating: 4.6,
    ratingCount: 450
  },
  {
    id: 15,
    name: 'Yellow Toor Dal / Arhar Dal',
    category: 'Pulses',
    price: 160,
    originalPrice: 190,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1585994191611-72b3a39396d1?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 165
  },
  {
    id: 16,
    name: 'Tata Iodized Salt',
    category: 'Spices',
    price: 28,
    originalPrice: 32,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518110165401-4467c69992f0?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 530
  },
  {
    id: 17,
    name: 'Taj Mahal Premium Tea',
    category: 'Beverages',
    price: 220,
    originalPrice: 260,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
    inStock: true,
    rating: 4.8,
    ratingCount: 270
  },
  {
    id: 18,
    name: 'Nescafe Classic Instant Coffee',
    category: 'Beverages',
    price: 195,
    originalPrice: 230,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 410
  },
  {
    id: 19,
    name: 'Amul Salted Butter',
    category: 'Dairy',
    price: 58,
    originalPrice: 65,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
    inStock: true,
    rating: 4.9,
    ratingCount: 380
  },
  {
    id: 20,
    name: 'Fresh Whole Wheat Bread',
    category: 'Bakery',
    price: 45,
    originalPrice: 55,
    unit: '400g Pack',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    inStock: true,
    rating: 4.6,
    ratingCount: 150
  },
  {
    id: 21,
    name: 'Classic Potato Chips',
    category: 'Snacks',
    price: 20,
    originalPrice: 25,
    unit: '50g Pack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    inStock: true,
    rating: 4.7,
    ratingCount: 230
  }
];
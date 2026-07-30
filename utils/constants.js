export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Hariom Grocery'
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export const CATEGORIES = [
  'All',
  'Fruits',
  'Vegetables',
  'Dairy',
  'Grains',
  'Bakery',
  'Beverages',
  'Snacks',
  'Personal Care',
  'Household'
]

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name' },
  { value: 'newest', label: 'Newest First' }
]

export const DELIVERY_FEE = 40
export const FREE_DELIVERY_THRESHOLD = 499

export const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Basmati Rice',
    category: 'Grains',
    price: 80,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    inStock: true
  },
  {
    id: 2,
    name: 'India Gate Basmati Rice',
    category: 'Grains',
    price: 120,
    unit: '1 kg',
    image: '/images/india Gate Basmati Rice.jfif',
    inStock: true
  },
  {
    id: 3,
    name: 'Samrat Whole Wheat Atta',
    category: 'Grains',
    price: 310,
    unit: '5 kg',
    image: '/images/Samrat Atta.jfif',
    inStock: true
  },
  {
    id: 4,
    name: 'Fortune Sunflower Oil',
    category: 'Oil',
    price: 600,
    unit: '5 Liter',
    image: '/images/fortune sunflower oil.jpg',
    inStock: true
  },
  {
    id: 5,
    name: 'Amul Gold Milk',
    category: 'Dairy',
    price: 55,
    unit: '1 Liter',
    image: '/images/Amul-gold.webp',
    inStock: true
  },
  {
    id: 6,
    name: 'Dairy Milk Chocolate',
    category: 'Chocolate',
    price: 99,
    unit: '1 Pack',
    image: '/images/Dairy Milk Chocolate.jfif',
    inStock: true
  },
  {
    id: 7,
    name: 'Parle-G Gold Biscuits',
    category: 'Snacks',
    price: 25,
    unit: '1 Pack',
    image: '/images/Parle-G.jfif',
    inStock: true
  },
  {
    id: 8,
    name: 'Fresh Organic Bananas',
    category: 'Fruits',
    price: 60,
    unit: '1 Dozen',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500',
    inStock: true
  },
  {
    id: 9,
    name: 'Red Delicious Apples',
    category: 'Fruits',
    price: 180,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
    inStock: true
  },
  {
    id: 10,
    name: 'Fresh Farm Tomatoes',
    category: 'Vegetables',
    price: 40,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
    inStock: true
  },
  {
    id: 11,
    name: 'Fresh Organic Potatoes',
    category: 'Vegetables',
    price: 35,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500',
    inStock: true
  },
  {
    id: 12,
    name: 'Yellow Toor Dal / Arhar Dal',
    category: 'Pulses',
    price: 160,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1585994191611-72b3a39396d1?w=500',
    inStock: true
  },
  {
    id: 13,
    name: 'Tata Iodized Salt',
    category: 'Spices',
    price: 28,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518110165401-4467c69992f0?w=500',
    inStock: true
  },
  {
    id: 14,
    name: 'Taj Mahal Premium Tea',
    category: 'Beverages',
    price: 220,
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
    inStock: true
  },
  {
    id: 15,
    name: 'Nescafe Classic Instant Coffee',
    category: 'Beverages',
    price: 195,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500',
    inStock: true
  },
  {
    id: 16,
    name: 'Amul Salted Butter',
    category: 'Dairy',
    price: 58,
    unit: '100g',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500',
    inStock: true
  },
  {
    id: 17,
    name: 'Fresh Whole Wheat Bread',
    category: 'Bakery',
    price: 45,
    unit: '400g Pack',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500',
    inStock: true
  },
  {
    id: 18,
    name: 'Classic Potato Chips',
    category: 'Snacks',
    price: 20,
    unit: '50g Pack',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500',
    inStock: true
  }
];
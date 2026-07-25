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
    name: 'Samrat Atta',
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
  }
];
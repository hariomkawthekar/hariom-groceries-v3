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
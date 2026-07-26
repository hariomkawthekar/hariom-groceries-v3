import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { FiGrid, FiList } from 'react-icons/fi'
import Link from 'next/link'
import { DEFAULT_PRODUCTS } from '@/utils/constants'

export async function getStaticProps() {
  return {
    props: {
      initialProducts: DEFAULT_PRODUCTS,
    },
  }
}

export default function Home({ cartItems, setCartItems, initialProducts = DEFAULT_PRODUCTS }) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [loading, setLoading] = useState(false)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [view, setView] = useState('grid')

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      })
      .catch(err => {
        console.error("Fetch products error, using pre-rendered products:", err);
      });
  }, [])

  // Sync search query from URL params
  useEffect(() => {
    const searchParam = router.query.search
    const queryValue = Array.isArray(searchParam) ? searchParam[0] : searchParam || ''
    setInternalSearchQuery(queryValue)
  }, [router.query.search])

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(p => p.id === product.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + product.quantity }
        return updated
      }
      return [...prev, product]
    })
  }

  const categories = ['All', ...new Set(products.map(p => p.category))]
  
  const searchedProducts = !internalSearchQuery.trim() 
    ? products 
    : products.filter(p => p.name.toLowerCase().includes(internalSearchQuery.trim().toLowerCase()))
  
  const filteredProducts = selectedCategory === 'All' 
    ? searchedProducts 
    : searchedProducts.filter(p => p.category === selectedCategory)
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-[calc(100vh-80px)]">
      {/* Filters & Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/categories" className="flex items-center justify-between group cursor-pointer mb-3">
            <label className="block text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors cursor-pointer">Category</label>
            <span className="text-xs font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">View Page &rarr;</span>
          </Link>
          <div className="space-y-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:shadow-sm'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sorting */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </motion.div>

        {/* View Toggle */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">View</label>
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                view === 'grid' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:shadow-sm'
              }`}
            >
              <FiGrid className="mx-auto h-5 w-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                view === 'list' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:shadow-sm'
              }`}
            >
              <FiList className="mx-auto h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-lg p-4 shadow-sm animate-pulse flex flex-col space-y-3">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className={view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-4'
          }
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!loading && sortedProducts.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No products found</h2>
          <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
          {internalSearchQuery.trim() && (
            <p className="text-sm text-gray-400">Showing results for: "{internalSearchQuery}"</p>
          )}
        </motion.div>
      )}

      {/* Load More */}
      {sortedProducts.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg">
            Load More Products
          </button>
        </motion.div>
      )}
    </div>
  )
}

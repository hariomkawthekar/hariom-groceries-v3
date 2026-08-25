import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ProductCard from '@/components/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGrid, FiList, FiZap, FiCheckCircle, FiShield, FiTag, FiChevronRight, FiFilter, FiRefreshCw, FiArrowDown } from 'react-icons/fi'
import Link from 'next/link'
import { DEFAULT_PRODUCTS, CATEGORIES, FEATURED_CATEGORY_TILES, SORT_OPTIONS } from '@/utils/constants'

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

  // Get unique category names for sidebar filter
  const allCategoryNames = Array.from(new Set(['All', ...CATEGORIES])).filter(Boolean)
  
  const searchedProducts = !internalSearchQuery.trim() 
    ? products 
    : products.filter(p => 
        p.name.toLowerCase().includes(internalSearchQuery.trim().toLowerCase()) ||
        p.category.toLowerCase().includes(internalSearchQuery.trim().toLowerCase())
      )
  
  // Filtering logic:
  // When "All" is selected, all products are displayed.
  // When a specific category (e.g., "Dairy, Bread & Eggs") is clicked, only items in that category are shown!
  const filteredProducts = selectedCategory === 'All' 
    ? searchedProducts 
    : searchedProducts.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
  
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  // Count products for category tile / sidebar
  const getCategoryCount = (catName) => {
    if (catName === 'All') return products.length
    return products.filter(p => p.category.toLowerCase() === catName.toLowerCase()).length
  }

  const handleCategoryTileClick = (categoryName) => {
    setSelectedCategory(categoryName)
    const el = document.getElementById('products-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="bg-slate-50/70 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Modern Hero Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-2xl p-6 sm:p-10"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <FiZap className="text-amber-400 h-4 w-4 animate-pulse" />
                <span>Superfast 15-Minute Delivery</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Fresh Groceries & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
                  Daily Essentials Delivered
                </span>
              </h1>

              <p className="text-emerald-100 text-sm sm:text-base max-w-xl leading-relaxed opacity-90">
                Shop organic greens, dairy, cooking oil, chocolates & daily staples at wholesale prices directly to your doorstep.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
                  <FiTag className="text-amber-400 h-4 w-4" />
                  <span className="text-xs font-bold">Code: <strong className="text-amber-300">HARIOM50</strong> for 20% OFF</span>
                </div>
                <button 
                  onClick={() => handleCategoryTileClick('All')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
                >
                  <span>Explore All Products</span>
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 pt-4 lg:pt-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-center space-y-1">
                <div className="text-2xl mb-1">🥛</div>
                <h4 className="font-bold text-xs text-white">Fresh Dairy & Eggs</h4>
                <p className="text-[11px] text-emerald-200/80">Milk, Paneer, Tofu & Eggs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-center space-y-1">
                <div className="text-2xl mb-1">⚡</div>
                <h4 className="font-bold text-xs text-white">Instant Express Delivery</h4>
                <p className="text-[11px] text-emerald-200/80">Under 15 minutes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-center space-y-1">
                <div className="text-2xl mb-1">💰</div>
                <h4 className="font-bold text-xs text-white">Best Price Guarantee</h4>
                <p className="text-[11px] text-emerald-200/80">Unbeatable discounts</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col justify-center space-y-1">
                <div className="text-2xl mb-1">🛡️</div>
                <h4 className="font-bold text-xs text-white">Strict Quality Check</h4>
                <p className="text-[11px] text-emerald-200/80">Hassle-free replacement</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Blinkit / Instamart Style Interactive Category Tiles Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>Shop By Category</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Tap to view products
                </span>
              </h2>
              <p className="text-xs text-gray-400 mt-1 font-medium">
                Click any category tile below to view related products (e.g. Milk, Paneer, Tofu, Oils, Sauces)
              </p>
            </div>
            {selectedCategory !== 'All' && (
              <button 
                onClick={() => setSelectedCategory('All')}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <FiRefreshCw className="h-3.5 w-3.5" />
                <span>Show All Products ({products.length})</span>
              </button>
            )}
          </div>

          {/* Interactive Category Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {FEATURED_CATEGORY_TILES.map((tile) => {
              const isSelected = selectedCategory.toLowerCase() === tile.categoryKey.toLowerCase()
              const count = getCategoryCount(tile.categoryKey)

              return (
                <motion.div
                  key={tile.id}
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategoryTileClick(tile.categoryKey)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 border flex flex-col justify-between relative overflow-hidden group shadow-xs ${
                    isSelected 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg ring-4 ring-emerald-200' 
                      : `${tile.bgColor} shadow-sm hover:shadow-md`
                  }`}
                >
                  <div className="relative w-full pt-[75%] rounded-xl overflow-hidden mb-3 bg-white/70 backdrop-blur-sm p-2 flex items-center justify-center">
                    <img 
                      src={tile.image} 
                      alt={tile.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    {count > 0 && (
                      <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-black shadow-xs ${
                        isSelected ? 'bg-white text-emerald-800' : 'bg-gray-900/80 text-white'
                      }`}>
                        {count} items
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className={`font-black text-sm leading-tight mb-1 ${
                      isSelected ? 'text-white' : 'text-gray-900 group-hover:text-emerald-700'
                    }`}>
                      {tile.name}
                    </h3>
                    <p className={`text-[11px] leading-snug line-clamp-1 font-medium ${
                      isSelected ? 'text-emerald-100' : 'text-gray-500'
                    }`}>
                      {tile.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
                    <span className={isSelected ? 'text-emerald-200' : 'text-emerald-700'}>
                      {isSelected ? 'Selected ✓' : 'View Items'}
                    </span>
                    <FiChevronRight className={`h-4 w-4 transition-transform ${isSelected ? 'text-white translate-x-1' : 'text-gray-400 group-hover:translate-x-1'}`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Main Content Layout (Category Sidebar + Products Area) */}
        <div id="products-section" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
          
          {/* Category Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 sticky top-20"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiFilter className="text-emerald-600 h-4 w-4" />
                <h3 className="font-bold text-gray-900 text-sm">Category Filter</h3>
              </div>
              {selectedCategory !== 'All' && (
                <button 
                  onClick={() => setSelectedCategory('All')}
                  className="text-[11px] font-bold text-emerald-600 hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 font-medium">
              {selectedCategory === 'All' 
                ? 'Displaying all grocery items.' 
                : `Showing items for "${selectedCategory}".`}
            </p>

            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {allCategoryNames.map((catName) => {
                const isSelected = selectedCategory.toLowerCase() === catName.toLowerCase()
                const count = getCategoryCount(catName)

                return (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-all duration-200 border ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md transform translate-x-1'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <span className="truncate pr-2">{catName}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.aside>

          {/* Products Grid & Filters Bar Area */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Header Toolbar: Sort & View Modes */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <span>{selectedCategory === 'All' ? 'All Grocery Items' : `${selectedCategory}`}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {sortedProducts.length} items available
                  </span>
                </h3>
                {internalSearchQuery.trim() && (
                  <p className="text-xs text-gray-400 mt-0.5">Showing search results for "{internalSearchQuery}"</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                  >
                    {SORT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Grid / List View switch buttons */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setView('grid')}
                    className={`p-2 rounded-lg text-xs font-bold transition-all ${
                      view === 'grid' 
                        ? 'bg-white text-emerald-700 shadow-xs' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="Grid View"
                  >
                    <FiGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-2 rounded-lg text-xs font-bold transition-all ${
                      view === 'list' 
                        ? 'bg-white text-emerald-700 shadow-xs' 
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                    title="List View"
                  >
                    <FiList className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Rendering */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-3 border border-gray-100">
                    <div className="h-40 bg-gray-100 rounded-xl"></div>
                    <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-9 bg-gray-100 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                layout
                className={view === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'space-y-3'
                }
              >
                <AnimatePresence mode="popLayout">
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <ProductCard 
                        product={product} 
                        onAddToCart={handleAddToCart}
                        view={view}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!loading && sortedProducts.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 my-4 space-y-4"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
                  🛒
                </div>
                <h3 className="text-xl font-bold text-gray-800">No products found in this category</h3>
                <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
                  {internalSearchQuery.trim() 
                    ? `No matching grocery products found for "${internalSearchQuery}".`
                    : `No items available right now under "${selectedCategory}". Click "Show All Products" below.`}
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All')
                    setInternalSearchQuery('')
                    if (router.query.search) {
                      router.push('/', undefined, { shallow: true })
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <FiRefreshCw />
                  <span>Show All Products</span>
                </button>
              </motion.div>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}



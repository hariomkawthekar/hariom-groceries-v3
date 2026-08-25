import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiMinus, FiShoppingBag, FiCheck, FiStar } from 'react-icons/fi'

export default function ProductCard({ product, onAddToCart, view = 'grid' }) {
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const discountPercent = product.originalPrice && product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : null

  const handleAdd = () => {
    onAddToCart({ ...product, quantity })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  if (view === 'list') {
    return (
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2 flex items-center justify-center">
            {discountPercent && (
              <span className="absolute top-1 left-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md z-10">
                {discountPercent}% OFF
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-1">
              {product.category}
            </span>
            <h3 className="font-bold text-gray-800 text-base leading-snug">{product.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{product.unit}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-extrabold text-emerald-700">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
              {product.rating && (
                <div className="flex items-center gap-1 ml-2 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                  <FiStar className="fill-amber-400 h-3 w-3" />
                  <span>{product.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <FiMinus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-bold text-sm text-gray-800">{quantity}</span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors"
            >
              <FiPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
              isAdded 
                ? 'bg-emerald-700 text-white' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isAdded ? <FiCheck className="h-4 w-4" /> : <FiShoppingBag className="h-4 w-4" />}
            {isAdded ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
    >
      {discountPercent && (
        <span className="absolute top-3 left-3 bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md z-10">
          {discountPercent}% OFF
        </span>
      )}

      <div className="relative pt-[70%] bg-gradient-to-b from-gray-50/50 to-gray-100/30 overflow-hidden flex items-center justify-center p-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300" 
        />
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                  {product.subcategory}
                </span>
              )}
            </div>
            {product.rating && (
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <FiStar className="fill-amber-400 h-3.5 w-3.5" />
                <span>{product.rating}</span>
                <span className="text-gray-400 font-normal">({product.ratingCount || 125})</span>
              </div>
            )}
          </div>

          {product.brand && (
            <span className="text-[10px] font-black tracking-wider uppercase text-emerald-800 block mb-0.5">
              {product.brand}
            </span>
          )}

          <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-xs text-gray-400 font-medium">{product.unit}</p>
            {product.highlights && (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                ✨ {Array.isArray(product.highlights) ? product.highlights[0] : String(product.highlights).split(',')[0]}
              </span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-extrabold text-emerald-700">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>


          <div className="flex items-center gap-2">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="Decrease quantity"
              >
                <FiMinus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-bold text-xs text-gray-800">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center text-gray-600 hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="Increase quantity"
              >
                <FiPlus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                isAdded 
                  ? 'bg-emerald-800 text-white shadow-md' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <FiCheck className="h-4 w-4" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <FiShoppingBag className="h-4 w-4" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}


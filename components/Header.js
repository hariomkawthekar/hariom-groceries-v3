import Link from 'next/link'
import { FiShoppingCart, FiShoppingBag, FiSearch, FiX, FiUser } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function Header({ cartItemCount = 0, onCartClick, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser } = useAuth()

  const handleSearchChange = (value) => {
    setSearchQuery(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <FiShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-gray-900 flex items-center gap-1">
              Hariom <span className="text-emerald-600">Grocery</span>
            </span>
            <span className="hidden sm:block text-[10px] text-gray-400 font-medium tracking-wide uppercase">Fresh & Express Delivery</span>
          </div>
        </Link>

        {/* Search Input */}
        <div className="flex-1 max-w-lg mx-2 sm:mx-6">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products (e.g. Rice, Milk, Palak, Oil)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-full border border-gray-200 bg-gray-50/70 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-3 sm:gap-5">
          <Link 
            href="/shopkeeper/login" 
            className="hidden md:flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-colors"
          >
            <span>🏪</span>
            <span>Shopkeeper</span>
          </Link>

          <Link 
            href={currentUser ? '/profile' : '/login'} 
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-xl hover:bg-emerald-50 transition-colors"
          >
            <FiUser className="h-4 w-4 text-emerald-600" />
            <span>{currentUser ? (currentUser.displayName || 'Account') : 'Login'}</span>
          </Link>

          <button 
            onClick={onCartClick} 
            className="relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <FiShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-white text-emerald-700 text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}


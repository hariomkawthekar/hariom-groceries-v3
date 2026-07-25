import Link from 'next/link'
import { FiShoppingCart, FiShoppingBag, FiSearch } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function Header({ cartItemCount, onCartClick, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentUser } = useAuth();
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FiShoppingBag className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-primary">Hariom Grocery</span>
        </Link>
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearch(e.target.value);
              }}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 hover:shadow-md"
            />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <Link href={currentUser ? '/profile' : '/login'} className="hidden md:block hover:text-primary">
            Account
          </Link>
          <button onClick={onCartClick} className="flex items-center space-x-2 hover:text-primary">
            <FiShoppingCart />
            <span>Cart ({cartItemCount})</span>
          </button>
        </div>
      </div>
    </header>
  )
}

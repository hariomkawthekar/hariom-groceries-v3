import Link from 'next/link'
import { useRouter } from 'next/router'
import { FiHome, FiGrid, FiStar, FiShoppingBag } from 'react-icons/fi'

export default function BottomNav({ cartItemCount, onCartClick }) {
  const router = useRouter()
  const isActive = (path) => router.pathname === path

  const navItems = [
    { name: 'Home', icon: FiHome, path: '/' },
    { name: 'Categories', icon: FiGrid, path: '/categories' },
    { name: 'Top Picks', icon: FiStar, path: '/top-picks' },
    { name: 'Basket', icon: FiShoppingBag, path: '/basket' },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pt-2 pb-2 px-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          if (item.name === 'Basket') {
            return (
              <button 
                key={item.name} 
                onClick={onCartClick}
                className="flex flex-col items-center justify-center w-16 outline-none"
              >
                <div className="relative mb-1">
                  <Icon className="h-6 w-6 transition-colors duration-200 text-gray-500 hover:text-green-600" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-red-500 border border-white text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center shadow-sm">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] whitespace-nowrap transition-colors duration-200 text-gray-500 font-medium">
                  {item.name}
                </span>
              </button>
            )
          }

          return (
            <Link href={item.path} key={item.name} className="flex flex-col items-center justify-center w-16">
              <div className="relative mb-1">
                <Icon className={`h-6 w-6 transition-colors duration-200 ${active ? 'text-green-600' : 'text-gray-500'}`} />
              </div>
              <span className={`text-[10px] whitespace-nowrap transition-colors duration-200 ${active ? 'text-green-600 font-bold' : 'text-gray-500 font-medium'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
      {/* iOS safe area spacing */}
      <div className="h-safe"></div>
    </div>
  )
}

import '@/styles/globals.css'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartSidebar from '@/components/CartSidebar'
import BottomNav from '@/components/BottomNav'

import { AuthProvider } from '@/contexts/AuthContext'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState([])

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header 
          cartItemCount={cartItems.length} 
          onCartClick={() => setIsCartOpen(true)} 
          onSearch={(query) => router.push({ pathname: '/', query: { ...router.query, search: query || null } })}
        />
        <main className="flex-grow">
          <Component 
            {...pageProps} 
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        </main>
        <Footer />
        <BottomNav 
          cartItemCount={cartItems.length}
          onCartClick={() => setIsCartOpen(true)}
        />
        <CartSidebar 
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      </div>
    </AuthProvider>
  )
}

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function CartSidebar({ isOpen, onClose, cartItems, setCartItems }) {
  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-white z-50 shadow-2xl p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button onClick={onClose} className="text-2xl">✕</button>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => {
                    const currentQty = item.quantity || 1;
                    const subtotal = item.price * currentQty;
                    
                    const updateQuantity = (delta) => {
                      const newQty = Math.max(1, currentQty + delta);
                      setCartItems(prev => 
                        prev.map(i => 
                          i.id === item.id 
                            ? { ...i, quantity: newQty } 
                            : i
                        )
                      );
                    };

                    const removeItem = () => {
                      setCartItems(prev => prev.filter(i => i.id !== item.id));
                    };

                    return (
                      <div key={item.id} className="flex justify-between items-start pb-4 border-b">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-gray-600">₹{item.price}/unit</p>
                          <div className="flex items-center mt-2 gap-3">
                            <button
                              onClick={() => updateQuantity(-1)}
                              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold transition-all"
                            >
                              -
                            </button>
                            <span className="font-semibold min-w-[2rem] text-center">{currentQty}</span>
                            <button
                              onClick={() => updateQuantity(1)}
                              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-bold transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-lg">₹{subtotal}</p>
                          <button
                            onClick={removeItem}
                            className="mt-1 text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                  <Link href="/checkout" className="block w-full bg-primary text-white py-3 rounded-lg hover:bg-opacity-90 font-semibold text-center">
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

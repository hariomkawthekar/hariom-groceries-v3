import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCreditCard, FiHome } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

export default function Checkout({ cartItems, setCartItems }) {
  const router = useRouter()
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    phone: '',
    paymentMethod: 'cash'
  })

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          total,
          items: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      setOrderTotal(total)
      // Clear cart
      setCartItems([])
      setOrderPlaced(true)
    } catch (error) {
      console.error(error);
      alert('Error placing order. Please try again.');
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
            <div className="text-4xl">✅</div>
          </div>
          <h1 className="text-4xl font-bold text-green-700 mb-4">Order Placed!</h1>
          <p className="text-xl text-gray-600 mb-8">Thank you for your purchase</p>
          <p className="text-3xl font-bold text-primary mb-8">₹{orderTotal}</p>
          <Link href="/" className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all shadow-lg">
            <FiHome className="h-5 w-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-primary mb-8 font-medium"
        >
          <FiArrowLeft className="h-5 w-5" />
          <span>Back to Cart</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => {
                const subtotal = item.price * (item.quantity || 1)
                return (
                  <div key={item.id} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">₹{item.price} x {item.quantity || 1}</p>
                    </div>
                    <p className="font-bold">₹{subtotal}</p>
                  </div>
                )
              })}
            </div>
            <div className="border-t pt-6">
              <div className="flex justify-between text-xl font-bold mb-4">
                <span>Total:</span>
                <span className="text-primary">₹{total}</span>
              </div>
            </div>
          </motion.div>

          {/* Payment & Delivery */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="House number, street, city, pincode"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">Payment Method</label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-primary focus:ring-primary"
                    />
                    <span>COD - Cash on Delivery</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      className="mr-3 w-5 h-5 text-primary focus:ring-primary"
                    />
                    <FiCreditCard className="mr-2 h-5 w-5" />
                    <span>Card/UPI</span>
                  </label>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || cartItems.length === 0}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Place Order - ₹${total}`}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}


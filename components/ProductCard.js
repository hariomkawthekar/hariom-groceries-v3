import { useState } from 'react'

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <img src={product.image} alt={product.name} className="w-full h-32 object-contain rounded mb-4" />
      <h3 className="font-semibold mb-2">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.category}</p>
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-bold text-primary">₹{product.price}</span>
        <span className="text-xs text-gray-500">{product.unit}</span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 bg-gray-100 rounded">-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
        </div>
      </div>
      <button
        onClick={() => onAddToCart({ ...product, quantity })}
        className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90"
      >
        Add to Cart
      </button>
    </div>
  )
}

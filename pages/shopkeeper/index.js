import { useState, useEffect } from 'react'
import Head from 'next/head'
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CATEGORIES } from '@/utils/constants'

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies.shopkeeper_token;

  if (!token) {
    return {
      redirect: {
        destination: '/shopkeeper/login',
        permanent: false,
      }
    }
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-shopkeeper-key-1234';
    const decoded = jwt.verify(token, JWT_SECRET);
    
    return {
      props: { shopkeeper: decoded }
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/shopkeeper/login',
        permanent: false,
      }
    }
  }
}

const PRESET_PRODUCT_IMAGES = [
  { label: '🥛 Amul Milk', url: '/images/Amul-gold.webp' },
  { label: '🧈 Malai Paneer', url: 'https://images.unsplash.com/photo-1527156231393-7023794f363c?w=500' },
  { label: '🛢️ Fortune Oil', url: '/images/fortune sunflower oil.jpg' },
  { label: '🌾 Basmati Rice', url: '/images/india Gate Basmati Rice.jfif' },
  { label: '🥖 Wheat Atta', url: '/images/Samrat Atta.jfif' },
  { label: '🍫 Silk Chocolate', url: '/images/Dairy Milk Chocolate.jfif' },
  { label: '🍟 Parle-G', url: '/images/Parle-G.jfif' },
  { label: '🍅 Kissan Ketchup', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500' },
  { label: '☕ Nescafe Coffee', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500' },
  { label: '🧴 Shampoo', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500' }
]

export default function ShopkeeperDashboard({ shopkeeper }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('add-product');
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy, Bread & Eggs',
    price: '',
    originalPrice: '',
    unit: '1 Pack',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    rating: '4.8',
    ratingCount: '120',
    inStock: true
  });

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProductsList(data);
      }
    } catch (e) {
      console.error("Failed to load products:", e);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/shopkeeper/logout', { method: 'POST' });
    router.push('/shopkeeper/login');
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name || !formData.category || !formData.price) {
      setErrorMessage('Please fill in Product Name, Category, and Real Price.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save product');
      }

      setSuccessMessage(`🎉 "${data.product.name}" added successfully! It is now live on the home page under ${data.product.category}.`);
      
      // Reset form fields
      setFormData({
        name: '',
        category: formData.category,
        price: '',
        originalPrice: '',
        unit: '1 Pack',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        rating: '4.8',
        ratingCount: '120',
        inStock: true
      });

      // Reload products list
      loadProducts();
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while saving the product.');
    } finally {
      setSubmitting(false);
    }
  };

  const availableCategories = CATEGORIES.filter(c => c !== 'All');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Head>
        <title>Shopkeeper Portal - Add & Manage Products</title>
      </Head>
      
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              🏪
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">
                Hariom Shopkeeper Portal
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Shopkeeper ID: <strong className="text-emerald-700 font-bold">{shopkeeper.shopkeeperId}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <span>🌐 View Live Website</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow hover:bg-rose-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
              activeTab === 'add-product'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>➕ Add New Product</span>
          </button>
          <button
            onClick={() => setActiveTab('manage-products')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
              activeTab === 'manage-products'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>📦 Inventory Catalog ({productsList.length})</span>
          </button>
        </div>

        {/* Tab 1: Add New Product Form */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>Add Product to Store</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Instant Live on Homepage
                </span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Fill in the product details below. Once saved, it will immediately appear in your shop catalog and home page categories.
              </p>
            </div>

            {/* Success Message Banner */}
            {successMessage && (
              <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-900 text-sm font-semibold space-y-2">
                <p className="flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <span>{successMessage}</span>
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Link 
                    href="/"
                    target="_blank"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition inline-flex items-center gap-1.5"
                  >
                    <span>👁️ See New Product On Home Page</span>
                  </Link>
                  <button
                    onClick={() => setSuccessMessage('')}
                    className="text-xs text-emerald-700 underline font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-rose-800 text-xs font-bold">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={handleAddProductSubmit} className="space-y-6">
              
              {/* Section 1: Product Image */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <label className="block text-xs font-black uppercase text-gray-700 tracking-wider">
                  1. Product Image (URL or Select Sample) *
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <input
                      type="url"
                      required
                      placeholder="Paste Image URL (e.g. https://... or /images/Amul-gold.webp)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    />

                    {/* Quick Preset Selector */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500">Quick Select Image Sample:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pt-1">
                        {PRESET_PRODUCT_IMAGES.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: img.url })}
                            className="text-[11px] font-bold bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 px-2.5 py-1 rounded-lg transition"
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Preview Box */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-1">Live Image Preview</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Product Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 tracking-wider mb-2">
                    2. Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amul Gold Full Cream Milk 1L"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 tracking-wider mb-2">
                    3. Product Category *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-gray-900 cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 3: Prices & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <div>
                  <label className="block text-xs font-black uppercase text-emerald-900 tracking-wider mb-1">
                    Real Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 55"
                    className="w-full px-4 py-2.5 border border-emerald-300 rounded-xl text-sm font-black focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 tracking-wider mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 65 (Optional)"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 tracking-wider mb-1">
                    Unit / Size *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1 Liter / 500g / Pack"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>

              {/* Section 4: Rating Numbers & Ratings Count */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 tracking-wider mb-2">
                    Rating Stars (Score 1.0 - 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="e.g. 4.8"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-700 tracking-wider mb-2">
                    Total Reviews / Ratings Count
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 120"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                    value={formData.ratingCount}
                    onChange={(e) => setFormData({ ...formData, ratingCount: e.target.value })}
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl w-full">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    />
                    <span className="text-xs font-bold text-gray-800">In Stock & Ready for Delivery</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3.5 rounded-2xl shadow-lg transition text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{submitting ? 'Saving Product...' : '💾 Save & Publish Product To Website'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Tab 2: Inventory Catalog */}
        {activeTab === 'manage-products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  Store Products Catalog
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  View all active items published in Hariom Grocery
                </p>
              </div>
              <button
                onClick={loadProducts}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl hover:bg-emerald-100 transition"
              >
                🔄 Refresh Catalog
              </button>
            </div>

            {loadingProducts ? (
              <div className="text-center py-10 font-bold text-gray-500">Loading catalog...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productsList.map((prod) => (
                  <div key={prod.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 relative">
                    <div className="w-full h-32 relative bg-white rounded-xl overflow-hidden p-2 flex items-center justify-center border border-gray-100">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-contain" />
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {prod.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-xs text-gray-900 line-clamp-1">{prod.name}</h3>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-emerald-700">₹{prod.price}</span>
                      <span className="text-[11px] text-gray-500 line-through">₹{prod.originalPrice}</span>
                      <span className="text-[10px] font-bold text-amber-600">★ {prod.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}


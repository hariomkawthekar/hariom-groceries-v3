import { useState, useEffect, useRef } from 'react'
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

const INITIAL_FORM_STATE = {
  name: '',
  brand: '',
  description: '',
  category: 'Dairy, Bread & Eggs',
  subcategory: 'Milk',
  price: '',
  originalPrice: '',
  gst: '0',
  stockQuantity: '50',
  unit: 'packet',
  minQuantity: '1',
  maxQuantity: '10',
  image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500',
  galleryImages: [],
  rating: '4.5',
  ratingCount: '125',
  highlights: 'Fresh, 100% Pure, Quality Checked',
  isDeliveryAvailable: true,
  active: true,
  featured: false,
  tags: '',
  inStock: true
}

export default function ShopkeeperDashboard({ shopkeeper }) {

  const router = useRouter();
  const fileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);
  const categoryFileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('add-product');
  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  // Add Product Form State
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Category Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [categoryModalError, setCategoryModalError] = useState('');
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    subtitle: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
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

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategoriesList(data);
      }
    } catch (e) {
      console.error("Failed to load categories:", e);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/shopkeeper/logout', { method: 'POST' });
    router.push('/shopkeeper/login');
  };

  // Real-time discount calculation
  const calculatedDiscount = formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price)
    ? Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)
    : 0;

  // Handle Main File Upload
  const handleMainFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Category Image File Upload
  const handleCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCategoryForm(prev => ({ ...prev, image: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Gallery File Upload
  const handleGalleryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, event.target.result]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryUrl = () => {
    if (newGalleryUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        galleryImages: [...prev.galleryImages, newGalleryUrl.trim()]
      }));
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSaveProduct = async (e, addAnother = false) => {
    if (e) e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!formData.name || !formData.category || !formData.price) {
      setErrorMessage('Please fill in Product Name, Category, and Selling Price.');
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

      setSuccessMessage(`🎉 "${data.product.name}" saved successfully! Live on Home Page & Category: ${data.product.category}.`);

      if (addAnother) {
        setFormData(INITIAL_FORM_STATE);
      }

      loadProducts();
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong while saving the product.');
    } finally {
      setSubmitting(false);
    }
  };

  // CATEGORY MODAL HANDLERS
  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryModalError('');
    setCategoryForm({
      name: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryModalError('');
    setCategoryForm({
      name: cat.name || '',
      subtitle: cat.subtitle || '',
      image: cat.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    setSubmitting(true);
    setCategoryModalError('');
    setErrorMessage('');
    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const payload = editingCategory
        ? { ...categoryForm, id: editingCategory.id, shopkeeperId: shopkeeper.shopkeeperId }
        : { ...categoryForm, shopkeeperId: shopkeeper.shopkeeperId };

      const res = await fetch('/api/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save category');

      setSuccessMessage(`🎉 Category "${categoryForm.name}" ${editingCategory ? 'updated' : 'created'} successfully! Live in Shop by Category.`);
      setIsCategoryModalOpen(false);
      await loadCategories();
    } catch (err) {
      setCategoryModalError(err.message || 'Failed to save category');
      setErrorMessage(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deletingCategory.id })
      });

      if (res.ok) {
        setSuccessMessage(`🗑️ Category "${deletingCategory.name}" removed successfully.`);
        setDeletingCategory(null);
        loadCategories();
      }
    } catch (e) {
      console.error("Delete category error:", e);
    } finally {
      setSubmitting(false);
    }
  };

  const availableCategories = CATEGORIES.filter(c => c !== 'All');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Head>
        <title>Shopkeeper Portal - Product & Category Management</title>
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
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'add-product'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span>➕ Add New Product</span>
          </button>
          <button
            onClick={() => setActiveTab('manage-categories')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'manage-categories'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span>🏷️ Shop by Category ({categoriesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('manage-products')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${activeTab === 'manage-products'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <span>📦 Store Inventory ({productsList.length})</span>
          </button>
        </div>

        {/* Tab 1: Add New Product Form */}
        {activeTab === 'add-product' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-8">
            <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Product Management Studio</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Live Website Sync
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Add product details, prices, stock, ratings, and gallery images to instantly publish on the store.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(INITIAL_FORM_STATE)}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl transition"
              >
                Reset Form
              </button>
            </div>

            {/* Success Banner */}
            {successMessage && (
              <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-2xl text-emerald-900 text-sm font-semibold space-y-2">
                <p className="flex items-center gap-2 font-bold">
                  <span className="text-xl">✅</span>
                  <span>{successMessage}</span>
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href="/"
                    target="_blank"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition inline-flex items-center gap-1.5"
                  >
                    <span>👁️ View Live On Home Page & Category</span>
                  </Link>
                  <button
                    type="button"
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

            <form onSubmit={(e) => handleSaveProduct(e, false)} className="space-y-8">

              {/* SECTION 1: BASIC PRODUCT INFORMATION */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider flex items-center gap-2 border-b pb-2">
                  <span>🛒 1. Basic Product Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Amul Taaza Toned Milk"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amul, Fortune, Everest"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Category *</label>
                    <select
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900 cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Sub-Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Milk → Toned Milk / Full Cream Milk"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Short Description (1-2 lines)</label>
                    <input
                      type="text"
                      placeholder="e.g. Pasteurised toned milk with 3.0% fat & 8.5% SNF."
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: MULTIPLE IMAGES GALLERY & CAMERA/FILE UPLOAD */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider flex items-center justify-between border-b pb-2">
                  <span>🖼️ 2. Product Images (Main & Gallery)</span>
                  <span className="text-[11px] font-bold text-gray-500">Multiple image support</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">

                  {/* Main Product Image Control */}
                  <div className="md:col-span-6 space-y-3">
                    <label className="block text-xs font-bold text-gray-700">Main Cover Image *</label>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Image URL (e.g. https://... or /images/...)"
                        className="flex-1 px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-xs"
                      >
                        📷 Upload/Camera
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleMainFileUpload}
                      />
                    </div>

                    {/* Preset Image Picker */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-gray-500">Preset Sample Images:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                        {PRESET_PRODUCT_IMAGES.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: img.url })}
                            className="text-[10px] font-bold bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 border border-gray-200 px-2 py-0.5 rounded-lg transition"
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Image Live Preview Box */}
                  <div className="md:col-span-6 flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-200">
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center bg-gray-50 flex-shrink-0">
                      <img
                        src={formData.image}
                        alt="Main Preview"
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' }}
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">Main Image Preview</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">This will be displayed as primary card image on home & search.</p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500' })}
                        className="text-[10px] font-bold text-rose-600 hover:underline mt-1"
                      >
                        Reset Main Image
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Gallery Images */}
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <label className="block text-xs font-bold text-gray-700">Additional Product Gallery Images (Optional)</label>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      placeholder="Paste additional image URL"
                      className="px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white w-64"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
                    >
                      + Add Gallery Image
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryFileInputRef.current?.click()}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold"
                    >
                      📷 Upload Gallery File
                    </button>
                    <input
                      ref={galleryFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleGalleryFileUpload}
                    />
                  </div>

                  {/* Gallery Thumbnails List */}
                  {formData.galleryImages.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {formData.galleryImages.map((url, index) => (
                        <div key={index} className="relative w-20 h-20 bg-white rounded-xl border border-gray-200 overflow-hidden group p-1">
                          <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(index)}
                            className="absolute top-1 right-1 bg-rose-600 text-white rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center shadow-md hover:bg-rose-700"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 3: PRICING & DISCOUNTS */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider flex items-center justify-between border-b pb-2">
                  <span>💰 3. Pricing & Discounts</span>
                  {calculatedDiscount > 0 && (
                    <span className="text-xs font-black text-white bg-rose-500 px-3 py-1 rounded-full shadow-xs">
                      🔥 Auto Calculated: {calculatedDiscount}% OFF
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">MRP / Original Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 32"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-emerald-900 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 30"
                      className="w-full px-3.5 py-2.5 border border-emerald-400 rounded-xl text-sm font-black focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Auto Discount (%)</label>
                    <input
                      type="text"
                      readOnly
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-black bg-gray-100 text-emerald-800 cursor-not-allowed"
                      value={calculatedDiscount > 0 ? `${calculatedDiscount}% OFF` : '0%'}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Tax / GST (%)</label>
                    <select
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white text-gray-900"
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    >
                      <option value="0">0% (GST Exempted)</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 4: INVENTORY / STOCK & LIMITS */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider border-b pb-2">
                  📦 4. Inventory & Stock Controls
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Unit Type *</label>
                    <select
                      required
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white cursor-pointer"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    >
                      <option value="packet">packet / pouch</option>
                      <option value="1 kg">1 kg</option>
                      <option value="500g">500g</option>
                      <option value="200g">200g</option>
                      <option value="1 Liter">1 Liter</option>
                      <option value="500ml">500ml</option>
                      <option value="piece">piece / item</option>
                      <option value="box">box / pack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Min Order Qty</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.minQuantity}
                      onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Max Order Qty</label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.maxQuantity}
                      onChange={(e) => setFormData({ ...formData, maxQuantity: e.target.value })}
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl w-full">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                        checked={formData.inStock}
                        onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      />
                      <span className="text-xs font-bold text-gray-800">In Stock</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 5: RATINGS & HIGHLIGHTS */}
              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider border-b pb-2">
                  ⭐ 5. Ratings & Highlights
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Rating Score (1.0 - 5.0)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      placeholder="e.g. 4.5"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Rating Count (Reviews)</label>
                    <input
                      type="number"
                      placeholder="e.g. 125"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.ratingCount}
                      onChange={(e) => setFormData({ ...formData, ratingCount: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Product Highlights (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Fresh, Organic, Low Fat"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: DELIVERY & VISIBILITY SCOPE */}
              <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-black uppercase text-emerald-800 tracking-wider border-b pb-2">
                  🚚 6. Delivery & Visibility Settings
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 p-3.5 rounded-xl">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={formData.isDeliveryAvailable}
                      onChange={(e) => setFormData({ ...formData, isDeliveryAvailable: e.target.checked })}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Available For Express Delivery</h4>
                      <p className="text-[10px] text-gray-400">15-min delivery eligible</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 p-3.5 rounded-xl">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Product Active / Visible</h4>
                      <p className="text-[10px] text-gray-400">Shopkeeper can toggle on/off</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer bg-white border border-gray-200 p-3.5 rounded-xl">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">Featured Product</h4>
                      <p className="text-[10px] text-gray-400">Promote on homepage top hero</p>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Search Keywords / Tags</label>
                  <input
                    type="text"
                    placeholder="e.g. Milk, dairy, fresh milk, amul, toned milk"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION 7: BOTTOM ACTION BUTTONS */}
              <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border z-20">
                <div className="text-xs font-bold text-gray-600">
                  Total Selling Price: <strong className="text-emerald-700 text-sm">₹{formData.price || '0'}</strong>
                  {formData.originalPrice && <span className="text-gray-400 line-through ml-2">₹{formData.originalPrice}</span>}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(INITIAL_FORM_STATE)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-5 py-3 rounded-xl text-xs transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={(e) => handleSaveProduct(e, true)}
                    className="bg-teal-700 hover:bg-teal-800 text-white font-black px-6 py-3 rounded-xl text-xs transition shadow-md disabled:opacity-50"
                  >
                    Save & Add Another
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-3 rounded-xl text-xs transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    <span>{submitting ? 'Saving...' : '💾 Save Product'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

        {/* Tab 2: SHOP BY CATEGORY MANAGEMENT */}
        {activeTab === 'manage-categories' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-200 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Shop by Category Studio</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Live Customer Grid
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Create, update, and manage product categories displayed on the customer website.
                </p>
              </div>

              <button
                onClick={handleOpenAddCategoryModal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-2"
              >
                <span>➕ Add New Category</span>
              </button>
            </div>

            {loadingCategories ? (
              <div className="text-center py-12 font-bold text-gray-500">Loading category grid...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {categoriesList.map((cat) => {
                  const prodCount = productsList.filter(p => p.category.toLowerCase() === (cat.categoryKey || cat.name).toLowerCase()).length;

                  return (
                    <div key={cat.id} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex flex-col justify-between space-y-3 group hover:shadow-md transition">
                      <div>
                        <div className="w-full h-36 relative bg-white rounded-xl overflow-hidden mb-3 border border-gray-200 p-2 flex items-center justify-center">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' }}
                          />
                          <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                            {prodCount} items
                          </span>
                        </div>

                        <h3 className="font-black text-sm text-gray-900 leading-tight mb-0.5">{cat.name}</h3>
                        <p className="text-[11px] text-gray-500 font-medium line-clamp-1">{cat.subtitle || 'Shop category items'}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleOpenEditCategoryModal(cat)}
                          className="flex-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-gray-200 hover:border-emerald-300 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeletingCategory(cat)}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Store Inventory Catalog */}
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
                      <span className="text-[10px] font-bold text-amber-600">★ {prod.rating} ({prod.ratingCount || 125})</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* CATEGORY FORM MODAL (ADD & EDIT) */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-black text-gray-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : '➕ Add New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4">
              {categoryModalError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{categoryModalError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dairy, Bread & Eggs"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Subtitle / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Milk, Paneer, Tofu & Eggs"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                  value={categoryForm.subtitle}
                  onChange={(e) => setCategoryForm({ ...categoryForm, subtitle: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Image *</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    required
                    placeholder="Image URL (e.g. https://...)"
                    className="flex-1 px-3.5 py-2 border border-gray-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 bg-white"
                    value={categoryForm.image}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => categoryFileInputRef.current?.click()}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
                  >
                    📷 Upload File
                  </button>
                  <input
                    ref={categoryFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCategoryImageUpload}
                  />
                </div>

                {/* Live Image Preview */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="w-20 h-20 relative rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                    <img
                      src={categoryForm.image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400' }}
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Live Preview</span>
                    <span className="text-[10px] text-gray-400">Shows on customer homepage category tiles</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2 rounded-xl text-xs transition shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-rose-100">
              ⚠️
            </div>

            <h3 className="text-lg font-black text-gray-900">Are you sure you want to delete this category?</h3>

            <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex items-center gap-3 text-left">
              <img src={deletingCategory.image} alt={deletingCategory.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-xs text-gray-900">{deletingCategory.name}</h4>
                <p className="text-[11px] text-gray-500">{deletingCategory.subtitle}</p>
              </div>
            </div>

            <p className="text-xs text-gray-500 font-medium">
              This will remove the category tile from customer homepage. Product listings will remain intact.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmDeleteCategory}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2.5 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}




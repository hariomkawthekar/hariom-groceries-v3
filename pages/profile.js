import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { FiEdit3, FiCheck, FiX, FiMapPin, FiTruck, FiUser, FiLogOut, FiPhone } from 'react-icons/fi';
import Link from 'next/link';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [addressData, setAddressData] = useState({
    name: '',
    street: '',
    city: '',
    pincode: ''
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    // Load user data from localStorage
    const savedUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
    setUserData({
      name: savedUser.name || currentUser.name || currentUser.email.split('@')[0],
      email: currentUser.email,
      phone: localStorage.getItem('userPhone') || ''
    });

    // Mock saved addresses
    setSavedAddresses([
      {
        id: 1,
        name: 'Home',
        street: '123 Main St',
        city: 'Mumbai',
        pincode: '400001'
      },
      {
        id: 2,
        name: 'Office',
        street: '456 Business Ave',
        city: 'Pune',
        pincode: '411001'
      }
    ]);

    // Fetch recent orders
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?email=${currentUser.email}`);
        if (response.ok) {
          const data = await response.json();
          const formattedOrders = data.map(order => ({
            id: `#${order.id}`,
            date: new Date(order.createdAt).toISOString().split('T')[0],
            total: `₹${order.total}`,
            status: order.status
          }));
          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    
    fetchOrders();
  }, [currentUser, router]);

  const handleProfileSave = () => {
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userPhone', userData.phone);
    setEditingProfile(false);
  };

  const handleAddressSave = () => {
    const newAddress = {
      id: Date.now(),
      ...addressData
    };
    setSavedAddresses([newAddress, ...savedAddresses]);
    setAddressData({ name: '', street: '', city: '', pincode: '' });
    setEditingAddress(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4">
            My Account
          </h1>
          <p className="text-xl text-gray-600">Manage your profile, orders & addresses</p>
        </div>

        {/* Profile Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FiUser className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{userData.name}</h2>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <FiPhone className="w-5 h-5 text-gray-500" />
                  <span>{userData.phone || 'Add phone number'}</span>
                </div>
              </div>
              <button
                onClick={() => setEditingProfile(!editingProfile)}
                className="w-full mt-6 bg-gradient-to-r from-primary to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {editingProfile ? <FiCheck className="w-5 h-5" /> : <FiEdit3 className="w-5 h-5" />}
                <span>{editingProfile ? 'Save Profile' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Edit Profile Form */}
          {editingProfile && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Edit Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Full Name"
                  />
                  <input
                    type="tel"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              <FiTruck className="w-7 h-7 text-primary" />
              <span>Recent Orders</span>
            </h2>
            <Link href="/orders" className="text-primary font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 font-semibold text-gray-900">Order ID</th>
                  <th className="text-left py-4 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 font-semibold text-gray-900 hidden md:table-cell">Total</th>
                  <th className="text-left py-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 font-medium">{order.id}</td>
                    <td className="py-4">{order.date}</td>
                    <td className="py-4 hidden md:table-cell">{order.total}</td>
                    <td>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-3">
                <FiMapPin className="w-6 h-6 text-primary" />
                <span>Saved Addresses</span>
              </h3>
              <button
                onClick={() => setEditingAddress(!editingAddress)}
                className="bg-primary text-white px-4 py-2 rounded-xl hover:bg-blue-600 font-semibold"
              >
                {editingAddress ? 'Cancel' : '+ Add New'}
              </button>
            </div>
            {savedAddresses.map((address) => (
              <div key={address.id} className="border border-gray-200 rounded-xl p-6 mb-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-900">{address.name}</h4>
                <p className="text-gray-600 mt-1">{address.street}</p>
                <p className="text-gray-600">{address.city} - {address.pincode}</p>
              </div>
            ))}
          </div>

          {/* Add Address Form */}
          {editingAddress && (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Add New Address</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={addressData.name}
                  onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Address Name (e.g., Home)"
                />
                <input
                  type="text"
                  value={addressData.street}
                  onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Street Address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={addressData.city}
                    onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                    className="p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={addressData.pincode}
                    onChange={(e) => setAddressData({ ...addressData, pincode: e.target.value })}
                    className="p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Pincode"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddressSave}
                    className="flex-1 bg-gradient-to-r from-primary to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg"
                  >
                    Save Address
                  </button>
                  <button
                    onClick={() => setEditingAddress(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-8 rounded-2xl font-semibold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

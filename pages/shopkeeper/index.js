import Head from 'next/head'
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router'

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

export default function ShopkeeperDashboard({ shopkeeper }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/shopkeeper/logout', { method: 'POST' });
    router.push('/shopkeeper/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Head>
        <title>Shopkeeper Dashboard - Hariom Grocery</title>
      </Head>
      
      <header className="bg-white shadow border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900 tracking-tight">
            <span className="text-green-600">Hariom</span> Shopkeeper Portal
          </h1>
          <button 
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2.5 rounded-lg shadow font-medium hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-lg rounded-2xl p-8 border border-gray-100">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome back, <span className="text-blue-600">{shopkeeper.shopkeeperId}</span>! 👋
            </h2>
            <p className="text-gray-500 mb-10 text-lg">This is your secure portal. Only verified shopkeepers can access this area.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50 p-8 rounded-xl border border-blue-200 transition-transform transform hover:-translate-y-1">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="font-bold text-blue-900 text-2xl mb-2">My Products</h3>
                <p className="text-md text-blue-700 mb-6">Manage your inventory, prices, and stock levels easily.</p>
                <button className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow font-semibold hover:bg-blue-700 w-full transition">Manage Products</button>
              </div>
              <div className="bg-green-50 p-8 rounded-xl border border-green-200 transition-transform transform hover:-translate-y-1">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="font-bold text-green-900 text-2xl mb-2">Recent Orders</h3>
                <p className="text-md text-green-700 mb-6">View and fulfill incoming customer grocery orders.</p>
                <button className="bg-green-600 text-white px-4 py-3 rounded-lg shadow font-semibold hover:bg-green-700 w-full transition">View Orders</button>
              </div>
              <div className="bg-purple-50 p-8 rounded-xl border border-purple-200 transition-transform transform hover:-translate-y-1">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="font-bold text-purple-900 text-2xl mb-2">Store Settings</h3>
                <p className="text-md text-purple-700 mb-6">Update your store information, timings, and policies.</p>
                <button className="bg-purple-600 text-white px-4 py-3 rounded-lg shadow font-semibold hover:bg-purple-700 w-full transition">Settings</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

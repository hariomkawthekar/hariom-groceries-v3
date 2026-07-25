import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-4">Hariom Grocery</h3>
          <p className="text-gray-400">Fresh groceries delivered to your door</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <p className="text-gray-400">+91 9657346501</p>
          <p className="text-gray-400">+91 9923440147</p>
          <p className="text-gray-400">vinayakkawthekar@gmail..com</p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Newsletter</h4>
          <input type="email" placeholder="Your email" className="w-full px-3 py-2 rounded text-gray-900 mb-2" />
          <button className="w-full bg-secondary text-white py-2 rounded hover:bg-opacity-90">Subscribe</button>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-8 pt-8 max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
        <p>© 2026 Hariom Grocery. All rights reserved.</p>
      </div>
    </footer>
  )
}

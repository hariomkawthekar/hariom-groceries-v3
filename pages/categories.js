import Head from 'next/head'
import { motion } from 'framer-motion'
import { FiChevronUp } from 'react-icons/fi'

const categoryGroups = [
  {
    title: 'Cooking Essentials',
    items: [
      { name: 'Dal & Pulses', image: 'https://loremflickr.com/150/150/beans,lentils', color: 'bg-green-50' },
      { name: 'Atta & Flours', image: '/images/Samrat Atta.jfif', color: 'bg-yellow-50' },
      { name: 'Rice & Rice Products', image: '/images/india Gate Basmati Rice.jfif', color: 'bg-blue-50' },
      { name: 'Ghee & Oils', image: '/images/fortune sunflower oil.jpg', color: 'bg-orange-50' },
      { name: 'Dry Fruits', image: 'https://loremflickr.com/150/150/almonds,nuts', color: 'bg-purple-50' },
      { name: 'Sugar & Salt', image: 'https://loremflickr.com/150/150/salt,sugar', color: 'bg-pink-50' },
      { name: 'Masala & Spices', image: 'https://loremflickr.com/150/150/spices', color: 'bg-red-50' },
    ]
  },
  {
    title: 'Snacks & Beverages',
    items: [
      { name: 'Biscuits & Cookies', image: 'https://loremflickr.com/150/150/cookies,biscuits', color: 'bg-amber-50' },
      { name: 'Chips & Namkeen', image: 'https://loremflickr.com/150/150/chips,snacks', color: 'bg-orange-50' },
      { name: 'Tea', image: 'https://loremflickr.com/150/150/tea,cup', color: 'bg-green-50' },
      { name: 'Coffee', image: 'https://loremflickr.com/150/150/coffee,beans', color: 'bg-yellow-50' },
      { name: 'Juices & Fruit Drinks', image: 'https://loremflickr.com/150/150/juice,orange', color: 'bg-rose-50' },
      { name: 'Soft Drinks', image: 'https://loremflickr.com/150/150/soda,coke', color: 'bg-blue-50' },
      { name: 'Instant Drink Mixes', image: 'https://loremflickr.com/150/150/beverage,mix', color: 'bg-fuchsia-50' },
      { name: 'Health Drinks', image: '/images/Amul-gold.webp', color: 'bg-cyan-50' },
    ]
  },
  {
    title: 'Packaged Food',
    items: [
      { name: 'Breakfast Cereals', image: 'https://loremflickr.com/150/150/cereal,breakfast', color: 'bg-orange-100' },
      { name: 'Noodles & Pasta', image: 'https://loremflickr.com/150/150/noodles,pasta', color: 'bg-yellow-100' },
      { name: 'Ketchup & Spreads', image: 'https://loremflickr.com/150/150/ketchup,sauce', color: 'bg-red-100' },
      { name: 'Ready to Eat', image: 'https://loremflickr.com/150/150/curry,food', color: 'bg-emerald-100' },
    ]
  }
]

export default function Categories() {
  return (
    <div className="bg-white min-h-screen pb-32">
      <Head>
        <title>Categories - Hariom Grocery</title>
      </Head>

      <div className="max-w-md mx-auto px-4 py-4 pt-6">
        {categoryGroups.map((group, groupIdx) => (
          <div key={group.title} className="mb-8">
            <h2 className="text-[19px] font-bold text-[#1a1a1a] tracking-tight mb-5">{group.title}</h2>
            <div className="grid grid-cols-4 gap-x-2 gap-y-7">
              {group.items.map((item, itemIdx) => (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (groupIdx * 0.1) + (itemIdx * 0.05) }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div className={`w-[74px] h-[74px] rounded-[18px] mb-2.5 flex items-center justify-center border shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-transform transform group-hover:scale-105 overflow-hidden p-2 ${item.color}`}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded-[10px]" />
                  </div>
                  <span className="text-[11px] font-bold text-[#222222] text-center leading-[1.2]">
                    {item.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Buy More Banner */}
      <div className="fixed bottom-[58px] left-0 w-full bg-[#fdfaf2] border-t border-[#f3e8c9] px-4 py-2 flex justify-between items-center z-40 md:hidden cursor-pointer shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <span className="text-xs font-bold text-[#202020]">Buy More to Save More</span>
        <FiChevronUp className="h-5 w-5 text-gray-500" />
      </div>
    </div>
  )
}

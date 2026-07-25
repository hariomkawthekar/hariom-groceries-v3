import prisma from '../../lib/prisma';

const sampleProducts = [
  {
    id: 1,
    name: 'Premium Basmati Rice',
    category: 'Grains',
    price: 80,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
    inStock: true
  },
  {
    id: 2,
    name: 'India Gate Basmati Rice',
    category: 'Grains',
    price: 120,
    unit: '1 kg',
    image: '/images/india Gate Basmati Rice.jfif',
    inStock: true
  },
  {
    id: 3,
    name: 'Samrat Atta',
    category: 'Grains',
    price: 310,
    unit: '5 kg',
    image: '/images/Samrat Atta.jfif',
    inStock: true
  },
  {
    id: 4,
    name: 'Fortune Sunflower Oil',
    category: 'Oil',
    price: 600,
    unit: '5 Liter',
    image: '/images/fortune sunflower oil.jpg',
    inStock: true
  },
  {
    id: 5,
    name: 'Amul Gold Milk',
    category: 'Dairy',
    price: 55,
    unit: '1 Liter',
    image: '/images/Amul-gold.webp',
    inStock: true
  },
  {
    id: 6,
    name: 'Dairy Milk Chocolate',
    category: 'Chocolate',
    price: 99,
    unit: '1 Pack',
    image: '/images/Dairy Milk Chocolate.jfif',
    inStock: true
  },
  {
    id: 7,
    name: 'Parle-G Gold Biscuits',
    category: 'Snacks',
    price: 25,
    unit: '1 Pack',
    image: '/images/Parle-G.jfif',
    inStock: true
  }
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Try to fetch products from the database using Prisma if instantiated
      if (prisma) {
        const products = await prisma.product.findMany({
          orderBy: {
            id: 'asc',
          },
        });

        if (products && products.length > 0) {
          return res.status(200).json(products);
        }
      }

      // If database is empty or not configured, return default sample products
      return res.status(200).json(sampleProducts);
    } catch (error) {
      console.error("Database connection failed, returning fallback products:", error);
      // Return fallback products so app displays products on Vercel seamlessly
      return res.status(200).json(sampleProducts);
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


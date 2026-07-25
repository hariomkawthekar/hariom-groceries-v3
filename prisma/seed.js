const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const sampleProducts = [
    { name: 'Premium Basmati Rice', category: 'Grains', price: 80, unit: 'kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500', inStock: true },
    { name: 'India Gate Basmati Rice', category: 'Grains', price: 120, unit: 'kg', image: '/images/india Gate Basmati Rice.jfif', inStock: true },
    { name: 'Samrat Atta', category: 'Grains', price: 310, unit: '5kg', image: '/images/Samrat Atta.jfif', inStock: true },
    { name: 'Fortune Sunflower Oil', category: 'Oil', price: 600, unit: '5 liter bottle', image: '/images/fortune sunflower oil.jpg', inStock: true },
    { name: 'Amul Gold Milk', category: 'Dairy', price: 55, unit: 'liter', image: '/images/Amul-gold.webp', inStock: true },
    { name: 'Dairy Milk Chocolate', category: 'Chocolate', price: 99, unit: 'piece', image: '/images/Dairy Milk Chocolate.jfif', inStock: true },
  ];
  
  for (const product of sampleProducts) {
    await prisma.product.create({ data: product });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

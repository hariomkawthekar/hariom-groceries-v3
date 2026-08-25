import { DEFAULT_PRODUCTS } from '../../utils/constants';
import prisma from '../../lib/prisma';

if (!global.addedProducts) {
  global.addedProducts = [];
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      if (prisma) {
        const dbProducts = await prisma.product.findMany().catch(() => []);
        if (dbProducts && dbProducts.length > 0) {
          return res.status(200).json([...dbProducts, ...global.addedProducts]);
        }
      }
    } catch (e) {
      console.error("DB product fetch error:", e);
    }
    return res.status(200).json([...global.addedProducts, ...DEFAULT_PRODUCTS]);
  } 
  
  if (req.method === 'POST') {
    try {
      const { name, category, price, originalPrice, unit, image, rating, ratingCount, inStock } = req.body;

      if (!name || !category || !price) {
        return res.status(400).json({ message: 'Product name, category, and price are required.' });
      }

      const newProduct = {
        id: Date.now(),
        name: name.trim(),
        category: category.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.2),
        unit: unit ? unit.trim() : '1 Pack',
        image: image && image.trim() ? image.trim() : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        rating: rating ? Number(rating) : 4.8,
        ratingCount: ratingCount ? Number(ratingCount) : 50,
        inStock: inStock !== undefined ? Boolean(inStock) : true,
        createdAt: new Date().toISOString()
      };

      if (prisma) {
        try {
          await prisma.product.create({ data: newProduct }).catch(() => {});
        } catch (dbErr) {
          console.error("Prisma product insert error:", dbErr);
        }
      }

      // Always save to global memory fallback so it appears on home page
      global.addedProducts.unshift(newProduct);

      return res.status(201).json({ 
        message: 'Product added successfully! It is now live on the homepage.', 
        product: newProduct 
      });
    } catch (error) {
      console.error("Add Product Error:", error);
      return res.status(500).json({ message: 'Failed to save product.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}




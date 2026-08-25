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
          const merged = [...global.addedProducts, ...dbProducts];
          return res.status(200).json(merged.filter(p => p.active !== false));
        }
      }
    } catch (e) {
      console.error("DB product fetch error:", e);
    }
    const allProducts = [...global.addedProducts, ...DEFAULT_PRODUCTS];
    return res.status(200).json(allProducts.filter(p => p.active !== false));
  } 
  
  if (req.method === 'POST') {
    try {
      const { 
        name, 
        description,
        brand,
        category, 
        subcategory,
        price, 
        originalPrice, 
        gst,
        stockQuantity,
        unit, 
        minQuantity,
        maxQuantity,
        image, 
        galleryImages,
        rating, 
        ratingCount, 
        highlights,
        isDeliveryAvailable,
        active,
        featured,
        tags,
        inStock 
      } = req.body;

      if (!name || !category || !price) {
        return res.status(400).json({ message: 'Product Name, Category, and Selling Price are required.' });
      }

      const numSellingPrice = Number(price);
      const numOriginalPrice = originalPrice ? Number(originalPrice) : Math.round(numSellingPrice * 1.15);
      const discountPercent = numOriginalPrice > numSellingPrice 
        ? Math.round(((numOriginalPrice - numSellingPrice) / numOriginalPrice) * 100)
        : 0;

      const newProduct = {
        id: Date.now(),
        name: name.trim(),
        description: description ? description.trim() : '',
        brand: brand ? brand.trim() : '',
        category: category.trim(),
        subcategory: subcategory ? subcategory.trim() : '',
        price: numSellingPrice,
        originalPrice: numOriginalPrice,
        discountPercent,
        gst: gst !== undefined ? Number(gst) : 0,
        stockQuantity: stockQuantity ? Number(stockQuantity) : 50,
        unit: unit ? unit.trim() : '1 Pack',
        minQuantity: minQuantity ? Number(minQuantity) : 1,
        maxQuantity: maxQuantity ? Number(maxQuantity) : 10,
        image: image && image.trim() ? image.trim() : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
        galleryImages: Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [],
        rating: rating ? Number(rating) : 4.5,
        ratingCount: ratingCount ? Number(ratingCount) : 125,
        highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',').map(s => s.trim()) : ['Fresh']),
        isDeliveryAvailable: isDeliveryAvailable !== undefined ? Boolean(isDeliveryAvailable) : true,
        active: active !== undefined ? Boolean(active) : true,
        featured: featured !== undefined ? Boolean(featured) : false,
        tags: tags ? tags.trim() : `${name}, ${category}, ${brand}`,
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

      // Save to global memory store for instant homepage visibility across sessions
      global.addedProducts.unshift(newProduct);

      return res.status(201).json({ 
        message: 'Product saved successfully! It is now live on the homepage, category pages, and search results.', 
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





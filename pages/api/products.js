import fs from 'fs';
import path from 'path';
import { DEFAULT_PRODUCTS } from '../../utils/constants.js';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'products.json');
const DELETED_FILE_PATH = path.join(DATA_DIR, 'deleted_products.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

if (!global.addedProducts) global.addedProducts = [];
if (!global.deletedProductIds) global.deletedProductIds = new Set();

function safeEnsureDirs() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (e) {
    // Read-only filesystem on Vercel
  }
}

function readCustomProductsFromFile() {
  try {
    safeEnsureDirs();
    if (fs.existsSync(FILE_PATH)) {
      const fileData = fs.readFileSync(FILE_PATH, 'utf8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    // Read-only filesystem
  }
  return global.addedProducts || [];
}

function writeCustomProductsToFile(products) {
  global.addedProducts = products;
  try {
    safeEnsureDirs();
    fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    // Read-only filesystem
  }
}

function readDeletedProductIdsFromFile() {
  try {
    safeEnsureDirs();
    if (fs.existsSync(DELETED_FILE_PATH)) {
      const fileData = fs.readFileSync(DELETED_FILE_PATH, 'utf8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) return new Set(parsed.map(String));
    }
  } catch (err) {
    // Read-only filesystem
  }
  return global.deletedProductIds || new Set();
}

function writeDeletedProductIdsToFile(deletedSet) {
  global.deletedProductIds = deletedSet;
  try {
    safeEnsureDirs();
    const arr = Array.from(deletedSet);
    fs.writeFileSync(DELETED_FILE_PATH, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    // Read-only filesystem
  }
}

function processProductImage(imageDataUrl, prefix = 'prod') {
  if (!imageDataUrl || typeof imageDataUrl !== 'string') {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500';
  }

  const trimmed = imageDataUrl.trim();
  if (!trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  try {
    safeEnsureDirs();
    const match = trimmed.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!match) return trimmed;

    let ext = match[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/products/${fileName}`;
  } catch (error) {
    // Return data URL directly on Vercel read-only filesystem so image loads properly
    return trimmed;
  }
}

async function getStoredCustomProducts() {
  let products = readCustomProductsFromFile();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && Array.isArray(data)) {
        products = data;
        writeCustomProductsToFile(products);
      }
    } catch (dbErr) {
      console.warn('Supabase product fetch notice:', dbErr.message || dbErr);
    }
  }

  global.addedProducts = products;
  return products;
}

async function getDeletedProductIds() {
  let deletedIds = readDeletedProductIdsFromFile();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('deleted_items').select('id').eq('type', 'product');
      if (!error && Array.isArray(data)) {
        data.forEach(item => deletedIds.add(String(item.id)));
        writeDeletedProductIdsToFile(deletedIds);
      }
    } catch (dbErr) {
      console.warn('Supabase deleted products notice:', dbErr.message || dbErr);
    }
  }

  global.deletedProductIds = deletedIds;
  return deletedIds;
}

export default async function handler(req, res) {
  const { method } = req;

  // GET: Fetch all active products
  if (method === 'GET') {
    try {
      const customProducts = await getStoredCustomProducts();
      const deletedIds = await getDeletedProductIds();

      const activeCustom = customProducts.filter(p => !deletedIds.has(String(p.id)));

      const customIds = new Set(activeCustom.map(p => String(p.id)));
      const filteredDefaults = DEFAULT_PRODUCTS.filter(p => 
        !deletedIds.has(String(p.id)) && !customIds.has(String(p.id))
      );

      const merged = [...activeCustom, ...filteredDefaults];
      return res.status(200).json(merged.filter(p => p.active !== false));
    } catch (error) {
      console.error('GET products error:', error);
      return res.status(500).json({ message: 'Failed to fetch products.' });
    }
  }

  // POST: Add New Product
  if (method === 'POST') {
    try {
      const { 
        name, description, brand, category, subcategory, price, originalPrice, gst, stockQuantity, unit,
        minQuantity, maxQuantity, image, galleryImages, rating, ratingCount, highlights, isDeliveryAvailable,
        active, featured, tags, inStock 
      } = req.body || {};

      if (!name || !category || !price) {
        return res.status(400).json({ message: 'Product Name, Category, and Selling Price are required.' });
      }

      const numSellingPrice = Number(price);
      const numOriginalPrice = originalPrice ? Number(originalPrice) : Math.round(numSellingPrice * 1.15);
      const discountPercent = numOriginalPrice > numSellingPrice 
        ? Math.round(((numOriginalPrice - numSellingPrice) / numOriginalPrice) * 100)
        : 0;

      const mainImage = processProductImage(image, 'main');
      const processedGallery = Array.isArray(galleryImages) 
        ? galleryImages.map((g, i) => processProductImage(g, `gal-${i}`))
        : [];

      const productId = Date.now();
      const newProduct = {
        id: productId,
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
        image: mainImage,
        galleryImages: processedGallery,
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

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('products').insert([newProduct]);
        } catch (sbErr) {
          console.warn('Supabase product insert notice:', sbErr);
        }
      }

      const existingCustom = await getStoredCustomProducts();
      const updatedList = [newProduct, ...existingCustom];
      writeCustomProductsToFile(updatedList);

      return res.status(201).json({ 
        message: 'Product saved successfully! Live on homepage & category.', 
        product: newProduct 
      });
    } catch (error) {
      console.error('POST product error:', error);
      return res.status(500).json({ message: 'Failed to save product.' });
    }
  }

  // PUT: Edit Existing Product
  if (method === 'PUT') {
    try {
      const { id, name, description, brand, category, subcategory, price, originalPrice, gst, stockQuantity, unit,
        minQuantity, maxQuantity, image, galleryImages, rating, ratingCount, highlights, isDeliveryAvailable,
        active, featured, tags, inStock } = req.body || {};

      if (!id) {
        return res.status(400).json({ message: 'Product ID is required for editing.' });
      }

      const existingCustom = await getStoredCustomProducts();
      const targetIdStr = String(id);

      const numSellingPrice = price !== undefined ? Number(price) : undefined;
      const numOriginalPrice = originalPrice !== undefined ? Number(originalPrice) : undefined;

      let updatedProduct = null;
      const index = existingCustom.findIndex(p => String(p.id) === targetIdStr);

      if (index >= 0) {
        const oldProd = existingCustom[index];
        const newSellingPrice = numSellingPrice !== undefined ? numSellingPrice : oldProd.price;
        const newOriginalPrice = numOriginalPrice !== undefined ? numOriginalPrice : oldProd.originalPrice;
        const discountPercent = newOriginalPrice > newSellingPrice 
          ? Math.round(((newOriginalPrice - newSellingPrice) / newOriginalPrice) * 100)
          : 0;

        const mainImage = image ? processProductImage(image, 'main') : oldProd.image;
        const processedGallery = Array.isArray(galleryImages)
          ? galleryImages.map((g, i) => processProductImage(g, `gal-${i}`))
          : oldProd.galleryImages;

        updatedProduct = {
          ...oldProd,
          name: name ? name.trim() : oldProd.name,
          description: description !== undefined ? description.trim() : oldProd.description,
          brand: brand !== undefined ? brand.trim() : oldProd.brand,
          category: category ? category.trim() : oldProd.category,
          subcategory: subcategory !== undefined ? subcategory.trim() : oldProd.subcategory,
          price: newSellingPrice,
          originalPrice: newOriginalPrice,
          discountPercent,
          gst: gst !== undefined ? Number(gst) : oldProd.gst,
          stockQuantity: stockQuantity !== undefined ? Number(stockQuantity) : oldProd.stockQuantity,
          unit: unit ? unit.trim() : oldProd.unit,
          minQuantity: minQuantity !== undefined ? Number(minQuantity) : oldProd.minQuantity,
          maxQuantity: maxQuantity !== undefined ? Number(maxQuantity) : oldProd.maxQuantity,
          image: mainImage,
          galleryImages: processedGallery,
          rating: rating !== undefined ? Number(rating) : oldProd.rating,
          ratingCount: ratingCount !== undefined ? Number(ratingCount) : oldProd.ratingCount,
          highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',').map(s => s.trim()) : oldProd.highlights),
          isDeliveryAvailable: isDeliveryAvailable !== undefined ? Boolean(isDeliveryAvailable) : oldProd.isDeliveryAvailable,
          active: active !== undefined ? Boolean(active) : oldProd.active,
          featured: featured !== undefined ? Boolean(featured) : oldProd.featured,
          tags: tags !== undefined ? tags.trim() : oldProd.tags,
          inStock: inStock !== undefined ? Boolean(inStock) : oldProd.inStock,
          updatedAt: new Date().toISOString()
        };

        existingCustom[index] = updatedProduct;
      } else {
        const defaultProd = DEFAULT_PRODUCTS.find(p => String(p.id) === targetIdStr);
        if (defaultProd) {
          const newSellingPrice = numSellingPrice !== undefined ? numSellingPrice : defaultProd.price;
          const newOriginalPrice = numOriginalPrice !== undefined ? numOriginalPrice : defaultProd.originalPrice;
          const discountPercent = newOriginalPrice > newSellingPrice 
            ? Math.round(((newOriginalPrice - newSellingPrice) / newOriginalPrice) * 100)
            : 0;

          const mainImage = image ? processProductImage(image, 'main') : defaultProd.image;

          updatedProduct = {
            ...defaultProd,
            id: defaultProd.id,
            name: name ? name.trim() : defaultProd.name,
            category: category ? category.trim() : defaultProd.category,
            price: newSellingPrice,
            originalPrice: newOriginalPrice,
            discountPercent,
            image: mainImage,
            updatedAt: new Date().toISOString()
          };
          existingCustom.unshift(updatedProduct);
        } else {
          return res.status(404).json({ message: 'Product not found.' });
        }
      }

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('products').upsert([updatedProduct]);
        } catch (sbErr) {
          console.warn('Supabase product upsert notice:', sbErr);
        }
      }

      writeCustomProductsToFile(existingCustom);

      return res.status(200).json({
        message: 'Product updated successfully!',
        product: updatedProduct
      });
    } catch (error) {
      console.error('PUT product error:', error);
      return res.status(500).json({ message: 'Failed to update product.' });
    }
  }

  // DELETE: Remove Product
  if (method === 'DELETE') {
    try {
      const { id } = req.body || req.query || {};

      if (!id) {
        return res.status(400).json({ message: 'Product ID is required for deletion.' });
      }

      const targetIdStr = String(id);
      const existingCustom = await getStoredCustomProducts();
      const filteredCustom = existingCustom.filter(p => String(p.id) !== targetIdStr);

      const deletedIds = await getDeletedProductIds();
      deletedIds.add(targetIdStr);
      writeDeletedProductIdsToFile(deletedIds);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('products').delete().eq('id', id);
          await supabase.from('deleted_items').upsert([{ id: targetIdStr, type: 'product' }]);
        } catch (sbErr) {
          console.warn('Supabase product delete notice:', sbErr);
        }
      }

      writeCustomProductsToFile(filteredCustom);

      return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
      console.error('DELETE product error:', error);
      return res.status(500).json({ message: 'Failed to delete product.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}

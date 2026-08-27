import fs from 'fs';
import path from 'path';
import { FEATURED_CATEGORY_TILES } from '../../utils/constants.js';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'categories.json');
const DELETED_FILE_PATH = path.join(DATA_DIR, 'deleted_categories.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'categories');

// Memory fallbacks for serverless environments (e.g. Vercel read-only filesystem)
if (!global.customCategories) global.customCategories = [];
if (!global.deletedCategoryIds) global.deletedCategoryIds = new Set();

function safeEnsureDirs() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (e) {
    // Read-only filesystem on Vercel serverless
  }
}

function readCustomCategoriesFromFile() {
  try {
    safeEnsureDirs();
    if (fs.existsSync(FILE_PATH)) {
      const fileData = fs.readFileSync(FILE_PATH, 'utf8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    // Read-only on serverless
  }
  return global.customCategories || [];
}

function writeCustomCategoriesToFile(categories) {
  global.customCategories = categories;
  try {
    safeEnsureDirs();
    fs.writeFileSync(FILE_PATH, JSON.stringify(categories, null, 2), 'utf8');
  } catch (err) {
    // Read-only on serverless
  }
}

function readDeletedCategoryIdsFromFile() {
  try {
    safeEnsureDirs();
    if (fs.existsSync(DELETED_FILE_PATH)) {
      const fileData = fs.readFileSync(DELETED_FILE_PATH, 'utf8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch (err) {
    // Read-only on serverless
  }
  return global.deletedCategoryIds || new Set();
}

function writeDeletedCategoryIdsToFile(deletedSet) {
  global.deletedCategoryIds = deletedSet;
  try {
    safeEnsureDirs();
    const arr = Array.from(deletedSet);
    fs.writeFileSync(DELETED_FILE_PATH, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    // Read-only on serverless
  }
}

function processCategoryImage(imageDataUrl, categoryId) {
  if (!imageDataUrl || typeof imageDataUrl !== 'string') {
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400';
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

    const fileName = `${categoryId || 'cat-' + Date.now()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/categories/${fileName}`;
  } catch (error) {
    // On Vercel read-only filesystem, return data URL directly so image displays
    return trimmed;
  }
}

async function getStoredCustomCategories() {
  let categories = readCustomCategoriesFromFile();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && Array.isArray(data)) {
        categories = data;
        writeCustomCategoriesToFile(categories);
      }
    } catch (dbErr) {
      console.warn('Supabase fetch notice:', dbErr.message || dbErr);
    }
  }

  global.customCategories = categories;
  return categories;
}

async function getDeletedCategoryIds() {
  let deletedIds = readDeletedCategoryIdsFromFile();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('deleted_items').select('id').eq('type', 'category');
      if (!error && Array.isArray(data)) {
        data.forEach(item => deletedIds.add(item.id));
        writeDeletedCategoryIdsToFile(deletedIds);
      }
    } catch (dbErr) {
      console.warn('Supabase deleted items notice:', dbErr.message || dbErr);
    }
  }

  global.deletedCategoryIds = deletedIds;
  return deletedIds;
}

export default async function handler(req, res) {
  const { method } = req;

  // GET: Return active categories
  if (method === 'GET') {
    try {
      const customCats = await getStoredCustomCategories();
      const deletedIds = await getDeletedCategoryIds();

      const activeCustom = customCats.filter(c => !deletedIds.has(c.id));
      const customNames = new Set(activeCustom.map(c => (c.name || '').trim().toLowerCase()));
      const customIds = new Set(activeCustom.map(c => c.id));

      const filteredPresets = FEATURED_CATEGORY_TILES.filter(preset => 
        !deletedIds.has(preset.id) &&
        !customIds.has(preset.id) && 
        !customNames.has((preset.name || '').trim().toLowerCase())
      );

      const merged = [...activeCustom, ...filteredPresets];
      return res.status(200).json(merged);
    } catch (error) {
      console.error('GET categories error:', error);
      return res.status(500).json({ message: 'Failed to fetch categories.' });
    }
  }

  // POST: Create New Category
  if (method === 'POST') {
    try {
      const { name, image, subtitle, shopkeeperId } = req.body || {};

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Category Name is required.' });
      }

      const trimmedName = name.trim();
      const lowerName = trimmedName.toLowerCase();

      const existingCustom = await getStoredCustomCategories();
      const deletedIds = await getDeletedCategoryIds();

      const activeCustom = existingCustom.filter(c => !deletedIds.has(c.id));
      const activePresets = FEATURED_CATEGORY_TILES.filter(p => !deletedIds.has(p.id));

      const isDuplicateCustom = activeCustom.some(c => (c.name || '').trim().toLowerCase() === lowerName);
      const isDuplicatePreset = activePresets.some(c => (c.name || '').trim().toLowerCase() === lowerName);

      if (isDuplicateCustom || isDuplicatePreset) {
        return res.status(400).json({ 
          message: `Category "${trimmedName}" already exists. Please use a unique category name.` 
        });
      }

      const categoryId = `cat-${Date.now()}`;
      const processedImage = processCategoryImage(image, categoryId);
      const now = new Date().toISOString();

      const newCategory = {
        id: categoryId,
        name: trimmedName,
        categoryKey: trimmedName,
        subtitle: subtitle ? subtitle.trim() : 'Fresh items in store',
        image: processedImage,
        bgColor: 'bg-emerald-50/90 hover:bg-emerald-100 border-emerald-200 text-emerald-900',
        shopkeeperId: shopkeeperId || 'SK101',
        createdAt: now,
        updatedAt: now
      };

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('categories').insert([newCategory]);
        } catch (sbErr) {
          console.warn('Supabase insert notice:', sbErr);
        }
      }

      const updatedList = [newCategory, ...existingCustom];
      writeCustomCategoriesToFile(updatedList);

      return res.status(201).json({
        message: `Category "${trimmedName}" created successfully!`,
        category: newCategory
      });
    } catch (error) {
      console.error('POST category error:', error);
      return res.status(500).json({ message: 'Failed to save category.' });
    }
  }

  // PUT: Update Existing Category
  if (method === 'PUT') {
    try {
      const { id, name, image, subtitle, shopkeeperId } = req.body || {};

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required for editing.' });
      }

      const existingCustom = await getStoredCustomCategories();
      const deletedIds = await getDeletedCategoryIds();
      const trimmedName = name ? name.trim() : '';

      if (trimmedName) {
        const lowerName = trimmedName.toLowerCase();
        const activeCustom = existingCustom.filter(c => !deletedIds.has(c.id));
        const activePresets = FEATURED_CATEGORY_TILES.filter(p => !deletedIds.has(p.id));

        const duplicateCustom = activeCustom.some(c => c.id !== id && (c.name || '').trim().toLowerCase() === lowerName);
        const duplicatePreset = activePresets.some(c => c.id !== id && (c.name || '').trim().toLowerCase() === lowerName);

        if (duplicateCustom || duplicatePreset) {
          return res.status(400).json({
            message: `Another category with name "${trimmedName}" already exists.`
          });
        }
      }

      const now = new Date().toISOString();
      let updatedCategory = null;

      const index = existingCustom.findIndex(c => c.id === id);
      if (index >= 0) {
        const oldCat = existingCustom[index];
        const newImageUrl = image ? processCategoryImage(image, id) : oldCat.image;

        updatedCategory = {
          ...oldCat,
          name: trimmedName || oldCat.name,
          categoryKey: trimmedName || oldCat.categoryKey,
          subtitle: subtitle !== undefined ? subtitle.trim() : oldCat.subtitle,
          image: newImageUrl,
          shopkeeperId: shopkeeperId || oldCat.shopkeeperId,
          updatedAt: now
        };
        existingCustom[index] = updatedCategory;
      } else {
        const presetIndex = FEATURED_CATEGORY_TILES.findIndex(c => c.id === id);
        if (presetIndex >= 0) {
          const preset = FEATURED_CATEGORY_TILES[presetIndex];
          const newImageUrl = image ? processCategoryImage(image, id) : preset.image;

          updatedCategory = {
            ...preset,
            id: preset.id,
            name: trimmedName || preset.name,
            categoryKey: trimmedName || preset.categoryKey,
            subtitle: subtitle !== undefined ? subtitle.trim() : preset.subtitle,
            image: newImageUrl,
            shopkeeperId: shopkeeperId || 'SK101',
            updatedAt: now
          };
          existingCustom.unshift(updatedCategory);
        } else {
          return res.status(404).json({ message: 'Category not found.' });
        }
      }

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('categories').upsert([updatedCategory]);
        } catch (sbErr) {
          console.warn('Supabase upsert notice:', sbErr);
        }
      }

      writeCustomCategoriesToFile(existingCustom);

      return res.status(200).json({
        message: 'Category updated successfully!',
        category: updatedCategory
      });
    } catch (error) {
      console.error('PUT category error:', error);
      return res.status(500).json({ message: 'Failed to update category.' });
    }
  }

  // DELETE: Remove Category
  if (method === 'DELETE') {
    try {
      const { id } = req.body || req.query || {};

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required for deletion.' });
      }

      const existingCustom = await getStoredCustomCategories();
      const filteredCustom = existingCustom.filter(c => c.id !== id);

      const deletedIds = await getDeletedCategoryIds();
      deletedIds.add(id);
      writeDeletedCategoryIdsToFile(deletedIds);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('categories').delete().eq('id', id);
          await supabase.from('deleted_items').upsert([{ id, type: 'category' }]);
        } catch (sbErr) {
          console.warn('Supabase delete notice:', sbErr);
        }
      }

      writeCustomCategoriesToFile(filteredCustom);

      return res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error('DELETE category error:', error);
      return res.status(500).json({ message: 'Failed to delete category.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}

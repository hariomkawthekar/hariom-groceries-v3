import fs from 'fs';
import path from 'path';
import { FEATURED_CATEGORY_TILES } from '../../utils/constants.js';
import { supabase, isSupabaseConfigured } from '../../utils/supabaseClient.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'categories.json');
const DELETED_FILE_PATH = path.join(DATA_DIR, 'deleted_categories.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'categories');

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

function readCustomCategoriesFromFile() {
  try {
    ensureDirs();
    if (fs.existsSync(FILE_PATH)) {
      const fileData = fs.readFileSync(FILE_PATH, 'utf8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading custom categories file:', err);
  }
  return [];
}

function writeCustomCategoriesToFile(categories) {
  try {
    ensureDirs();
    fs.writeFileSync(FILE_PATH, JSON.stringify(categories, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing custom categories file:', err);
  }
}

function readDeletedCategoryIdsFromFile() {
  try {
    ensureDirs();
    if (fs.existsSync(DELETED_FILE_PATH)) {
      const fileData = fs.readFileSync(DELETED_FILE_PATH, 'utf8');
      const parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (err) {
    console.error('Error reading deleted categories file:', err);
  }
  return new Set();
}

function writeDeletedCategoryIdsToFile(deletedSet) {
  try {
    ensureDirs();
    const arr = Array.from(deletedSet);
    fs.writeFileSync(DELETED_FILE_PATH, JSON.stringify(arr, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing deleted categories file:', err);
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
    ensureDirs();
    const match = trimmed.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (!match) {
      return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400';
    }

    let ext = match[1].toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const fileName = `${categoryId || 'cat-' + Date.now()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);

    return `/uploads/categories/${fileName}`;
  } catch (error) {
    console.error('Failed to process base64 image:', error);
    return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400';
  }
}

async function getStoredCustomCategories() {
  let categories = readCustomCategoriesFromFile();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('categories').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        categories = data;
        writeCustomCategoriesToFile(categories);
      }
    } catch (dbErr) {
      console.warn('Supabase fetch error, fallback to file storage:', dbErr.message || dbErr);
    }
  }

  global.customCategories = categories;
  return categories;
}

async function saveCustomCategories(categories) {
  global.customCategories = categories;
  writeCustomCategoriesToFile(categories);
}

export default async function handler(req, res) {
  const { method } = req;

  // GET: Return all active categories
  if (method === 'GET') {
    try {
      const customCats = await getStoredCustomCategories();
      const deletedIds = readDeletedCategoryIdsFromFile();

      // Active custom categories (not in deletedIds)
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
      const deletedIds = readDeletedCategoryIdsFromFile();

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
      await saveCustomCategories(updatedList);

      return res.status(201).json({
        message: `Category "${trimmedName}" created successfully!`,
        category: newCategory
      });
    } catch (error) {
      console.error('POST category error:', error);
      return res.status(500).json({ message: 'Failed to save category to database.' });
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
      const deletedIds = readDeletedCategoryIdsFromFile();
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

      await saveCustomCategories(existingCustom);

      return res.status(200).json({
        message: 'Category updated successfully!',
        category: updatedCategory
      });
    } catch (error) {
      console.error('PUT category error:', error);
      return res.status(500).json({ message: 'Failed to update category.' });
    }
  }

  // DELETE: Remove Category (Custom or Preset)
  if (method === 'DELETE') {
    try {
      const { id } = req.body || req.query || {};

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required for deletion.' });
      }

      const existingCustom = await getStoredCustomCategories();
      const filteredCustom = existingCustom.filter(c => c.id !== id);

      const deletedIds = readDeletedCategoryIdsFromFile();
      deletedIds.add(id);
      writeDeletedCategoryIdsToFile(deletedIds);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('categories').delete().eq('id', id);
        } catch (sbErr) {
          console.warn('Supabase delete notice:', sbErr);
        }
      }

      await saveCustomCategories(filteredCustom);

      return res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error('DELETE category error:', error);
      return res.status(500).json({ message: 'Failed to delete category.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}

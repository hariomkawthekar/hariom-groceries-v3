import { FEATURED_CATEGORY_TILES } from '../../utils/constants';
import prisma from '../../lib/prisma';

if (!global.customCategories) {
  global.customCategories = [];
}

export default async function handler(req, res) {
  const { method } = req;

  // GET: Return all active category tiles (Shopkeeper added + default presets)
  if (method === 'GET') {
    try {
      if (prisma && prisma.category) {
        const dbCategories = await prisma.category.findMany().catch(() => []);
        if (dbCategories && dbCategories.length > 0) {
          const merged = [...global.customCategories, ...dbCategories];
          return res.status(200).json(merged);
        }
      }
    } catch (e) {
      console.error("DB categories fetch error:", e);
    }

    // Merge custom shopkeeper categories at top + default preset tiles
    const allCategories = [...global.customCategories, ...FEATURED_CATEGORY_TILES];
    return res.status(200).json(allCategories);
  }

  // POST: Add New Category
  if (method === 'POST') {
    try {
      const { name, image, subtitle, shopkeeperId } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ message: 'Category Name is required.' });
      }

      const now = new Date().toISOString();
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        categoryKey: name.trim(),
        subtitle: subtitle ? subtitle.trim() : 'Fresh items in store',
        image: image && image.trim() ? image.trim() : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
        bgColor: 'bg-emerald-50/90 hover:bg-emerald-100 border-emerald-200 text-emerald-900',
        shopkeeperId: shopkeeperId || 'SK101',
        createdAt: now,
        updatedAt: now
      };

      if (prisma && prisma.category) {
        try {
          await prisma.category.create({ data: newCategory }).catch(() => {});
        } catch (dbErr) {
          console.error("Prisma category insert error:", dbErr);
        }
      }

      global.customCategories.unshift(newCategory);

      return res.status(201).json({
        message: 'Category created successfully! Live in Shop by Category.',
        category: newCategory
      });
    } catch (error) {
      console.error("Add Category Error:", error);
      return res.status(500).json({ message: 'Failed to save category.' });
    }
  }

  // PUT: Edit Existing Category
  if (method === 'PUT') {
    try {
      const { id, name, image, subtitle, shopkeeperId } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required for editing.' });
      }

      const now = new Date().toISOString();
      let updatedCategory = null;

      // Update in global custom categories list
      const index = global.customCategories.findIndex(c => c.id === id);
      if (index >= 0) {
        global.customCategories[index] = {
          ...global.customCategories[index],
          name: name ? name.trim() : global.customCategories[index].name,
          categoryKey: name ? name.trim() : global.customCategories[index].categoryKey,
          image: image ? image.trim() : global.customCategories[index].image,
          subtitle: subtitle ? subtitle.trim() : global.customCategories[index].subtitle,
          updatedAt: now
        };
        updatedCategory = global.customCategories[index];
      } else {
        // If editing a preset category tile, create an override entry in customCategories
        const presetIndex = FEATURED_CATEGORY_TILES.findIndex(c => c.id === id);
        if (presetIndex >= 0) {
          const preset = FEATURED_CATEGORY_TILES[presetIndex];
          const newOverride = {
            ...preset,
            name: name ? name.trim() : preset.name,
            categoryKey: name ? name.trim() : preset.categoryKey,
            image: image ? image.trim() : preset.image,
            subtitle: subtitle ? subtitle.trim() : preset.subtitle,
            updatedAt: now
          };
          global.customCategories.unshift(newOverride);
          updatedCategory = newOverride;
        }
      }

      if (prisma && prisma.category) {
        try {
          await prisma.category.update({
            where: { id },
            data: {
              name: name ? name.trim() : undefined,
              image: image ? image.trim() : undefined,
              subtitle: subtitle ? subtitle.trim() : undefined,
              updatedAt: now
            }
          }).catch(() => {});
        } catch (dbErr) {
          console.error("Prisma category update error:", dbErr);
        }
      }

      return res.status(200).json({
        message: 'Category updated successfully!',
        category: updatedCategory
      });
    } catch (error) {
      console.error("Edit Category Error:", error);
      return res.status(500).json({ message: 'Failed to update category.' });
    }
  }

  // DELETE: Remove Category
  if (method === 'DELETE') {
    try {
      const { id } = req.body || req.query;

      if (!id) {
        return res.status(400).json({ message: 'Category ID is required for deletion.' });
      }

      global.customCategories = global.customCategories.filter(c => c.id !== id);

      if (prisma && prisma.category) {
        try {
          await prisma.category.delete({ where: { id } }).catch(() => {});
        } catch (dbErr) {
          console.error("Prisma category delete error:", dbErr);
        }
      }

      return res.status(200).json({ message: 'Category deleted successfully.' });
    } catch (error) {
      console.error("Delete Category Error:", error);
      return res.status(500).json({ message: 'Failed to delete category.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end(`Method ${method} Not Allowed`);
}

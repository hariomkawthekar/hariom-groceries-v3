import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

// In-memory demo store for registered shopkeepers if DB is not configured
if (!global.demoShopkeepers) {
  global.demoShopkeepers = []
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { shopkeeperId, email, password } = req.body

  if (!shopkeeperId || !email || !password) {
    return res.status(400).json({ message: 'Please fill in all fields (Shopkeeper ID, Email, Password)' })
  }

  try {
    if (prisma) {
      const existing = await prisma.shopkeeper.findFirst({
        where: { OR: [{ shopkeeperId }, { email }] }
      })

      if (existing) {
        return res.status(400).json({ message: 'Shopkeeper ID or Email is already registered' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newShopkeeper = await prisma.shopkeeper.create({
        data: {
          shopkeeperId,
          email,
          password: hashedPassword
        },
        select: { id: true, shopkeeperId: true, email: true }
      })

      return res.status(201).json({ message: 'Shopkeeper registered successfully', shopkeeper: newShopkeeper })
    }

    // Fallback demo registration mode when DB is not configured
    const existingDemo = global.demoShopkeepers.find(s => s.shopkeeperId === shopkeeperId || s.email === email)
    if (existingDemo) {
      return res.status(400).json({ message: 'Shopkeeper ID or Email is already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newDemoShopkeeper = { id: Date.now().toString(), shopkeeperId, email, password: hashedPassword }
    global.demoShopkeepers.push(newDemoShopkeeper)

    return res.status(201).json({ 
      message: 'Shopkeeper registered successfully (Demo Mode)', 
      shopkeeper: { id: newDemoShopkeeper.id, shopkeeperId, email } 
    })
  } catch (error) {
    console.error('Registration Error:', error)
    return res.status(500).json({ message: 'Failed to process registration' })
  }
}


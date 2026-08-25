import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-shopkeeper-key-1234'

// Demo default account fallback if DB is not configured
const DEFAULT_DEMO_SHOPKEEPER = {
  id: '1',
  shopkeeperId: 'SK101',
  email: 'shopkeeper@hariom.com',
  passwordHash: bcrypt.hashSync('password123', 10)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { shopkeeperId, email, password } = req.body

  if (!shopkeeperId || !email || !password) {
    return res.status(400).json({ message: 'Please enter Shopkeeper ID, Email, and Password.' })
  }

  try {
    let targetShopkeeper = null

    if (prisma) {
      const shopkeeper = await prisma.shopkeeper.findUnique({
        where: { shopkeeperId }
      })

      if (shopkeeper && shopkeeper.email.toLowerCase() === email.toLowerCase()) {
        const isMatch = await bcrypt.compare(password, shopkeeper.password)
        if (isMatch) {
          targetShopkeeper = shopkeeper
        }
      }
    } else {
      // Check in-memory demo registered shopkeepers
      const demoList = global.demoShopkeepers || []
      const foundDemo = demoList.find(s => 
        s.shopkeeperId.toLowerCase() === shopkeeperId.toLowerCase() && 
        s.email.toLowerCase() === email.toLowerCase()
      )

      if (foundDemo && bcrypt.compareSync(password, foundDemo.password)) {
        targetShopkeeper = foundDemo
      } else if (
        (shopkeeperId.toLowerCase() === DEFAULT_DEMO_SHOPKEEPER.shopkeeperId.toLowerCase() || shopkeeperId === 'admin') &&
        email.toLowerCase() === DEFAULT_DEMO_SHOPKEEPER.email.toLowerCase() &&
        password === 'password123'
      ) {
        targetShopkeeper = DEFAULT_DEMO_SHOPKEEPER
      }
    }

    if (!targetShopkeeper) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your Shopkeeper ID, Email, and Password.' })
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: targetShopkeeper.id, shopkeeperId: targetShopkeeper.shopkeeperId },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Set secure cookie
    res.setHeader('Set-Cookie', `shopkeeper_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`)

    return res.status(200).json({ message: 'Logged in successfully', shopkeeperId: targetShopkeeper.shopkeeperId })
  } catch (error) {
    console.error('Login Error:', error)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}


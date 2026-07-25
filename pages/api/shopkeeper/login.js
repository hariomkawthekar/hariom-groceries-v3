import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-shopkeeper-key-1234'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { shopkeeperId, email, password } = req.body

  if (!shopkeeperId || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Find shopkeeper by ID
    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { shopkeeperId }
    })

    // Verify email additionally as required by the prompt
    if (!shopkeeper || shopkeeper.email !== email) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, shopkeeper.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate Token
    const token = jwt.sign(
      { id: shopkeeper.id, shopkeeperId: shopkeeper.shopkeeperId },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    // Set secure HTTP-only cookie
    res.setHeader('Set-Cookie', `shopkeeper_token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`)

    res.status(200).json({ message: 'Logged in successfully', shopkeeperId: shopkeeper.shopkeeperId })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

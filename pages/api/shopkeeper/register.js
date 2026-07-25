import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' })

  const { shopkeeperId, email, password } = req.body

  if (!shopkeeperId || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    const existing = await prisma.shopkeeper.findFirst({
      where: { OR: [{ shopkeeperId }, { email }] }
    })

    if (existing) {
      return res.status(400).json({ message: 'Shopkeeper ID or Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newShopkeeper = await prisma.shopkeeper.create({
      data: {
        shopkeeperId,
        email,
        password: hashedPassword
      },
      select: { id: true, shopkeeperId: true, email: true } // Omit password
    })

    res.status(201).json({ message: 'Shopkeeper registered successfully', shopkeeper: newShopkeeper })
  } catch (error) {
    console.error('Registration Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

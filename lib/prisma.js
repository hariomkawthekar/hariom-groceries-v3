let prisma = null

const dbUrl = process.env.DATABASE_URL || ''
const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1')

if (dbUrl && !isLocalhost) {
  try {
    const { PrismaClient } = require('@prisma/client')
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient()
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient()
      }
      prisma = global.prisma
    }
  } catch (error) {
    console.error("Prisma initialization error:", error)
    prisma = null
  }
}

export default prisma

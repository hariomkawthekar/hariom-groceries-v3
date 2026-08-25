let prisma = null

try {
  const dbUrl = process.env.DATABASE_URL || ''

  if (dbUrl) {
    const { PrismaClient } = require('@prisma/client')
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient()
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient()
      }
      prisma = global.prisma
    }
  }
} catch (error) {
  console.error("Prisma safe init error:", error)
  prisma = null
}

export default prisma


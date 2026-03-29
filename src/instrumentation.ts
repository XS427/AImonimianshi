import { PrismaClient } from '@prisma/client'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // 确保数据库表存在
    const prisma = new PrismaClient()
    try {
      // 尝试执行简单查询来验证数据库连接
      await prisma.$queryRaw`SELECT 1`
      console.log('Database connection verified')
    } catch (error) {
      console.error('Database connection failed:', error)
    } finally {
      await prisma.$disconnect()
    }
  }
}

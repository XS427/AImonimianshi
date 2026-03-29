import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // 尝试查询数据库
    await db.$queryRaw`SELECT 1`;
    
    // 获取数据库文件信息
    const dbPath = process.env.DATABASE_URL;
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'Database connected successfully!',
      databaseUrl: dbPath ? dbPath.replace(/\/.*\//, '/***/') : 'not set',
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error: unknown) {
    // 关键：捕获并打印错误
    console.error("Database Connection Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = (error as { code?: string })?.code || 'UNKNOWN';
    
    return NextResponse.json({ 
      status: 'error', 
      message: errorMessage,
      code: errorCode,
      databaseUrl: process.env.DATABASE_URL ? 'set' : 'not set',
      nodeEnv: process.env.NODE_ENV
    }, { status: 500 });
  }
}

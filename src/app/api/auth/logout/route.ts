import { NextResponse } from "next/server";

export async function POST() {
  // 清除服务端的session（如果有的话）
  // 由于我们使用的是无状态认证，这里主要返回成功响应
  return NextResponse.json({ success: true, message: "已退出登录" });
}

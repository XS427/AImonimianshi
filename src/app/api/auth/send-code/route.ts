import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// 生成6位验证码
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = body;

    // 验证手机号格式
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: "请输入正确的手机号码" }, { status: 400 });
    }

    // 检查是否在60秒内已发送
    const recentCode = await db.verificationCode.findFirst({
      where: {
        phone,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
        used: false
      }
    });

    if (recentCode) {
      return NextResponse.json({ success: false, error: "验证码已发送，请稍后再试" }, { status: 429 });
    }

    // 生成验证码
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟有效

    // 保存验证码
    await db.verificationCode.create({
      data: { phone, code, expiresAt }
    });

    // 开发环境：打印验证码到控制台
    if (process.env.NODE_ENV === "development") {
      console.log(`[验证码] 手机号: ${phone}, 验证码: ${code}`);
    }

    // TODO: 实际发送短信验证码
    // 这里可以接入短信服务商API，如阿里云短信、腾讯云短信等
    // 示例：
    // await sendSMS(phone, `您的验证码是${code}，5分钟内有效`);

    return NextResponse.json({
      success: true,
      message: "验证码已发送",
      // 开发环境返回验证码方便测试
      ...(process.env.NODE_ENV === "development" && { debugCode: code })
    });

  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ success: false, error: "发送验证码失败" }, { status: 500 });
  }
}

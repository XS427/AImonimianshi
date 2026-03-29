import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    // 验证参数
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return NextResponse.json({ success: false, error: "请输入正确的手机号码" }, { status: 400 });
    }

    if (!code || code.length !== 6) {
      return NextResponse.json({ success: false, error: "请输入6位验证码" }, { status: 400 });
    }

    // 查找验证码记录
    const verificationRecord = await db.verificationCode.findFirst({
      where: {
        phone,
        code,
        used: false,
        expiresAt: { gte: new Date() }
      },
      orderBy: { createdAt: "desc" }
    });

    if (!verificationRecord) {
      return NextResponse.json({ success: false, error: "验证码错误或已过期" }, { status: 400 });
    }

    // 标记验证码已使用
    await db.verificationCode.update({
      where: { id: verificationRecord.id },
      data: { used: true }
    });

    // 查找或创建用户
    let user = await db.user.findUnique({
      where: { phone }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          phone,
          nickname: `用户${phone.slice(-4)}`
        }
      });
    }

    // 返回用户信息
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        phone: user.phone || undefined,
        nickname: user.nickname || undefined,
        avatar: user.avatar || undefined
      }
    });

  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ success: false, error: "验证失败" }, { status: 500 });
  }
}

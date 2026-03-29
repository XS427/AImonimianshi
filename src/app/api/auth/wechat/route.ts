import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// 微信开放平台配置（需要配置真实的AppID和AppSecret）
const WECHAT_CONFIG = {
  appId: process.env.WECHAT_APP_ID || "",
  appSecret: process.env.WECHAT_APP_SECRET || "",
  // 微信授权页面地址
  authUrl: "https://open.weixin.qq.com/connect/qrconnect",
  // 回调地址
  redirectUri: process.env.WECHAT_REDIRECT_URI || "",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    // 如果有code，说明是微信回调
    if (code) {
      return handleWechatCallback(code, state);
    }

    // 否则生成授权链接
    return generateAuthUrl();

  } catch (error) {
    console.error("WeChat login error:", error);
    return NextResponse.json({ success: false, error: "微信登录失败" }, { status: 500 });
  }
}

// 生成微信授权链接
async function generateAuthUrl() {
  // 检查是否配置了微信
  if (!WECHAT_CONFIG.appId || !WECHAT_CONFIG.appSecret) {
    // 未配置时返回模拟登录（开发环境）
    if (process.env.NODE_ENV === "development") {
      console.log("[微信登录] 未配置AppID，使用模拟登录");

      // 创建或查找模拟用户
      let user = await db.user.findFirst({
        where: { wechatOpenId: "dev_mock_openid" }
      });

      if (!user) {
        user = await db.user.create({
          data: {
            wechatOpenId: "dev_mock_openid",
            nickname: "微信用户",
            avatar: ""
          }
        });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          nickname: user.nickname || undefined,
          avatar: user.avatar || undefined
        }
      });
    }

    return NextResponse.json({
      success: false,
      error: "微信登录未配置，请联系管理员"
    }, { status: 500 });
  }

  // 生成state参数（防CSRF攻击）
  const state = Math.random().toString(36).substring(2, 15);

  // 构建授权URL
  const redirectUri = encodeURIComponent(WECHAT_CONFIG.redirectUri);
  const authUrl = `${WECHAT_CONFIG.authUrl}?appid=${WECHAT_CONFIG.appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${state}#wechat_redirect`;

  return NextResponse.json({
    success: true,
    redirectUrl: authUrl,
    state
  });
}

// 处理微信回调
async function handleWechatCallback(code: string, state?: string) {
  try {
    // 通过code获取access_token
    const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_CONFIG.appId}&secret=${WECHAT_CONFIG.appSecret}&code=${code}&grant_type=authorization_code`;

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (tokenData.errcode) {
      return NextResponse.json({
        success: false,
        error: tokenData.errmsg || "获取微信授权失败"
      }, { status: 400 });
    }

    const { access_token, openid, unionid } = tokenData;

    // 获取用户信息
    const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`;
    const userInfoResponse = await fetch(userInfoUrl);
    const userInfo = await userInfoResponse.json();

    // 查找或创建用户
    let user = await db.user.findFirst({
      where: {
        OR: [
          { wechatOpenId: openid },
          ...(unionid ? [{ wechatUnionId: unionid }] : [])
        ]
      }
    });

    if (!user) {
      user = await db.user.create({
        data: {
          wechatOpenId: openid,
          wechatUnionId: unionid,
          nickname: userInfo.nickname || "微信用户",
          avatar: userInfo.headimgurl || ""
        }
      });
    } else {
      // 更新用户信息
      user = await db.user.update({
        where: { id: user.id },
        data: {
          nickname: userInfo.nickname || user.nickname,
          avatar: userInfo.headimgurl || user.avatar
        }
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nickname: user.nickname || undefined,
        avatar: user.avatar || undefined
      }
    });

  } catch (error) {
    console.error("WeChat callback error:", error);
    return NextResponse.json({
      success: false,
      error: "微信登录处理失败"
    }, { status: 500 });
  }
}

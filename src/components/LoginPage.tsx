"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Phone,
  MessageSquare,
  Loader2,
  ShieldCheck,
  User,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (user: { id: string; phone?: string; nickname?: string; avatar?: string }) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [loginMethod, setLoginMethod] = useState<"phone" | "wechat">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"input" | "verify">("input");

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 验证手机号格式
  const isValidPhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone);

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!isValidPhone(phone)) {
      setError("请输入正确的手机号码");
      return;
    }

    setIsSendingCode(true);
    setError("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (data.success) {
        setCountdown(60);
        setStep("verify");
      } else {
        setError(data.error || "发送验证码失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsSendingCode(false);
    }
  };

  // 验证码登录
  const handlePhoneLogin = async () => {
    if (!code || code.length !== 6) {
      setError("请输入6位验证码");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code })
      });

      const data = await response.json();

      if (data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "验证失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  // 微信登录
  const handleWechatLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/wechat", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        // 模拟微信登录成功（实际应跳转到微信授权页面）
        window.open(data.redirectUrl, "_blank");
      } else if (data.success && data.user) {
        // 已绑定用户，直接登录
        onLoginSuccess(data.user);
      } else {
        setError(data.error || "微信登录失败");
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 dark:bg-amber-900/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-md relative z-10">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              AI模拟面试助手
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            登录后开始你的模拟面试之旅
          </p>
        </div>

        {/* 登录卡片 */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* 登录方式切换 */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={loginMethod === "phone" ? "default" : "outline"}
                className={`flex-1 gap-2 ${loginMethod === "phone" ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90" : ""}`}
                onClick={() => { setLoginMethod("phone"); setError(""); setStep("input"); }}
              >
                <Phone className="w-4 h-4" />
                手机登录
              </Button>
              <Button
                variant={loginMethod === "wechat" ? "default" : "outline"}
                className={`flex-1 gap-2 ${loginMethod === "wechat" ? "bg-green-500 hover:bg-green-600" : ""}`}
                onClick={() => { setLoginMethod("wechat"); setError(""); }}
              >
                <MessageSquare className="w-4 h-4" />
                微信登录
              </Button>
            </div>

            {/* 手机号登录表单 */}
            {loginMethod === "phone" && (
              <div className="space-y-4">
                {step === "input" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="phone">手机号码</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="请输入手机号"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
                      onClick={sendVerificationCode}
                      disabled={!isValidPhone(phone) || isSendingCode}
                    >
                      {isSendingCode ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          发送中...
                        </>
                      ) : (
                        <>
                          获取验证码
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">验证码已发送至</span>
                      <span className="font-medium">{phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")}</span>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="code">验证码</Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="code"
                          type="text"
                          placeholder="请输入6位验证码"
                          value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="pl-10 text-center text-lg tracking-widest"
                          maxLength={6}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => { setStep("input"); setCode(""); setError(""); }}
                      >
                        返回修改
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90"
                        onClick={handlePhoneLogin}
                        disabled={code.length !== 6 || isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            验证中...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            立即登录
                          </>
                        )}
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={sendVerificationCode}
                        disabled={countdown > 0 || isSendingCode}
                        className="text-muted-foreground"
                      >
                        {countdown > 0 ? `${countdown}秒后可重新发送` : "重新发送验证码"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 微信登录 */}
            {loginMethod === "wechat" && (
              <div className="space-y-4">
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-green-50 dark:bg-green-900/20 mb-4">
                    <MessageSquare className="w-12 h-12 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    使用微信扫码登录，快速安全
                  </p>
                </div>
                <Button
                  className="w-full bg-green-500 hover:bg-green-600"
                  onClick={handleWechatLogin}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      请稍候...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      微信扫码登录
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  首次微信登录将自动创建账号
                </p>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* 分隔线和协议 */}
            <div className="mt-6">
              <Separator className="mb-4" />
              <p className="text-xs text-center text-muted-foreground">
                登录即表示同意
                <span className="text-primary cursor-pointer hover:underline">《用户协议》</span>
                和
                <span className="text-primary cursor-pointer hover:underline">《隐私政策》</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部提示 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            登录遇到问题？
            <span className="text-primary cursor-pointer hover:underline ml-1">联系客服</span>
          </p>
        </div>
      </div>
    </div>
  );
}

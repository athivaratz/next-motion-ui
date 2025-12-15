"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { user, userData, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && userData) {
      if (userData.isApproved) {
        router.push("/chat");
      } else {
        router.push("/pending");
      }
    }
  }, [user, userData, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-white">SOD Chatbot</h1>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">
              BETA
            </span>
          </div>
          <p className="text-neutral-500 text-sm">
            Chatbot ผู้ช่วยของ sodbd2.pics
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white mb-1">เข้าสู่ระบบ</h2>
              <p className="text-sm text-neutral-500">
                เข้าสู่ระบบด้วย Google เพื่อเริ่มใช้งาน
              </p>
            </div>

            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-neutral-100 text-neutral-900 font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              เข้าสู่ระบบด้วย Google
            </button>

            <p className="text-center text-xs text-neutral-600">
              การเข้าสู่ระบบถือว่าคุณยอมรับข้อกำหนดการใช้งาน
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 flex justify-center gap-6 text-neutral-500 text-xs">
          <span className="flex items-center gap-1.5">💬 Chatbot</span>
          <span className="flex items-center gap-1.5">🔒 ปลอดภัย</span>
          <span className="flex items-center gap-1.5">⚡ รวดเร็ว</span>
        </div>
      </div>
    </main>
  );
}

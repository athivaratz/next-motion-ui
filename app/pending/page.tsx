"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock, Loader2, LogOut, Sparkles } from "lucide-react";

export default function PendingPage() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData?.isApproved) {
        router.push("/chat");
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
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl mb-6">
          <Sparkles className="w-8 h-8 text-white" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-xl font-bold text-white">SOD Chatbot</h1>
          <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">
            BETA
          </span>
        </div>

        {/* Pending Status */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mt-6">
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
          
          <h2 className="text-lg font-semibold text-white mb-2">รอการอนุมัติ</h2>
          
          <div className="flex items-center justify-center gap-3 mb-4 py-3 px-4 bg-neutral-800/50 rounded-xl">
            {userData?.photoURL && (
              <img
                src={userData.photoURL}
                alt={userData.displayName || "User"}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="text-left">
              <p className="font-medium text-white text-sm">{userData?.displayName}</p>
              <p className="text-xs text-neutral-500">{userData?.email}</p>
            </div>
          </div>
          
          <p className="text-neutral-500 text-sm mb-6">
            บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ
          </p>

          <button
            onClick={signOut}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </main>
  );
}

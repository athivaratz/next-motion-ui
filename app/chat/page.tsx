"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { 
  Send, 
  Loader2, 
  LogOut, 
  Settings,
  Sparkles,
  User,
  RotateCcw,
  ChevronDown,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatSettings = {
  rateLimit: { maxRequests: number; windowHours: number };
  chat: { maxMessageLength: number; welcomeMessage: string };
  maintenance: { enabled: boolean; message: string };
};

export default function ChatPage() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [settings, setSettings] = useState<ChatSettings | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Fetch settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setLimit(data.rateLimit.maxRequests);
          setRemaining(data.rateLimit.maxRequests);
        }
      } catch (error) {
        // Use defaults
      }
    }
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!userData?.isApproved) {
        router.push("/pending");
      }
    }
  }, [user, userData, loading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      // 🔐 Get user's ID token for API authentication
      const idToken = await user.getIdToken();
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.remaining !== undefined) {
          setRemaining(data.remaining);
        }
        if (data.limit !== undefined) {
          setLimit(data.limit);
        }
        throw new Error(data.error || "Something went wrong");
      }

      // Update remaining from response
      if (data.remaining !== undefined) {
        setRemaining(data.remaining);
      }
      if (data.limit !== undefined) {
        setLimit(data.limit);
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const startNewChat = () => {
    setMessages([]);
    setError(null);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-white">SOD Chatbot</h1>
                <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] rounded font-medium">
                  BETA
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">sodbd2.pics</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startNewChat}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
              title="สนทนาใหม่"
            >
              <RotateCcw className="w-4 h-4 text-neutral-400" />
            </button>

            {/* Remaining Count */}
            {remaining !== null && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-800 rounded-lg" title={`เหลือ ${remaining} ข้อความจาก ${limit}`}>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className={cn(
                  "text-xs font-medium tabular-nums",
                  remaining <= 2 ? "text-red-400" : remaining <= 5 ? "text-amber-400" : "text-neutral-300"
                )}>
                  {remaining}/{limit}
                </span>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-neutral-800 rounded-lg transition-colors"
              >
                {userData?.photoURL ? (
                  <img src={userData.photoURL} alt="" className="w-7 h-7 rounded-full" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center">
                    <User className="w-4 h-4 text-neutral-400" />
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-neutral-900 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-neutral-800">
                      <p className="font-medium text-sm text-white truncate">{userData?.displayName}</p>
                      <p className="text-xs text-neutral-500 truncate">{userData?.email}</p>
                    </div>
                    {userData?.role === "admin" && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push("/admin");
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-800 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm">Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-800 transition-colors text-left text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">ออกจากระบบ</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-violet-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                สวัสดี, {userData?.displayName?.split(" ")[0]}
              </h2>
              <p className="text-neutral-500 text-center max-w-md mb-8">
                {settings?.chat.welcomeMessage || "ฉันคือ Chatbot ผู้ช่วยของ sodbd2.pics ถามข้อมูลเกี่ยวกับฝ่ายโสตและโรงเรียน บ.ด.๒ ได้เลย"}
              </p>
              
              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "ฝ่ายโสตคืออะไร?",
                  "มีสมาชิกกี่คน?",
                  "ที่อยู่โรงเรียน",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-sm text-neutral-300 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <div className="py-4 space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4",
                    msg.role === "user" ? "flex justify-end" : ""
                  )}
                >
                  {msg.role === "assistant" ? (
                    <div className="flex gap-3">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shrink-0 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 prose prose-invert prose-sm max-w-none">
                        <p className="text-neutral-200 leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] bg-neutral-800 rounded-2xl rounded-br-md px-4 py-3">
                      <p className="text-neutral-100 text-sm whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="px-4">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex items-center gap-1 py-2">
                      <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="px-4 flex justify-center">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <div className="border-t border-neutral-800 bg-neutral-900/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์ข้อความ..."
              maxLength={settings?.chat.maxMessageLength || 250}
              disabled={isLoading || remaining === 0}
              rows={1}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl py-3 pl-4 pr-24 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:border-neutral-600 disabled:opacity-50 placeholder:text-neutral-500"
            />
            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <span className={cn(
                "text-[11px] tabular-nums",
                input.length >= (settings?.chat.maxMessageLength || 250) - 10 ? "text-red-400" : "text-neutral-600"
              )}>
                {input.length}/{settings?.chat.maxMessageLength || 250}
              </span>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-white text-black rounded-xl hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
          <p className="text-center text-[11px] text-neutral-600 mt-2">
            {remaining === 0 ? (
              <span className="text-amber-400">หมดโควต้าแล้ว กรุณารอ {settings?.rateLimit.windowHours || 24} ชั่วโมง</span>
            ) : (
              "Chatbot อาจให้ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบข้อมูลสำคัญอีกครั้ง"
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

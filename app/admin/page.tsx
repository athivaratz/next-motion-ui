"use client";

import { useAuth, UserData } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  getDoc,
  setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Users, 
  Shield, 
  Ban, 
  CheckCircle, 
  Loader2, 
  ArrowLeft,
  Search,
  UserCheck,
  UserX,
  Crown,
  RefreshCw,
  Settings,
  MessageSquare,
  Clock,
  Save,
  AlertTriangle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SystemSettings, defaultSettings } from "@/lib/settings";

interface UserWithId extends UserData {
  id: string;
}

type TabType = "users" | "settings";

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  
  // Users state
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "banned">("all");
  const [updating, setUpdating] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<SystemSettings>(defaultSettings);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (userData?.role !== "admin") {
        router.push("/chat");
      }
    }
  }, [user, userData, loading, router]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const usersData: UserWithId[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          photoURL: data.photoURL,
          role: data.role || "user",
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLoginAt: data.lastLoginAt?.toDate() || new Date(),
          isApproved: data.isApproved || false,
        });
      });
      
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSettings = async () => {
    setLoadingSettings(true);
    try {
      const settingsRef = doc(db, "settings", "system");
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        setSettings({ ...defaultSettings, ...settingsSnap.data() } as SystemSettings);
      } else {
        await setDoc(settingsRef, defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const settingsRef = doc(db, "settings", "system");
      await setDoc(settingsRef, settings);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    if (userData?.role === "admin") {
      fetchUsers();
      fetchSettings();
    }
  }, [userData]);

  const updateUserStatus = async (userId: string, updates: Partial<UserData>) => {
    setUpdating(userId);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, updates);
      
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
      );
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !u.isApproved && u.role !== "banned") ||
      (filter === "approved" && u.isApproved) ||
      (filter === "banned" && u.role === "banned");

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: users.length,
    pending: users.filter((u) => !u.isApproved && u.role !== "banned").length,
    approved: users.filter((u) => u.isApproved).length,
    banned: users.filter((u) => u.role === "banned").length,
  };

  if (loading || (loadingUsers && loadingSettings)) {
    return (
      <main className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/chat")}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-neutral-400" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full font-medium">
                  BETA
                </span>
              </div>
              <p className="text-neutral-500 text-sm">จัดการระบบ Chatbot</p>
            </div>
          </div>
          <button
            onClick={() => activeTab === "users" ? fetchUsers() : fetchSettings()}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            รีเฟรช
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-neutral-900 rounded-lg w-fit mb-6">
          <button
            onClick={() => setActiveTab("users")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === "users"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <Users className="w-4 h-4" />
            ผู้ใช้งาน
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === "settings"
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <Settings className="w-4 h-4" />
            ตั้งค่าระบบ
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: "ทั้งหมด", value: stats.total, color: "neutral" },
                { label: "รออนุมัติ", value: stats.pending, color: "amber" },
                { label: "อนุมัติแล้ว", value: stats.approved, color: "emerald" },
                { label: "ถูกแบน", value: stats.banned, color: "red" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
                >
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-700"
                />
              </div>
              <div className="flex gap-1 bg-neutral-900 p-1 rounded-lg">
                {(["all", "pending", "approved", "banned"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-sm transition-colors",
                      filter === f
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-500 hover:text-white"
                    )}
                  >
                    {f === "all" && "ทั้งหมด"}
                    {f === "pending" && "รออนุมัติ"}
                    {f === "approved" && "อนุมัติแล้ว"}
                    {f === "banned" && "ถูกแบน"}
                  </button>
                ))}
              </div>
            </div>

            {/* Users List */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800 text-left">
                      <th className="py-3 px-4 text-neutral-500 font-medium text-sm">ผู้ใช้</th>
                      <th className="py-3 px-4 text-neutral-500 font-medium text-sm">สถานะ</th>
                      <th className="py-3 px-4 text-neutral-500 font-medium text-sm">บทบาท</th>
                      <th className="py-3 px-4 text-neutral-500 font-medium text-sm text-right">การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {u.photoURL ? (
                              <img src={u.photoURL} alt="" className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center">
                                <Users className="w-4 h-4 text-neutral-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm flex items-center gap-1.5">
                                {u.displayName}
                                {u.role === "admin" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                              </p>
                              <p className="text-xs text-neutral-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {u.role === "banned" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                              <Ban className="w-3 h-3" /> ถูกแบน
                            </span>
                          ) : u.isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                              <CheckCircle className="w-3 h-3" /> อนุมัติแล้ว
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                              <Clock className="w-3 h-3" /> รออนุมัติ
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-neutral-400">
                            {u.role === "admin" ? "ผู้ดูแล" : "ผู้ใช้"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {updating === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
                            ) : (
                              <>
                                {!u.isApproved && u.role !== "banned" && (
                                  <button
                                    onClick={() => updateUserStatus(u.id, { isApproved: true })}
                                    className="p-1.5 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors"
                                    title="อนุมัติ"
                                  >
                                    <UserCheck className="w-4 h-4" />
                                  </button>
                                )}
                                {u.isApproved && u.role !== "admin" && (
                                  <button
                                    onClick={() => updateUserStatus(u.id, { isApproved: false })}
                                    className="p-1.5 hover:bg-amber-500/20 text-amber-400 rounded transition-colors"
                                    title="ยกเลิกการอนุมัติ"
                                  >
                                    <UserX className="w-4 h-4" />
                                  </button>
                                )}
                                {u.role !== "admin" && u.role !== "banned" && (
                                  <button
                                    onClick={() => updateUserStatus(u.id, { role: "banned", isApproved: false })}
                                    className="p-1.5 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                                    title="แบน"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </button>
                                )}
                                {u.role === "banned" && (
                                  <button
                                    onClick={() => updateUserStatus(u.id, { role: "user" })}
                                    className="p-1.5 hover:bg-neutral-700 text-neutral-400 rounded transition-colors"
                                    title="ยกเลิกการแบน"
                                  >
                                    <Shield className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredUsers.length === 0 && (
                <div className="py-12 text-center text-neutral-500 text-sm">
                  ไม่พบผู้ใช้ที่ตรงกับการค้นหา
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Rate Limit Settings */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Rate Limit</h3>
                  <p className="text-sm text-neutral-500">กำหนดจำนวนคำถามที่ผู้ใช้สามารถถามได้</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    จำนวนคำถามสูงสุด (ต่อคน)
                  </label>
                  <input
                    type="number"
                    value={settings.rateLimit.maxRequests}
                    onChange={(e) => setSettings({
                      ...settings,
                      rateLimit: { ...settings.rateLimit, maxRequests: parseInt(e.target.value) || 10 }
                    })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    ช่วงเวลา (ชั่วโมง)
                  </label>
                  <input
                    type="number"
                    value={settings.rateLimit.windowHours}
                    onChange={(e) => setSettings({
                      ...settings,
                      rateLimit: { ...settings.rateLimit, windowHours: parseInt(e.target.value) || 24 }
                    })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
                  />
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                ตัวอย่าง: {settings.rateLimit.maxRequests} คำถาม ต่อ {settings.rateLimit.windowHours} ชั่วโมง
              </p>
            </div>

            {/* Chat Settings */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">การตั้งค่า Chat</h3>
                  <p className="text-sm text-neutral-500">ปรับแต่งการทำงานของ Chatbot</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    ความยาวข้อความสูงสุด (ตัวอักษร)
                  </label>
                  <input
                    type="number"
                    value={settings.chat.maxMessageLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      chat: { ...settings.chat, maxMessageLength: parseInt(e.target.value) || 250 }
                    })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    ข้อความต้อนรับ
                  </label>
                  <textarea
                    value={settings.chat.welcomeMessage}
                    onChange={(e) => setSettings({
                      ...settings,
                      chat: { ...settings.chat, welcomeMessage: e.target.value }
                    })}
                    rows={3}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">โหมดซ่อมบำรุง</h3>
                    <p className="text-sm text-neutral-500">ปิดระบบ Chatbot ชั่วคราว</p>
                  </div>
                </div>
                <button
                  onClick={() => setSettings({
                    ...settings,
                    maintenance: { ...settings.maintenance, enabled: !settings.maintenance.enabled }
                  })}
                  className="p-1"
                >
                  {settings.maintenance.enabled ? (
                    <ToggleRight className="w-10 h-10 text-amber-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-10 text-neutral-600" />
                  )}
                </button>
              </div>
              
              {settings.maintenance.enabled && (
                <div>
                  <label className="block text-sm text-neutral-400 mb-2">
                    ข้อความแจ้งเตือน
                  </label>
                  <input
                    type="text"
                    value={settings.maintenance.message}
                    onChange={(e) => setSettings({
                      ...settings,
                      maintenance: { ...settings.maintenance, message: e.target.value }
                    })}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-neutral-600"
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3">
              {settingsSaved && (
                <span className="text-sm text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> บันทึกแล้ว
                </span>
              )}
              <button
                onClick={saveSettings}
                disabled={savingSettings}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-lg font-medium hover:bg-neutral-200 disabled:opacity-50 transition-colors"
              >
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

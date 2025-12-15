import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface SystemSettings {
  rateLimit: {
    maxRequests: number;      // จำนวนคำถามสูงสุดต่อคน
    windowHours: number;      // ช่วงเวลา (ชั่วโมง)
  };
  chat: {
    maxMessageLength: number; // ความยาวข้อความสูงสุด
    welcomeMessage: string;   // ข้อความต้อนรับ
  };
  maintenance: {
    enabled: boolean;         // โหมดซ่อมบำรุง
    message: string;          // ข้อความแจ้งเตือน
  };
}

export const defaultSettings: SystemSettings = {
  rateLimit: {
    maxRequests: 10,
    windowHours: 24,
  },
  chat: {
    maxMessageLength: 250,
    welcomeMessage: "สวัสดี! ฉันคือ Chatbot ผู้ช่วยของ sodbd2.pics พร้อมตอบคำถามเกี่ยวกับฝ่ายโสตและโรงเรียน บ.ด.๒",
  },
  maintenance: {
    enabled: false,
    message: "ระบบกำลังปรับปรุง กรุณากลับมาใหม่ภายหลัง",
  },
};

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const settingsRef = doc(db, "settings", "system");
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return { ...defaultSettings, ...settingsSnap.data() } as SystemSettings;
    }
    
    // Create default settings if not exists
    await setDoc(settingsRef, defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return defaultSettings;
  }
}

export async function updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
  try {
    const settingsRef = doc(db, "settings", "system");
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
}

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { websiteKnowledge } from "@/lib/knowledge";
import { getAdminDb, verifyUserToken } from "@/lib/firebase-admin";
import { SystemSettings, defaultSettings } from "@/lib/settings";

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Get system settings from Firestore using Admin SDK
async function getSystemSettings(): Promise<SystemSettings> {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return defaultSettings;
    }
    const settingsDoc = await adminDb.collection("settings").doc("system").get();
    if (settingsDoc.exists) {
      return settingsDoc.data() as SystemSettings;
    }
    return defaultSettings;
  } catch (error) {
    // Silent fallback to defaults - no error logging needed
    return defaultSettings;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 🔐 SECURITY: Verify user authentication
    const authHeader = req.headers.get("authorization");
    const authResult = await verifyUserToken(authHeader);
    
    if (!authResult.valid) {
      return NextResponse.json(
        { error: authResult.error || "Unauthorized" },
        { status: 401 }
      );
    }

    // Get settings from Firestore
    const settings = await getSystemSettings();

    // Check maintenance mode
    if (settings.maintenance.enabled) {
      return NextResponse.json(
        { error: settings.maintenance.message || "ระบบอยู่ในโหมดบำรุงรักษา" },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { message } = body;

    // 1. Input Validation
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    if (message.length > settings.chat.maxMessageLength) {
      return NextResponse.json(
        { error: `ข้อความเกิน ${settings.chat.maxMessageLength} ตัวอักษร` },
        { status: 400 }
      );
    }

    // 2. Dynamic Rate Limiting based on settings
    const ratelimit = new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(
        settings.rateLimit.maxRequests,
        `${settings.rateLimit.windowHours} h`
      ),
    });

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { 
          error: `คุณใช้งานเกินจำนวนที่กำหนด (${settings.rateLimit.maxRequests} ข้อความ/${settings.rateLimit.windowHours} ชั่วโมง)`,
          remaining: 0,
          limit: settings.rateLimit.maxRequests,
        },
        { status: 429, headers: { "Retry-After": reset.toString() } }
      );
    }

    // 3. Chatbot Logic with Gemini
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: `คุณคือ Chatbot ผู้ช่วยของเว็บ sodbd2.pics ตอบคำถามโดยใช้ข้อมูลที่ให้ไปเท่านั้น 
ถ้าไม่มีข้อมูลให้ตอบว่าไม่ทราบ ห้ามแต่งเรื่องเอง
ตอบเป็นภาษาไทยเสมอ ยกเว้นชื่อเฉพาะ

ข้อมูลเว็บไซต์:
${websiteKnowledge}`,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 500,
      },
    });

    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ 
      response: text,
      remaining: remaining,
      limit: settings.rateLimit.maxRequests,
    });

  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}

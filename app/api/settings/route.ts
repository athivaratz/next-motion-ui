import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { defaultSettings, SystemSettings } from "@/lib/settings";

export async function GET() {
  try {
    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(defaultSettings);
    }

    const settingsDoc = await adminDb.collection("settings").doc("system").get();
    if (settingsDoc.exists) {
      const settings = settingsDoc.data() as SystemSettings;
      // ส่งเฉพาะข้อมูลที่จำเป็นสำหรับ client
      return NextResponse.json({
        rateLimit: settings.rateLimit,
        chat: settings.chat,
        maintenance: settings.maintenance,
      });
    }

    return NextResponse.json(defaultSettings);
  } catch (error) {
    return NextResponse.json(defaultSettings);
  }
}

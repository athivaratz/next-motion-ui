# SOD Chatbot 🤖

Chatbot ผู้ช่วยสำหรับเว็บไซต์ **sodbd2.pics** ฝ่ายโสตทัศนศึกษา โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๒

## ✨ Features

- 💬 **AI Chatbot** - ขับเคลื่อนด้วย Google Gemini 2.0 Flash
- 🔐 **Firebase Auth** - เข้าสู่ระบบด้วย Google
- 👥 **User Approval System** - ต้องได้รับการอนุมัติก่อนใช้งาน
- ⚡ **Rate Limiting** - จำกัดจำนวนคำถามด้วย Upstash Redis
- 🛠️ **Admin Dashboard** - จัดการผู้ใช้และการตั้งค่าระบบ
- 🎨 **Modern UI** - ดีไซน์ minimal สไตล์ ChatGPT/Gemini

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini 2.0 Flash
- **Auth & Database**: Firebase (Auth + Firestore)
- **Rate Limiting**: Upstash Redis

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/nextjs-boilerplate.git
cd nextjs-boilerplate

# Install dependencies
bun install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
bun run dev
```

## ⚙️ Environment Variables

ดูตัวอย่างใน `.env.example`

| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Google Gemini API Key |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase config (Client) |
| `UPSTASH_REDIS_*` | Upstash Redis credentials |

## 🔥 Firebase Setup

1. สร้างโปรเจกต์ใน [Firebase Console](https://console.firebase.google.com/)
2. เปิดใช้งาน **Authentication** > **Google Provider**
3. สร้าง **Firestore Database**
4. ตั้ง Firestore Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    match /settings/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## 🚢 Deploy on Vercel

1. Push โค้ดไปยัง GitHub
2. Import โปรเจกต์ใน [Vercel](https://vercel.com/)
3. เพิ่ม Environment Variables ใน Settings
4. Deploy!

## 📝 License

MIT License

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let app: App;
let adminDb: Firestore;
let adminAuth: Auth;

function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    // ใช้ service account credentials
    // ถ้าไม่มี FIREBASE_SERVICE_ACCOUNT ให้ใช้ default credentials
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      // Fallback: ใช้ project ID อย่างเดียว (จะใช้ default settings)
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
  } else {
    app = getApps()[0];
  }
  
  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
  return { app, adminDb, adminAuth };
}

// Export initialized instances
export function getAdminDb(): Firestore | null {
  try {
    if (!adminDb) {
      initializeFirebaseAdmin();
    }
    return adminDb;
  } catch (error) {
    console.warn("Firebase Admin not configured, using default settings");
    return null;
  }
}

export function getAdminAuth(): Auth | null {
  try {
    if (!adminAuth) {
      initializeFirebaseAdmin();
    }
    return adminAuth;
  } catch (error) {
    console.warn("Firebase Admin Auth not configured");
    return null;
  }
}

// Verify Firebase ID token and check if user is approved
export async function verifyUserToken(authHeader: string | null): Promise<{
  valid: boolean;
  uid?: string;
  error?: string;
}> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "Missing authorization header" };
  }

  const token = authHeader.split("Bearer ")[1];
  
  try {
    const auth = getAdminAuth();
    if (!auth) {
      // If Admin SDK not configured, allow request (fallback mode)
      return { valid: true };
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    // Check if user is approved in Firestore
    const db = getAdminDb();
    if (db) {
      const userDoc = await db.collection("users").doc(decodedToken.uid).get();
      if (!userDoc.exists) {
        return { valid: false, error: "User not found" };
      }
      const userData = userDoc.data();
      if (!userData?.isApproved) {
        return { valid: false, error: "User not approved" };
      }
      if (userData?.isBanned) {
        return { valid: false, error: "User is banned" };
      }
    }

    return { valid: true, uid: decodedToken.uid };
  } catch (error) {
    return { valid: false, error: "Invalid token" };
  }
}

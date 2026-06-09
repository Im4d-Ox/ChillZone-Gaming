import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Only initialize Firebase if credentials are available
let app: any = null;
let auth: any = null;
let db: any = null;

if (firebaseConfig.apiKey && firebaseConfig.projectId) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

// Admin email - you can change this to your admin email
const ADMIN_EMAIL = "ctnimad@gmail.com";

export async function isAdminUser(user: any): Promise<boolean> {
  if (!user?.email) return false;
  
  // Check if user's email matches admin email
  if (user.email === ADMIN_EMAIL) return true;
  
  // Alternatively, check Firestore for admin role
  if (!db) return false;
  
  try {
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export { app, auth, db, ADMIN_EMAIL };

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA76BF-YNt7iaguJEK4ZYtB4tspE7Q9OjU",
  authDomain: "chillzone-gaming.firebaseapp.com",
  projectId: "chillzone-gaming",
  storageBucket: "chillzone-gaming.firebasestorage.app",
  messagingSenderId: "897378506689",
  appId: "1:897378506689:web:ff4e51e046cb379ac68140",
  measurementId: "G-5W46WNGERV"
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;
let isFirebaseInitialized = false;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Initialize analytics only in browser
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  isFirebaseInitialized = true;
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
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

export { app, auth, db, analytics, ADMIN_EMAIL, isFirebaseInitialized };

const firebaseConfig = {
  apiKey: "AIzaSyA76BF-YNt7iaguJEK4ZYtB4tspE7Q9OjU",
  authDomain: "chillzone-gaming.firebaseapp.com",
  projectId: "chillzone-gaming",
  storageBucket: "chillzone-gaming.firebasestorage.app",
  messagingSenderId: "897378506689",
  appId: "1:897378506689:web:ff4e51e046cb379ac68140",
  measurementId: "G-5W46WNGERV"
};

// Firebase instances
let app: any = null;
let auth: any = null;
let db: any = null;
let analytics: any = null;
let isFirebaseInitialized = false;

// Initialize Firebase only on client side with dynamic imports
if (typeof window !== 'undefined') {
  try {
    const { initializeApp, getApps, getApp } = require("firebase/app");
    const { getAuth } = require("firebase/auth");
    const { getFirestore } = require("firebase/firestore");
    const { getAnalytics } = require("firebase/analytics");
    
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    analytics = getAnalytics(app);
    isFirebaseInitialized = true;
    console.log("Firebase initialized successfully");
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
    const { doc, getDoc } = require("firebase/firestore");
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    return adminDoc.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export { app, auth, db, analytics, ADMIN_EMAIL, isFirebaseInitialized };

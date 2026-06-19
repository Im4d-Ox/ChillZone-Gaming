import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA76BF-YNt7iaguJEK4ZYtB4tspE7Q9OjU",
  authDomain: "chillzone-gaming.firebaseapp.com",
  projectId: "chillzone-gaming",
  storageBucket: "chillzone-gaming.firebasestorage.app",
  messagingSenderId: "897378506689",
  appId: "1:897378506689:web:ff4e51e046cb379ac68140",
  measurementId: "G-5W46WNGERV",
};

// Initialize Firebase (SSR-safe singleton)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Only create services AFTER app exists
const auth = getAuth(app);
const db = getFirestore(app);

// ❌ REMOVE analytics from here (causes build/prerender crash in Next.js)
// If you need it, use a client-only component.

const ADMIN_EMAIL = "ctnimad@gmail.com";

/**
 * Check admin user safely (works in client + server)
 */
export async function isAdminUser(user: any): Promise<boolean> {
  if (!user?.email) return false;

  // Fast check
  if (user.email === ADMIN_EMAIL) return true;

  // Firestore role check
  try {
    const ref = doc(db, "admins", user.uid);
    const snap = await getDoc(ref);
    return snap.exists();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

export { app, auth, db, ADMIN_EMAIL };
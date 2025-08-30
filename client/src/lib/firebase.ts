import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "620932784062",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-V3WKGLZ79G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Restricted email for admin access
const ALLOWED_ADMIN_EMAIL = "securepay.production@gmail.com";

// Auth functions
export const signInAdmin = async (email: string, password: string) => {
  // Check if email is allowed before attempting sign in
  if (email !== ALLOWED_ADMIN_EMAIL) {
    throw new Error("Access denied. Only authorized admin accounts can sign in.");
  }
  
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Convert Firebase errors to user-friendly messages
    switch (error.code) {
      case 'auth/user-not-found':
        throw new Error("No admin account found with this email address.");
      case 'auth/wrong-password':
        throw new Error("Incorrect password. Please try again.");
      case 'auth/invalid-email':
        throw new Error("Invalid email address format.");
      case 'auth/too-many-requests':
        throw new Error("Too many failed login attempts. Please try again later.");
      default:
        throw new Error("Login failed. Please check your credentials and try again.");
    }
  }
};

export const signOutAdmin = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

export const isValidAdminEmail = (email: string) => {
  return email === ALLOWED_ADMIN_EMAIL;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    // Double-check email restriction even for auth state changes
    if (user && !isValidAdminEmail(user.email || "")) {
      signOutAdmin(); // Force sign out if unauthorized email
      callback(null);
    } else {
      callback(user);
    }
  });
};
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp
let auth: Auth
let db: Firestore

const getFirebaseConfig = () => {
  return {
    apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  }
}

export const useFirebase = () => {
  if (!app) {
    app = initializeApp(getFirebaseConfig())
    auth = getAuth(app)
    db = getFirestore(app)
  }

  return {
    app,
    auth,
    db
  }
}
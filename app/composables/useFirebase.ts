import { initializeApp, type FirebaseApp, getApps } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

const getFirebaseConfig = () => {
  const config = useRuntimeConfig()
  return {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  }
}

export const useFirebase = () => {
  if (!app) {
    // Check if Firebase is already initialized
    const existingApps = getApps()
    if (existingApps.length > 0) {
      app = existingApps[0]!
    } else {
      let config = getFirebaseConfig()
      console.log(config)
      app = initializeApp(config)
      console.log(app)
    }
    auth = getAuth(app)
    db = getFirestore(app)
  }

  return {
    app: app!,
    auth: auth!,
    db: db!
  }
}
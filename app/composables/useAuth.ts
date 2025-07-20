import { ref, computed, readonly } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  type User
} from 'firebase/auth'
import { useFirebase } from './useFirebase'

const USER_COOKIE_KEY = 'auth_user'
const TOKEN_COOKIE_KEY = 'auth_token'

const setCookie = (name: string, value: string, days: number = 30) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c?.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c?.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

const user = ref<User | null>(null)
const loading = ref(true)
let authInitialized = false

export const useAuth = () => {
  const { auth } = useFirebase()

  const isAuthenticated = computed(() => !!user.value)

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await saveUserToCookies(result.user)
      return { user: result.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await saveUserToCookies(result.user)
      return { user: result.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      clearUserFromCookies()
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await saveUserToCookies(result.user)
      return { user: result.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const saveUserToCookies = async (firebaseUser: User) => {
    try {
      const token = await firebaseUser.getIdToken()
      setCookie(TOKEN_COOKIE_KEY, token)
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      }
      setCookie(USER_COOKIE_KEY, JSON.stringify(userData))
    } catch (error) {
      console.error('Error saving user to cookies:', error)
    }
  }

  const clearUserFromCookies = () => {
    deleteCookie(USER_COOKIE_KEY)
    deleteCookie(TOKEN_COOKIE_KEY)
  }

  const loadUserFromCookies = (): User | null => {
    try {
      const userCookie = getCookie(USER_COOKIE_KEY)
      const tokenCookie = getCookie(TOKEN_COOKIE_KEY)
      
      if (!userCookie || !tokenCookie) {
        return null
      }

      const userData = JSON.parse(userCookie)
      return userData as User
    } catch (error) {
      console.error('Error loading user from cookies:', error)
      clearUserFromCookies()
      return null
    }
  }


  const initAuth = () => {
    if (!authInitialized) {
      const savedUser = loadUserFromCookies()
      if (savedUser) {
        user.value = savedUser
      }
      
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          await saveUserToCookies(firebaseUser)
          user.value = firebaseUser
        } else {
          clearUserFromCookies()
          user.value = null
        }
        loading.value = false
      })
      authInitialized = true
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    isAuthenticated,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    initAuth
  }
}
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

const user = ref<User | null>(null)
const loading = ref(true)
let authInitialized = false

export const useAuth = () => {
  const { auth } = useFirebase()

  const isAuthenticated = computed(() => !!user.value)

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return { user: result.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { error: null }
    } catch (error: any) {
      return { error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return { user: result.user, error: null }
    } catch (error: any) {
      return { user: null, error: error.message }
    }
  }


  const initAuth = () => {
    if (!authInitialized) {
      onAuthStateChanged(auth, (firebaseUser) => {
        user.value = firebaseUser
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
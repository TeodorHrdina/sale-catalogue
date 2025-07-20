<template>
  <div v-if="isOpen" class="login-overlay" @click="closePopup">
    <div class="login-popup" @click.stop>
      <div class="login-header">
        <h2>{{ isSignUp ? 'Sign Up' : 'Sign In' }}</h2>
        <button class="close-btn" @click="closePopup">&times;</button>
      </div>
      
      <div class="login-content">
        <div class="social-login">
          <button class="google-btn" @click="handleGoogleSignIn">
            <Icon name="logos:google-icon" />
            Continue with Google
          </button>
        </div>
        
        <div class="divider">
          <span>or</span>
        </div>
        
        <form @submit.prevent="handleEmailLogin" class="email-form">
          <div class="form-group">
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              required
              class="form-input"
            />
          </div>
          
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          
          <button 
            type="submit" 
            class="login-btn"
            :disabled="loading"
          >
            {{ loading ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In') }}
          </button>
        </form>
        
        <div class="signup-link">
          <p>Don't have an account? 
            <button @click="toggleMode" class="link-btn">
              {{ isSignUp ? 'Sign In' : 'Sign Up' }}
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { fetchSignInMethodsForEmail } from 'firebase/auth'
import { useFirebase } from '~/composables/useFirebase'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'success'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { signIn, signUp, signInWithGoogle } = useAuth()
const { auth } = useFirebase()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const isSignUp = ref(false)

const closePopup = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  email.value = ''
  password.value = ''
  error.value = ''
  loading.value = false
  isSignUp.value = false
}

const toggleMode = () => {
  isSignUp.value = !isSignUp.value
  error.value = ''
}

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email)
    return signInMethods.length > 0
  } catch (error) {
    return false
  }
}

const handleEmailLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (isSignUp.value) {
      // Check if email already exists before attempting signup
      const emailExists = await checkEmailExists(email.value)
      if (emailExists) {
        error.value = 'An account with this email already exists. Please sign in instead.'
        return
      }
      
      const result = await signUp(email.value, password.value)
      if (result.error) {
        error.value = result.error
      } else {
        emit('success')
        closePopup()
      }
    } else {
      const result = await signIn(email.value, password.value)
      if (result.error) {
        error.value = result.error
      } else {
        emit('success')
        closePopup()
      }
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await signInWithGoogle()
    if (result.error) {
      error.value = result.error
    } else {
      emit('success')
      closePopup()
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-popup {
  background: white;
  border-radius: 12px;
  padding: 0;
  width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px 0;
}

.login-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f3f4f6;
}

.login-content {
  padding: 32px;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.google-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}


.divider {
  position: relative;
  margin: 24px 0;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  text-align: center;
  padding: 8px;
  background: #fef2f2;
  border-radius: 6px;
  border: 1px solid #fecaca;
}

.login-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #2563eb;
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
}

.link-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.link-btn:hover {
  color: #2563eb;
}
</style>
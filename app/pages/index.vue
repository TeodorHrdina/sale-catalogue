<template>
  <div class="landing-page">
    <header class="header">
      <h1>Sale Catalogue</h1>
      <div class="auth-section">
        <template v-if="isAuthenticated">
          <LoginButton :user="user" @click="handleUserMenu" />
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </template>
        <template v-else>
          <LoginButton @click="showLogin = true" />
        </template>
      </div>
    </header>
    
    <main class="main-content">
      <h2>Welcome to Sale Catalogue</h2>
      <p>Your one-stop shop for all your needs</p>
    </main>
    
    <LoginPopup 
      :is-open="showLogin" 
      @close="showLogin = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import LoginPopup from '~/components/LoginPopup.vue'
import LoginButton from '~/components/LoginButton.vue'

const { user, isAuthenticated, logout, initAuth } = useAuth()
const showLogin = ref(false)

const handleLoginSuccess = () => {
  console.log('Login successful!')
}

const handleLogout = async () => {
  await logout()
}

const handleUserMenu = () => {
  // Could show user menu/profile dropdown here
  console.log('User menu clicked')
}

onMounted(() => {
  initAuth()
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  padding: 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #4b5563;
}

.main-content {
  text-align: center;
  padding: 4rem 2rem;
}

.main-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.main-content p {
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}
</style>
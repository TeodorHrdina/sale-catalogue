<template>
  <div class="landing-page">
    <header class="header">
      <h1>Sale Catalogue</h1>
      <div class="auth-section">
        <LoginButton :user="user" @login="showLogin = true" @logout="handleLogout" />
      </div>
    </header>
    
    <main class="main-content">
      <div class="hero-section">
        <h2>Welcome to Sale Catalogue</h2>
        <p>Your one-stop shop for all your technology needs</p>
      </div>
      
      <div class="browse-section">
        <div class="container">
          <CategorySelector 
            v-model="selectedCategory" 
            label="Browse by Category"
          />
          
          <Catalogue 
            :selected-category="selectedCategory"
            :title="getCatalogueTitle()"
          />
        </div>
      </div>
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
import { Category } from '~/types'
import LoginPopup from '~/components/LoginPopup.vue'
import LoginButton from '~/components/LoginButton.vue'
import CategorySelector from '~/components/CategorySelector.vue'
import Catalogue from '~/components/Catalogue.vue'

const { user, isAuthenticated, logout, initAuth } = useAuth()
const showLogin = ref(false)
const selectedCategory = ref(null)

const handleLoginSuccess = () => {
  console.log('Login successful!')
}

const handleLogout = async () => {
  await logout()
}

const getCatalogueTitle = () => {
  if (!selectedCategory.value) {
    return 'All Products'
  }
  return `${selectedCategory.value} Products`
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
  min-height: calc(100vh - 80px);
}

.hero-section {
  text-align: center;
  padding: 4rem 2rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.hero-section p {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.browse-section {
  background: #f9fafb;
  min-height: 60vh;
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 1rem 1.5rem;
  }
  
  .hero-section h2 {
    font-size: 2rem;
  }
  
  .hero-section p {
    font-size: 1.1rem;
  }
  
  .browse-section {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
}
</style>
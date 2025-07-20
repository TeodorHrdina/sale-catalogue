<template>
  <div class="login-container" ref="container">
    <button @click="handleClick" class="login-btn">
      <div v-if="user && user.photoURL" class="profile-picture">
        <img :src="user.photoURL" alt="user.displayName || user.email" />
      </div>
      <Icon v-else name="material-symbols:account-circle-outline" size="1.25rem" />
      {{ user ? (user.displayName || user.email) : 'Sign In' }}
      <Icon v-if="user" name="material-symbols:expand-more" size="1rem" class="dropdown-icon" :class="{ 'rotated': showDropdown }" />
    </button>
    
    <div v-if="user && showDropdown" class="dropdown">
      <button @click="handleLogout" class="dropdown-item">
        <Icon name="material-symbols:logout" size="1rem" />
        Logout
      </button>
      <slot name="dropdown-items" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from 'firebase/auth'
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  user?: User | null
}

const props = defineProps<Props>()
const emit = defineEmits(['login', 'logout'])

const showDropdown = ref(false)
const container = ref<HTMLElement>()

const handleClick = () => {
  if (!props.user) {
    emit('login')
  } else {
    showDropdown.value = !showDropdown.value
  }
}

const handleLogout = () => {
  emit('logout')
  showDropdown.value = false
}

const closeDropdown = (event: Event) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}


onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.login-container {
  position: relative;
  display: inline-block;
}

.login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background: #2563eb;
}

.dropdown-icon {
  transition: transform 0.2s;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 160px;
  margin-top: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: #f9fafb;
}

.dropdown-item:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}

.profile-picture {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
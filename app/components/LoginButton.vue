<template>
  <button @click="$emit('click')" class="login-btn">
    <div v-if="user && user.photoURL" class="profile-picture">
      <img :src="user.photoURL" alt="user.displayName || user.email" />
    </div>
    <Icon v-else name="material-symbols:account-circle-outline" size="1.25rem" />
    {{ user ? (user.displayName || user.email) : 'Sign In' }}
  </button>
</template>

<script setup lang="ts">
import type { User } from 'firebase/auth'

interface Props {
  user?: User | null
}

defineProps<Props>()
defineEmits(['click'])
</script>

<style scoped>
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
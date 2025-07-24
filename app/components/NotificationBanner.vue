<template>
  <Teleport to="body">
    <div class="notification-container">
      <TransitionGroup name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification', `notification--${notification.type}`]"
        >
          <div class="notification__content">
            <span class="notification__icon">
              {{ getIcon(notification.type) }}
            </span>
            <span class="notification__message">
              {{ notification.message }}
            </span>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="notification__close"
          >
            ×
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotifications } from '~/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

const getIcon = (type) => {
  switch (type) {
    case 'success': return '✓'
    case 'error': return '✗'
    case 'warning': return '⚠'
    case 'info': return 'ℹ'
    default: return 'ℹ'
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
  min-width: 300px;
}

.notification--success {
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border-left: 4px solid #16a34a;
}

.notification--error {
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border-left: 4px solid #dc2626;
}

.notification--warning {
  background: rgba(245, 158, 11, 0.9);
  color: white;
  border-left: 4px solid #d97706;
}

.notification--info {
  background: rgba(59, 130, 246, 0.9);
  color: white;
  border-left: 4px solid #2563eb;
}

.notification__content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.notification__icon {
  font-size: 1.1rem;
  font-weight: bold;
}

.notification__message {
  flex: 1;
}

.notification__close {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.notification__close:hover {
  opacity: 1;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style>
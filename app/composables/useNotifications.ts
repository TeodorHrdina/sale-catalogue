import { ref, readonly } from 'vue'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

const notifications = ref<Notification[]>([])

export const useNotifications = () => {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString()
    const newNotification = {
      id,
      duration: 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }
  
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }
  
  const showSuccess = (message: string, duration?: number) => {
    return addNotification({ type: 'success', message, duration })
  }
  
  const showError = (message: string, duration?: number) => {
    return addNotification({ type: 'error', message, duration })
  }
  
  const showInfo = (message: string, duration?: number) => {
    return addNotification({ type: 'info', message, duration })
  }
  
  const showWarning = (message: string, duration?: number) => {
    return addNotification({ type: 'warning', message, duration })
  }
  
  const clearAll = () => {
    notifications.value = []
  }
  
  return {
    notifications: readonly(notifications),
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    clearAll
  }
}
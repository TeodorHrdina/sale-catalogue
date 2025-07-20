export const useWebpageState = () => {
  const isDarkMode = ref(false)

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    if (process.client) {
      localStorage.setItem('darkMode', isDarkMode.value.toString())
    }
  }

  const initializeDarkMode = () => {
    if (process.client) {
      const stored = localStorage.getItem('darkMode')
      if (stored) {
        isDarkMode.value = stored === 'true'
      } else {
        isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
    }
  }

  onMounted(() => {
    initializeDarkMode()
  })

  return {
    isDarkMode: readonly(isDarkMode),
    toggleDarkMode
  }
}
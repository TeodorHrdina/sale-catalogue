import { useAuth } from '~/composables/useAuth'
import { useFirestore } from '~/composables/useFirestore'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user, isAuthenticated } = useAuth()
  const { isAdmin } = useFirestore()

  // Check if user is authenticated
  if (!isAuthenticated.value || !user.value) {
    return navigateTo('/')
  }

  // Check if user is admin
  const userIsAdmin = await isAdmin(user.value.uid)
  if (!userIsAdmin) {
    return navigateTo('/')
  }
})
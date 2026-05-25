export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useFetch<{ user: any }>('/api/auth/me', {
    credentials: 'include'
  })

  if (!data.value?.user) {
    return navigateTo('/login')
  }

  if (data.value.user.role !== 'admin') {
    return navigateTo('/dashboard')
  }
})

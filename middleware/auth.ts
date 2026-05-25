export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useFetch<{ user: any }>('/api/auth/me', {
    credentials: 'include'
  })

  if (!data.value?.user) {
    return navigateTo('/login')
  }
})

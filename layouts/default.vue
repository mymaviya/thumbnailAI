<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="group flex items-center gap-3 font-black tracking-tight text-ink">
          <span class="grid size-10 place-items-center rounded-lg bg-ink text-white shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-coral/20">
            <span class="h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-coral" />
          </span>
          <span>AI Thumbnail Maker</span>
        </NuxtLink>
        <div class="hidden items-center gap-1 md:flex">
          <NuxtLink v-for="item in visibleNavItems" :key="item.to" :to="item.to" class="nav-link rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink">
            {{ item.label }}
          </NuxtLink>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink v-if="!user" to="/login" class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-coral hover:text-coral">
            Login
          </NuxtLink>
          <NuxtLink to="/generate" class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-lg">
            Generate
          </NuxtLink>
          <div v-if="user" class="relative flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
            <NuxtLink to="/dashboard" class="flex items-center gap-2 pr-1">
              <img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
                class="size-9 rounded-full object-cover ring-2 ring-coral/20"
              >
              <span v-else class="grid size-9 place-items-center rounded-full bg-ink text-sm font-black text-white">
                {{ userInitial }}
              </span>
              <span class="hidden max-w-28 truncate text-sm font-black text-ink sm:inline">{{ user.name }}</span>
            </NuxtLink>
            <button
              type="button"
              class="rounded-full px-3 py-1.5 text-xs font-black text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="loggingOut"
              @click="logout"
            >
              {{ loggingOut ? '...' : 'Logout' }}
            </button>
          </div>
        </div>
      </nav>
    </header>
    <main class="site-shell">
      <slot />
    </main>
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p class="font-black text-ink">AI Thumbnail Maker</p>
          <p class="mt-2 max-w-sm">SEO-ready thumbnail templates, AI generation, editing, and payment-ready downloads.</p>
          <p class="mt-2 text-xs font-bold text-slate-500">A product by Maviya IT Services.</p>
        </div>
        <div class="flex flex-wrap gap-3 md:justify-center">
          <NuxtLink to="/templates" class="hover:text-coral">Templates</NuxtLink>
          <NuxtLink to="/pricing" class="hover:text-coral">Pricing</NuxtLink>
          <NuxtLink to="/dashboard" class="hover:text-coral">Dashboard</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-coral">Contact</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-coral">Privacy</NuxtLink>
          <NuxtLink to="/terms-and-conditions" class="hover:text-coral">Terms</NuxtLink>
          <NuxtLink to="/cancellation-and-refund-policy" class="hover:text-coral">Refunds</NuxtLink>
          <NuxtLink to="/delivery-policy" class="hover:text-coral">Delivery</NuxtLink>
        </div>
        <p class="md:text-right">Built for 1280x720 YouTube thumbnails.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const loggingOut = ref(false)

const { data: session, refresh: refreshSession } = await useFetch<{ user: any }>('/api/auth/me', {
  credentials: 'include',
  server: true
})

const user = computed(() => session.value?.user || null)
const userInitial = computed(() => String(user.value?.name || user.value?.email || 'U').charAt(0).toUpperCase())

const navItems = [
  { to: '/templates', label: 'Templates' },
  { to: '/generate', label: 'AI Generator' },
  { to: '/editor', label: 'Editor' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/admin', label: 'Admin', adminOnly: true },
  { to: '/login', label: 'Login', guestsOnly: true }
]

const visibleNavItems = computed(() => navItems.filter(item => {
  if (item.adminOnly) return user.value?.role === 'admin'
  if (item.guestsOnly) return !user.value
  return true
}))

watch(() => route.fullPath, () => {
  refreshSession()
})

const logout = async () => {
  loggingOut.value = true
  try {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    await refreshSession()
    await navigateTo('/login')
  } finally {
    loggingOut.value = false
  }
}
</script>

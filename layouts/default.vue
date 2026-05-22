<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-3 font-black tracking-tight text-ink">
          <span class="grid size-10 place-items-center rounded-lg bg-ink text-white">
            <span class="h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-coral" />
          </span>
          <span>AI Thumbnail Maker</span>
        </NuxtLink>
        <div class="hidden items-center gap-1 md:flex">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-ink">
            {{ item.label }}
          </NuxtLink>
        </div>
        <NuxtLink to="/generate" class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-500">
          Generate
        </NuxtLink>
      </nav>
    </header>
    <main>
      <slot />
    </main>
    <footer class="border-t border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-slate-600 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p class="font-black text-ink">AI Thumbnail Maker</p>
          <p class="mt-2 max-w-sm">SEO-ready thumbnail templates, AI generation, editing, and payment-ready downloads.</p>
        </div>
        <div class="flex flex-wrap gap-3 md:justify-center">
          <NuxtLink to="/templates" class="hover:text-coral">Templates</NuxtLink>
          <NuxtLink to="/pricing" class="hover:text-coral">Pricing</NuxtLink>
          <NuxtLink to="/dashboard" class="hover:text-coral">Dashboard</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-coral">Privacy</NuxtLink>
          <NuxtLink to="/terms-and-conditions" class="hover:text-coral">Terms</NuxtLink>
        </div>
        <p class="md:text-right">Built for 1280x720 YouTube thumbnails.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const navItems = [
  { to: '/templates', label: 'Templates' },
  { to: '/generate', label: 'AI Generator' },
  { to: '/editor', label: 'Editor' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/dashboard', label: 'Dashboard' }
]
</script>

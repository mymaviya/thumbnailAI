<template>
  <div>
    <PageHero
      eyebrow="Admin"
      title="Admin Dashboard"
      description="Monitor users, generated thumbnails, payments, downloads, and revenue."
    />

    <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 xl:grid-cols-5 lg:px-8">
      <article v-for="card in cards" :key="card.label" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-black uppercase text-slate-500">{{ card.label }}</p>
        <p class="mt-2 text-3xl font-black text-ink">{{ card.value }}</p>
      </article>
    </section>

    <section class="mx-auto flex max-w-7xl flex-wrap gap-3 px-4 pb-14 sm:px-6 lg:px-8">
      <NuxtLink to="/admin/users" class="rounded-md bg-ink px-4 py-2 text-sm font-bold text-white">Users</NuxtLink>
      <NuxtLink to="/admin/downloads" class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white">Downloads</NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

usePageSeo(
  'Admin Dashboard - AI Thumbnail Maker',
  'Admin summary for AI Thumbnail Maker users, thumbnails, payments, downloads, and revenue.',
  '/admin'
)

const { data } = await useFetch<any>('/api/admin/summary', {
  credentials: 'include'
})

const formatRevenue = (amount: number) => `₹${((amount || 0) / 100).toLocaleString('en-IN')}`
const cards = computed(() => [
  { label: 'Users', value: data.value?.totalUsers || 0 },
  { label: 'Thumbnails', value: data.value?.totalThumbnails || 0 },
  { label: 'Payments', value: data.value?.totalPayments || 0 },
  { label: 'Downloads', value: data.value?.totalDownloads || 0 },
  { label: 'Revenue', value: formatRevenue(data.value?.totalRevenue || 0) }
])
</script>

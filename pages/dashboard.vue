<template>
  <div>
    <PageHero
      eyebrow="Creator dashboard"
      title="My thumbnails and downloads"
      description="Review generated thumbnails, payment status, and secure HD downloads."
    />

    <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
      <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div class="flex items-center gap-4">
          <img v-if="data?.user?.avatar" :src="data.user.avatar" alt="" class="size-14 rounded-full object-cover">
          <div>
            <p class="text-sm font-black uppercase text-slate-500">Signed in</p>
            <h2 class="text-2xl font-black text-ink">{{ data?.user?.name }}</h2>
            <p class="text-sm text-slate-600">{{ data?.user?.email }}</p>
          </div>
        </div>
      </article>
      <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-black uppercase text-slate-500">Generated</p>
        <p class="mt-2 text-4xl font-black">{{ thumbnails.length }}</p>
      </article>
      <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-black uppercase text-slate-500">Paid</p>
        <p class="mt-2 text-4xl font-black">{{ paidCount }}</p>
      </article>
    </section>

    <section class="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
      <div class="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black">Generated thumbnails</h2>
          <p class="mt-1 text-slate-600">Watermarked previews stay visible until payment unlocks the HD file.</p>
        </div>
        <NuxtLink to="/generate" class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white">Generate</NuxtLink>
      </div>

      <div v-if="pending" class="rounded-lg border border-slate-200 bg-white p-6 font-semibold text-slate-600 shadow-sm">Loading dashboard...</div>
      <div v-else-if="!thumbnails.length" class="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h3 class="text-xl font-black text-ink">No thumbnails yet</h3>
        <p class="mt-2 text-slate-600">Generate your first thumbnail and it will appear here.</p>
      </div>
      <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="thumbnail in thumbnails" :key="thumbnail.id" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div class="thumbnail-frame">
            <img :src="thumbnail.watermarkedImageUrl" :alt="thumbnail.title" class="h-full w-full object-cover">
          </div>
          <div class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h3 class="font-black text-ink">{{ thumbnail.title }}</h3>
                <p class="mt-1 text-sm text-slate-500">{{ thumbnail.category }} · {{ formatDate(thumbnail.createdAt) }}</p>
              </div>
              <span :class="statusClass(thumbnail.paymentStatus)" class="rounded px-2 py-1 text-xs font-black uppercase">
                {{ thumbnail.paymentStatus }}
              </span>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <a
                v-if="thumbnail.paymentStatus === 'paid'"
                :href="`/api/downloads/${thumbnail.id}`"
                class="rounded-md bg-ink px-4 py-2 text-sm font-bold text-white"
              >
                Download HD
              </a>
              <NuxtLink
                v-else
                :to="`/pricing?thumbnail=${thumbnail.id}&plan=single`"
                class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white"
              >
                Pay to Unlock
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

usePageSeo(
  'Dashboard - AI Thumbnail Maker',
  'View generated thumbnails and download history inside the AI Thumbnail Maker creator dashboard.',
  '/dashboard',
  { noindex: true }
)

const { data, pending, refresh } = await useFetch<{ user: any; thumbnails: any[] }>('/api/thumbnails', {
  credentials: 'include'
})

const thumbnails = computed(() => data.value?.thumbnails || [])
const paidCount = computed(() => thumbnails.value.filter(thumbnail => thumbnail.paymentStatus === 'paid').length)

onMounted(() => {
  refresh()
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const statusClass = (status: string) => {
  if (status === 'paid') return 'bg-emerald-50 text-emerald-700'
  if (status === 'failed') return 'bg-red-50 text-red-700'
  return 'bg-amber-50 text-amber-700'
}
</script>

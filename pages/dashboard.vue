<template>
  <div>
    <PageHero
      eyebrow="Creator dashboard"
      title="My generated thumbnails and downloads"
      description="Review generated assets, recent download activity, and account-ready creator stats."
    />
    <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
      <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-black uppercase text-slate-500">Generated</p>
        <p class="mt-2 text-4xl font-black">{{ store.generated.length }}</p>
      </article>
      <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-black uppercase text-slate-500">Downloads</p>
        <p class="mt-2 text-4xl font-black">{{ store.downloads.length }}</p>
      </article>
      <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-black uppercase text-slate-500">Plan</p>
        <p class="mt-2 text-4xl font-black">Preview</p>
      </article>
    </section>

    <section class="mx-auto grid max-w-7xl gap-8 px-4 pb-14 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-2xl font-black">My generated thumbnails</h2>
        <div class="mt-5 space-y-4">
          <article v-for="item in store.generated" :key="item.id" class="flex gap-4 rounded-lg border border-slate-200 p-3">
            <div class="watermark relative h-20 w-32 overflow-hidden rounded">
              <img :src="item.imageUrl" :alt="item.title" class="h-full w-full object-cover">
            </div>
            <div class="flex-1">
              <h3 class="font-black">{{ item.title }}</h3>
              <p class="text-sm text-slate-500">{{ item.category }} • {{ new Date(item.createdAt).toLocaleString() }}</p>
              <NuxtLink :to="`/pricing?thumbnail=${item.id}&plan=single`" class="mt-2 inline-block rounded-md bg-coral px-3 py-2 text-xs font-black text-white">
                Download HD
              </NuxtLink>
            </div>
          </article>
          <p v-if="!store.generated.length" class="rounded-md bg-slate-50 p-4 text-sm font-semibold text-slate-600">Generated thumbnails will appear here.</p>
        </div>
      </div>

      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-2xl font-black">My downloads</h2>
        <div class="mt-5 space-y-3">
          <article v-for="item in store.downloads" :key="`${item.id}-${item.downloadedAt}`" class="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
            <div>
              <h3 class="font-black">{{ item.title }}</h3>
              <p class="text-sm text-slate-500">{{ new Date(item.downloadedAt).toLocaleString() }}</p>
            </div>
            <span class="rounded bg-slate-100 px-2 py-1 text-xs font-black">{{ item.paid ? 'Paid HD' : 'Watermarked preview' }}</span>
          </article>
          <p v-if="!store.downloads.length" class="rounded-md bg-slate-50 p-4 text-sm font-semibold text-slate-600">Download activity will appear here.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Dashboard - AI Thumbnail Maker',
  'View generated thumbnails and download history inside the AI Thumbnail Maker creator dashboard.',
  '/dashboard'
)

const store = useThumbnailStore()
</script>

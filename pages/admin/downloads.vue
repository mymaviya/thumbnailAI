<template>
  <div>
    <PageHero
      eyebrow="Admin"
      title="Downloads"
      description="Review paid download records, customers, payment status, and thumbnail previews."
    />

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table class="w-full min-w-[980px] text-left text-sm">
          <thead class="bg-slate-50 text-xs font-black uppercase text-slate-500">
            <tr>
              <th class="px-4 py-3">Preview</th>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">Thumbnail</th>
              <th class="px-4 py-3">Payment</th>
              <th class="px-4 py-3">Amount</th>
              <th class="px-4 py-3">Downloaded</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="download in downloads" :key="download.id">
              <td class="px-4 py-3">
                <img :src="download.thumbnail.watermarkedImageUrl" :alt="download.thumbnail.title" class="h-12 w-20 rounded object-cover">
              </td>
              <td class="px-4 py-3">
                <p class="font-black text-ink">{{ download.user.name }}</p>
                <p class="text-slate-500">{{ download.user.email }}</p>
              </td>
              <td class="px-4 py-3 font-semibold">{{ download.thumbnail.title }}</td>
              <td class="px-4 py-3">
                <span class="rounded bg-emerald-50 px-2 py-1 text-xs font-black uppercase text-emerald-700">{{ download.paymentStatus }}</span>
              </td>
              <td class="px-4 py-3 font-semibold">₹{{ ((download.amount || 0) / 100).toLocaleString('en-IN') }}</td>
              <td class="px-4 py-3 text-slate-600">{{ download.downloadedAt ? formatDate(download.downloadedAt) : 'Not downloaded' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

usePageSeo(
  'Admin Downloads - AI Thumbnail Maker',
  'Admin download list for AI Thumbnail Maker.',
  '/admin/downloads',
  { noindex: true }
)

const { data } = await useFetch<{ downloads: any[] }>('/api/admin/downloads', {
  credentials: 'include'
})
const downloads = computed(() => data.value?.downloads || [])
const formatDate = (date: string) => new Date(date).toLocaleString()
</script>

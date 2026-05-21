<template>
  <div>
    <PageHero
      eyebrow="Template gallery"
      title="Ready-made YouTube thumbnail cards"
      description="Filter by niche, preview watermarked thumbnails, customize layouts, or start a payment-ready download flow."
    />
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <CategoryPills />
        <select v-model="category" class="focus-ring rounded-md border border-slate-300 bg-white px-4 py-3 font-bold">
          <option value="">All categories</option>
          <option v-for="item in categories" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TemplateCard v-for="template in visibleTemplates" :key="template.id" :template="template" @preview="selected = $event" @download="unlockTemplate" />
      </div>
    </section>
    <PreviewModal :template="selected" @close="selected = null" @download="unlockTemplate" />
  </div>
</template>

<script setup lang="ts">
import { categories, getTemplatesByCategory } from '~/data/templates'
import type { ThumbnailTemplate } from '~/types/thumbnail'

usePageSeo(
  'Thumbnail Gallery - AI Thumbnail Maker',
  'Browse ready-made thumbnail templates by category and customize YouTube-style preview cards.',
  '/templates'
)

const category = ref('')
const selected = ref<ThumbnailTemplate | null>(null)
const store = useThumbnailStore()
const visibleTemplates = computed(() => getTemplatesByCategory(category.value))

const unlockTemplate = async (template: ThumbnailTemplate) => {
  await $fetch('/api/download-thumbnail', { method: 'POST', body: { thumbnailId: template.id, paid: false, format: 'png' } })
  store.addDownload({ id: template.id, title: template.title, paid: false })
  await navigateTo(`/pricing?thumbnail=${template.id}&plan=single`)
}
</script>

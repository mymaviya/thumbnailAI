<template>
  <div>
    <PageHero
      :eyebrow="`${displayCategory} thumbnails`"
      :title="`${displayCategory} thumbnail templates`"
      :description="`Browse ready-made ${displayCategory.toLowerCase()} YouTube thumbnails, preview watermarked versions, customize copy, and prepare paid downloads.`"
    />
    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6">
        <CategoryPills />
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TemplateCard v-for="template in visibleTemplates" :key="template.id" :template="template" @preview="selected = $event" @download="unlockTemplate" />
      </div>
      <p v-if="!visibleTemplates.length" class="rounded-lg border border-slate-200 bg-white p-8 text-center font-bold text-slate-600">
        No templates found for this category yet.
      </p>
    </section>
    <PreviewModal :template="selected" @close="selected = null" @download="unlockTemplate" />
  </div>
</template>

<script setup lang="ts">
import { getTemplatesByCategory } from '~/data/templates'
import type { ThumbnailTemplate } from '~/types/thumbnail'

const route = useRoute()
const selected = ref<ThumbnailTemplate | null>(null)
const store = useThumbnailStore()

const displayCategory = computed(() => {
  const raw = String(route.params.category || 'templates')
  return raw.charAt(0).toUpperCase() + raw.slice(1)
})
const visibleTemplates = computed(() => getTemplatesByCategory(String(route.params.category || '')))

usePageSeo(
  `${displayCategory.value} Thumbnail Templates - AI Thumbnail Maker`,
  `Preview and customize ${displayCategory.value.toLowerCase()} YouTube thumbnail templates with AI Thumbnail Maker.`,
  `/templates/${String(route.params.category || '')}`
)

const unlockTemplate = async (template: ThumbnailTemplate) => {
  await $fetch('/api/download-thumbnail', { method: 'POST', body: { thumbnailId: template.id, paid: false, format: 'png' } })
  store.addDownload({ id: template.id, title: template.title, paid: false })
  await navigateTo(`/pricing?thumbnail=${template.id}&plan=single`)
}
</script>

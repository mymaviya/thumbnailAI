<template>
  <div>
    <PageHero
      eyebrow="AI-powered YouTube thumbnail studio"
      title="AI Thumbnail Maker"
      description="Browse ready-made thumbnails, customize text and colors, generate fresh concepts with AI, and prepare payment-ready downloads."
    >
      <template #actions>
        <NuxtLink to="/generate" class="rounded-md bg-coral px-5 py-3 font-black text-white hover:bg-red-500">Generate with AI</NuxtLink>
        <NuxtLink to="/templates" class="rounded-md border border-slate-300 bg-white px-5 py-3 font-black text-ink hover:border-coral hover:text-coral">Browse Templates</NuxtLink>
      </template>
    </PageHero>

    <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 class="text-2xl font-black">Find a thumbnail style fast</h2>
          <p class="mt-2 text-slate-600">Search categories used by creators, schools, clinics, businesses, and channels publishing daily content.</p>
        </div>
        <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <input v-model="query" type="search" placeholder="Search Education, Gaming, Tech..." class="focus-ring w-full rounded-md border border-slate-300 px-4 py-3 font-semibold">
          <div class="mt-4">
            <CategoryPills />
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 class="text-2xl font-black">Popular thumbnail templates</h2>
          <p class="mt-1 text-slate-600">Colorful, high-contrast previews built around YouTube's 16:9 format.</p>
        </div>
        <NuxtLink to="/templates" class="text-sm font-black text-coral hover:text-red-500">View all</NuxtLink>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TemplateCard v-for="template in filteredTemplates.slice(0, 6)" :key="template.id" :template="template" @preview="selected = $event" @download="unlockTemplate" />
      </div>
    </section>

    <section class="bg-white">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <h2 class="text-3xl font-black">Create YouTube thumbnails that are searchable, skimmable, and click-ready</h2>
          <p class="mt-4 leading-8 text-slate-600">
            AI Thumbnail Maker helps creators produce ready-made video thumbnails for tutorials, gaming clips, news updates, vlogs, business explainers, tech reviews, Islamic reminders, school announcements, and hospital awareness videos. Each page uses SEO-friendly routes, dynamic metadata, Open Graph previews, sitemap output, robots rules, and Schema.org website data.
          </p>
        </div>
      </div>
    </section>

    <PreviewModal :template="selected" @close="selected = null" @download="unlockTemplate" />
  </div>
</template>

<script setup lang="ts">
import { templates } from '~/data/templates'
import type { ThumbnailTemplate } from '~/types/thumbnail'

usePageSeo(
  'AI Thumbnail Maker - Generate and Customize YouTube Thumbnails',
  'Browse templates, generate AI thumbnails, customize YouTube previews, and prepare watermark-free paid downloads.',
  '/'
)

const query = ref('')
const selected = ref<ThumbnailTemplate | null>(null)
const store = useThumbnailStore()

const filteredTemplates = computed(() => {
  const value = query.value.trim().toLowerCase()
  if (!value) return templates
  return templates.filter(template =>
    [template.title, template.category, template.headline, template.subline].some(field =>
      field.toLowerCase().includes(value)
    )
  )
})

const unlockTemplate = async (template: ThumbnailTemplate) => {
  await $fetch('/api/download-thumbnail', {
    method: 'POST',
    body: { thumbnailId: template.id, paid: false, format: 'png' }
  })
  store.addDownload({ id: template.id, title: template.title, paid: false })
  await navigateTo(`/pricing?thumbnail=${template.id}&plan=single`)
}
</script>

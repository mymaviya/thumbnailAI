<template>
  <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
    <TemplatePreview :template="template" watermarked />
    <div class="space-y-4 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-black text-ink">{{ template.title }}</h3>
          <p class="text-sm text-slate-500">{{ template.category }} thumbnail template</p>
        </div>
        <span class="rounded bg-slate-100 px-2 py-1 text-sm font-black text-ink">${{ template.price }}</span>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <button class="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold hover:border-coral hover:text-coral" @click="$emit('preview', template)">
          Preview
        </button>
        <button class="rounded-md bg-ink px-3 py-2 text-sm font-bold text-white hover:bg-slate-700" @click="customize">
          Customize
        </button>
        <button class="rounded-md bg-coral px-3 py-2 text-sm font-bold text-white hover:bg-red-500" @click="$emit('download', template)">
          Download
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ThumbnailTemplate } from '~/types/thumbnail'

const props = defineProps<{ template: ThumbnailTemplate }>()
const emit = defineEmits<{
  preview: [ThumbnailTemplate]
  download: [ThumbnailTemplate]
}>()

const store = useThumbnailStore()

const customize = () => {
  store.setTemplate(props.template)
  navigateTo('/editor')
}
</script>

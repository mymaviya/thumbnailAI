<template>
  <div v-if="template" class="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4" @click.self="$emit('close')">
    <div class="w-full max-w-4xl rounded-lg bg-white p-4 shadow-soft">
      <TemplatePreview :template="template" watermarked />
      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-xl font-black">{{ template.title }}</h3>
          <p class="text-sm text-slate-500">Preview includes watermark. Paid download removes it.</p>
        </div>
        <button class="rounded-md bg-ink px-4 py-2 text-sm font-bold text-white" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThumbnailTemplate } from '~/types/thumbnail'

defineProps<{ template: ThumbnailTemplate | null }>()
defineEmits<{ close: [] }>()
</script>

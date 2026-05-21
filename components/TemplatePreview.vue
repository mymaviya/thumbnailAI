<template>
  <div class="thumbnail-frame relative">
    <div :class="['absolute inset-0 bg-gradient-to-br', template.gradient]" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.32),transparent_26%),linear-gradient(90deg,rgba(0,0,0,0.54),transparent)]" />
    <div class="absolute right-5 top-5 rounded bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-ink">
      {{ template.badge }}
    </div>
    <div class="absolute bottom-6 left-6 right-6">
      <p class="mb-3 inline-block rounded px-3 py-1 text-sm font-black uppercase text-ink" :style="{ backgroundColor: template.accent }">
        {{ template.subline }}
      </p>
      <h3 class="max-w-[76%] text-balance text-3xl font-black leading-none text-white drop-shadow-lg sm:text-4xl">
        {{ template.headline }}
      </h3>
    </div>
    <div v-if="watermarked" class="watermark absolute inset-0 grid place-items-center">
      <span class="-rotate-12 rounded bg-black/45 px-5 py-2 text-sm font-black uppercase tracking-[0.2em] text-white">
        Preview
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThumbnailTemplate } from '~/types/thumbnail'

defineProps<{
  template: ThumbnailTemplate
  watermarked?: boolean
}>()
</script>

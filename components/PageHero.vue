<template>
  <section class="bg-white">
    <div class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
      <div>
        <p v-if="eyebrow" class="mb-4 text-sm font-black uppercase tracking-[0.18em] text-coral">{{ eyebrow }}</p>
        <h1 class="max-w-4xl text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl lg:text-6xl">
          {{ title }}
        </h1>
        <p class="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          {{ description }}
        </p>
        <div v-if="$slots.actions" class="mt-8 flex flex-wrap gap-3">
          <slot name="actions" />
        </div>
      </div>
      <div class="thumbnail-frame relative min-h-64">
        <div class="absolute inset-0 bg-gradient-to-br from-coral via-skydeep to-ink" />
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,209,102,0.9),transparent_18%),linear-gradient(90deg,rgba(17,24,39,0.72),transparent)]" />
        <div class="absolute bottom-8 left-8 right-8">
          <p class="mb-4 inline-block rounded bg-lemon px-4 py-2 text-sm font-black uppercase text-ink">1280 x 720</p>
          <p class="text-4xl font-black leading-none text-white sm:text-5xl">THUMBNAILS THAT GET CLICKS</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  description: string
}>()
</script>

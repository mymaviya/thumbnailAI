<template>
  <div class="flex flex-wrap gap-2">
    <NuxtLink
      v-for="category in categories"
      :key="category"
      :to="`/templates/${category.toLowerCase()}`"
      class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm hover:border-coral hover:text-coral"
    >
      {{ category }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { categories } from '~/data/templates'
</script>

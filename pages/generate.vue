<template>
  <div>
    <PageHero
      eyebrow="AI generator"
      title="Generate custom thumbnails from a video idea"
      description="Describe your title, niche, colors, background, visual emotion, and optional reference images."
    />
    <section class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <form class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="generate">
        <div class="grid gap-4">
          <label class="grid gap-2 font-bold">Video title
            <input v-model="form.videoTitle" required class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="How AI changed my study routine">
          </label>
          <label class="grid gap-2 font-bold">Category
            <select v-model="form.category" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </label>
          <label class="grid gap-2 font-bold">Main text
            <input v-model="form.mainText" required class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="STUDY SMARTER">
          </label>
          <div class="grid gap-4 md:grid-cols-2">
            <label class="grid gap-2 font-bold">Background style
              <input v-model="form.backgroundStyle" class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="studio, classroom, cinematic">
            </label>
            <label class="grid gap-2 font-bold">Color theme
              <input v-model="form.colorTheme" class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="red, yellow, black">
            </label>
          </div>
          <label class="grid gap-2 font-bold">Emotion/style
            <select v-model="form.emotion" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
              <option>professional</option>
              <option>viral</option>
              <option>bold</option>
              <option>cinematic</option>
            </select>
          </label>
          <div class="grid gap-4 rounded-md border border-slate-200 bg-slate-50 p-4">
            <label class="grid gap-2 font-bold">Reference character
              <input type="file" accept="image/*" class="text-sm" @change="event => handleReferenceUpload(event, 'character')">
            </label>
            <div v-if="characterImage" class="flex items-center gap-3">
              <img :src="characterImage" alt="Character reference preview" class="h-16 w-24 rounded object-cover">
              <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-ink" @click="characterImage = ''">Remove</button>
            </div>
            <label class="grid gap-2 font-bold">Reference background
              <input type="file" accept="image/*" class="text-sm" @change="event => handleReferenceUpload(event, 'background')">
            </label>
            <div v-if="backgroundImage" class="flex items-center gap-3">
              <img :src="backgroundImage" alt="Background reference preview" class="h-16 w-24 rounded object-cover">
              <button type="button" class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-ink" @click="backgroundImage = ''">Remove</button>
            </div>
          </div>
          <button class="rounded-md bg-coral px-5 py-3 font-black text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60" :disabled="loading">
            {{ loading ? 'Generating thumbnail...' : 'Generate Thumbnail' }}
          </button>
          <p v-if="error" class="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{{ error }}</p>
          <p v-if="success" class="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{{ success }}</p>
        </div>
      </form>

      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="thumbnail-frame relative grid place-items-center">
          <img v-if="generatedImage" :src="generatedImage" alt="Generated thumbnail preview" class="h-full w-full object-cover">
          <div v-else class="absolute inset-0 bg-gradient-to-br from-skydeep via-coral to-ink" />
          <div v-if="!generatedImage" class="relative max-w-lg px-8 text-center">
            <p class="text-4xl font-black leading-none text-white">YOUR AI THUMBNAIL PREVIEW</p>
            <p class="mt-4 rounded bg-lemon px-4 py-2 font-black text-ink">Generated result appears here</p>
          </div>
          <div v-if="loading" class="absolute inset-0 grid place-items-center bg-ink/70 text-lg font-black text-white">Creating image...</div>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <NuxtLink
            v-if="latestThumbnail"
            to="/editor"
            class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white"
            @click="sendToEditor"
          >
            Edit With Uploads
          </NuxtLink>
          <button
            v-if="latestThumbnail"
            type="button"
            class="rounded-md bg-coral px-4 py-2 text-sm font-bold text-white"
            @click="payForThumbnail(latestThumbnail)"
          >
            Download HD
          </button>
          <NuxtLink to="/editor" class="rounded-md bg-ink px-4 py-2 text-sm font-bold text-white">Open Editor</NuxtLink>
          <NuxtLink to="/dashboard" class="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-ink">View Generated</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { categories } from '~/data/templates'
import type { GeneratedThumbnail, ThumbnailCategory } from '~/types/thumbnail'

definePageMeta({
  middleware: 'auth'
})

usePageSeo(
  'AI Thumbnail Generator - AI Thumbnail Maker',
  'Generate YouTube thumbnails using OpenAI image generation from titles, categories, styles, colors, and emotions.',
  '/generate'
)

const store = useThumbnailStore()
const loading = ref(false)
const error = ref('')
const success = ref('')
const generatedImage = ref('')
const latestThumbnail = ref<GeneratedThumbnail | null>(null)
const characterImage = ref('')
const backgroundImage = ref('')
const form = reactive({
  videoTitle: '',
  category: 'Education' as ThumbnailCategory,
  mainText: '',
  backgroundStyle: 'high-contrast creator studio',
  colorTheme: 'red, yellow, black',
  emotion: 'viral' as 'professional' | 'viral' | 'bold' | 'cinematic'
})

const generate = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const result = await $fetch<GeneratedThumbnail>('/api/thumbnails/generate', {
      method: 'POST',
      body: {
        ...form,
        characterImage: characterImage.value,
        backgroundImage: backgroundImage.value
      }
    })
    generatedImage.value = result.watermarkedImageUrl || result.imageUrl
    latestThumbnail.value = result
    store.saveGenerated(result)
    success.value = 'Thumbnail generated and saved to your dashboard.'
  } catch (event: any) {
    if (event?.statusCode === 401 || event?.response?.status === 401) {
      await navigateTo('/login')
      return
    }
    error.value = event?.data?.message || event?.statusMessage || 'Unable to generate thumbnail. Please try again.'
  } finally {
    loading.value = false
  }
}

const payForThumbnail = async (thumbnail: GeneratedThumbnail) => {
  await navigateTo(`/pricing?thumbnail=${thumbnail.id}&plan=single`)
}

const sendToEditor = () => {
  if (latestThumbnail.value) {
    store.useGeneratedAsBackground(latestThumbnail.value)
  }
}

const resizeReferenceImage = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onerror = reject
  reader.onload = () => {
    const image = new Image()
    image.onerror = reject
    image.onload = () => {
      const maxSide = 1536
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const context = canvas.getContext('2d')
      if (!context) {
        reject(new Error('Could not prepare reference image.'))
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.88))
    }
    image.src = String(reader.result || '')
  }
  reader.readAsDataURL(file)
})

const handleReferenceUpload = async (event: Event, type: 'character' | 'background') => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const image = await resizeReferenceImage(file)
    if (type === 'character') {
      characterImage.value = image
    } else {
      backgroundImage.value = image
    }
  } catch {
    error.value = 'Could not load that image. Please try a PNG or JPG file.'
  } finally {
    input.value = ''
  }
}
</script>

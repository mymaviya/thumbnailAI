<template>
  <div>
    <PageHero
      eyebrow="AI generator"
      title="Generate custom thumbnails from a video idea"
      description="Enter a simple video title, enhance it into a professional thumbnail prompt, then generate a saved preview."
    />
    <section class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <form class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" @submit.prevent="generate">
        <div class="grid gap-4">
          <label class="grid gap-2 font-bold">Video Title
            <input v-model="form.videoTitle" required class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="Minecraft Fireball PvP">
          </label>

          <label class="grid gap-2 font-bold">Thumbnail Style
            <select v-model="form.thumbnailStyle" class="focus-ring rounded-md border border-slate-300 bg-white px-4 py-3 font-semibold">
              <option v-for="style in thumbnailStyles" :key="style" :value="style">{{ style }}</option>
            </select>
          </label>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="grid gap-2 font-bold">Main Subject
              <input v-model="form.mainSubject" class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="Minecraft player throwing a giant fireball">
            </label>
            <label class="grid gap-2 font-bold">Emotion
              <input v-model="form.emotion" class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="shocked, intense, competitive">
            </label>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="grid gap-2 font-bold">Background
              <input v-model="form.background" class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="Nether arena, lava, sparks, motion">
            </label>
            <label class="grid gap-2 font-bold">Color Theme
              <input v-model="form.colorTheme" class="focus-ring rounded-md border border-slate-300 px-4 py-3 font-semibold" placeholder="orange, red, black, neon blue">
            </label>
          </div>

          <label class="grid gap-2 font-bold">Text Position
            <select v-model="form.textPosition" class="focus-ring rounded-md border border-slate-300 bg-white px-4 py-3 font-semibold">
              <option>Left side empty space for bold text</option>
              <option>Right side empty space for bold text</option>
              <option>Top area empty space for short headline</option>
              <option>Bottom area empty space for short headline</option>
              <option>No text, subject-only thumbnail</option>
            </select>
          </label>

          <label class="grid gap-2 font-bold">Enhanced Prompt
            <textarea
              v-model="form.enhancedPrompt"
              rows="8"
              class="focus-ring min-h-44 rounded-md border border-slate-300 px-4 py-3 text-sm font-semibold leading-6"
              placeholder="Click Enhance Prompt to create a professional thumbnail prompt. You can edit it before generating."
            />
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
          <div class="grid gap-3 sm:grid-cols-2">
            <button type="button" class="rounded-md border border-coral bg-white px-5 py-3 font-black text-coral transition hover:bg-red-50" @click="enhancePrompt">
              Enhance Prompt
            </button>
            <button class="rounded-md bg-coral px-5 py-3 font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60" :disabled="loading">
              {{ loading ? 'Generating thumbnail...' : 'Generate Thumbnail' }}
            </button>
          </div>
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
import type { GeneratedThumbnail, ThumbnailCategory } from '~/types/thumbnail'

definePageMeta({
  middleware: 'auth'
})

usePageSeo(
  'AI Thumbnail Generator - AI Thumbnail Maker',
  'Generate YouTube thumbnails using OpenAI image generation from titles, categories, styles, colors, and emotions.',
  '/generate',
  { noindex: true }
)

const store = useThumbnailStore()
const loading = ref(false)
const error = ref('')
const success = ref('')
const generatedImage = ref('')
const latestThumbnail = ref<GeneratedThumbnail | null>(null)
const characterImage = ref('')
const backgroundImage = ref('')
const thumbnailStyles = [
  'MrBeast style',
  'Viral YouTube thumbnail',
  'Gaming thumbnail',
  'Cinematic thumbnail',
  'Hyper realistic',
  'Cartoon gaming style',
  'Tech YouTuber style',
  'Documentary thumbnail',
  'Horror cinematic',
  'Neon cyberpunk',
  'Clean modern YouTube thumbnail'
]
const form = reactive({
  videoTitle: '',
  category: 'Gaming' as ThumbnailCategory,
  thumbnailStyle: 'Viral YouTube thumbnail',
  mainSubject: '',
  emotion: 'strong excited emotion',
  background: 'cinematic high-energy background',
  colorTheme: 'bold complementary colors',
  textPosition: 'Left side empty space for bold text',
  enhancedPrompt: ''
})

const categoryFromStyle = (style: string, title: string): ThumbnailCategory => {
  const value = `${style} ${title}`.toLowerCase()
  if (value.includes('gaming') || value.includes('minecraft')) return 'Gaming'
  if (value.includes('tech')) return 'Tech'
  if (value.includes('documentary')) return 'News'
  if (value.includes('business')) return 'Business'
  if (value.includes('school')) return 'School'
  if (value.includes('hospital')) return 'Hospital'
  return 'Education'
}

const enhancePrompt = () => {
  error.value = ''
  const title = form.videoTitle.trim()

  if (!title) {
    error.value = 'Enter a video title first, then enhance the prompt.'
    return
  }

  const subject = form.mainSubject.trim() || title
  const emotion = form.emotion.trim() || 'strong excited emotion'
  const background = form.background.trim() || 'cinematic high-energy background'
  const colors = form.colorTheme.trim() || 'bold complementary colors'

  form.category = categoryFromStyle(form.thumbnailStyle, title)
  form.enhancedPrompt = [
    `Create a high CTR YouTube thumbnail style image for the video title "${title}".`,
    `Thumbnail style: ${form.thumbnailStyle}.`,
    `Main subject: a large clear subject showing ${subject}, positioned as the visual focus.`,
    `Emotion: ${emotion}; make the face, pose, or action feel strong, dramatic, and instantly readable.`,
    `Background: ${background}, with cinematic lighting, depth, energy, and visual separation from the subject.`,
    `Color theme: ${colors}; use bold colors, strong contrast, and bright accents that stand out in a YouTube feed.`,
    `Composition: clean composition, large subject, strong silhouette, clear focal point, and ${form.textPosition.toLowerCase()}.`,
    'Use empty space for text, but do not render any unreadable or random text inside the image unless it is clean and intentional.',
    'Aspect ratio: 16:9 YouTube thumbnail, optimized for 1280x720.',
    'Negative instructions: avoid blur, clutter, distorted faces, bad anatomy, extra fingers, unreadable text, tiny text, watermarks, logos, low contrast, messy composition, and cropped important subjects.'
  ].join('\n')
}

const generate = async () => {
  loading.value = true
  error.value = ''
  success.value = ''
  if (!form.enhancedPrompt.trim()) {
    enhancePrompt()
  }
  if (!form.enhancedPrompt.trim()) {
    loading.value = false
    return
  }

  try {
    const result = await $fetch<GeneratedThumbnail>('/api/thumbnails/generate', {
      method: 'POST',
      body: {
        ...form,
        mainText: form.videoTitle,
        backgroundStyle: form.background,
        category: categoryFromStyle(form.thumbnailStyle, form.videoTitle),
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

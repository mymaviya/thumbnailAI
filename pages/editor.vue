<template>
  <div>
    <PageHero
      eyebrow="Thumbnail editor"
      title="Customize and export 1280x720 thumbnails"
      description="Change text, colors, logo, and font style before exporting a PNG or JPG preview."
    />
    <section class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
      <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-4">
          <label class="grid gap-2 font-bold">Main text
            <input v-model="editor.mainText" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
          </label>
          <label class="grid gap-2 font-bold">Sub text
            <input v-model="editor.subText" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label class="grid gap-2 font-bold">Text color
              <input v-model="editor.color" type="color" class="h-12 w-full rounded-md border border-slate-300">
            </label>
            <label class="grid gap-2 font-bold">Background
              <input v-model="editor.background" type="color" class="h-12 w-full rounded-md border border-slate-300">
            </label>
          </div>
          <label class="grid gap-2 font-bold">Font style
            <select v-model="editor.font" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
              <option>Impact</option>
              <option>Arial Black</option>
              <option>Georgia</option>
              <option>Verdana</option>
            </select>
          </label>
          <label class="grid gap-2 font-bold">Upload logo/image
            <input type="file" accept="image/*" class="text-sm" @change="handleLogo">
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button class="rounded-md bg-coral px-4 py-3 font-black text-white" @click="exportFile('png')">Export PNG</button>
            <button class="rounded-md bg-ink px-4 py-3 font-black text-white" @click="exportFile('jpg')">Export JPG</button>
          </div>
        </div>
      </aside>

      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div ref="canvasArea" class="thumbnail-frame relative" :style="{ background: editor.background }">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.22),transparent_21%)]" />
          <img v-if="editor.logo" :src="editor.logo" alt="Uploaded logo" class="absolute right-8 top-8 max-h-24 max-w-32 rounded bg-white/90 p-2">
          <div class="absolute bottom-10 left-10 right-10">
            <p class="mb-4 inline-block rounded px-4 py-2 text-lg font-black text-ink" :style="{ backgroundColor: editor.color }">{{ editor.subText }}</p>
            <h2 class="max-w-[780px] text-5xl font-black leading-none text-white drop-shadow-lg md:text-7xl" :style="{ fontFamily: editor.font }">
              {{ editor.mainText }}
            </h2>
          </div>
          <div class="watermark absolute inset-0 pointer-events-none" />
        </div>
        <p class="mt-4 text-sm font-semibold text-slate-500">Preview is fixed at the YouTube 16:9 standard. Export endpoint is placeholder-ready for paid watermark removal.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Thumbnail Editor - AI Thumbnail Maker',
  'Customize thumbnail text, colors, fonts, and logo uploads, then export YouTube-size PNG or JPG files.',
  '/editor'
)

const store = useThumbnailStore()
const editor = store.editor

const handleLogo = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    editor.logo = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}

const exportFile = async (format: 'png' | 'jpg') => {
  const response = await $fetch<{ downloadUrl: string }>('/api/download-thumbnail', {
    method: 'POST',
    body: { thumbnailId: 'editor-custom', paid: false, format }
  })
  store.addDownload({ id: 'editor-custom', title: `Custom editor ${format.toUpperCase()}`, paid: false })
  window.alert(`Placeholder export created: ${response.downloadUrl}`)
}
</script>

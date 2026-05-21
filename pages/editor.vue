<template>
  <div>
    <PageHero
      eyebrow="Thumbnail editor"
      title="Customize and export 1280x720 thumbnails"
      description="Add your own character, background, text style, and exact placement before exporting a PNG or JPG preview."
    />
    <section class="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[390px_1fr] lg:px-8">
      <aside class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="grid gap-5">
          <div class="grid gap-4">
            <label class="grid gap-2 font-bold">Main text
              <input v-model="editor.mainText" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
            </label>
            <label class="grid gap-2 font-bold">Sub text
              <input v-model="editor.subText" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
            </label>
          </div>

          <div class="grid gap-3 border-t border-slate-200 pt-5">
            <label class="grid gap-2 font-bold">Your character
              <input type="file" accept="image/*" class="text-sm" @change="event => handleImageUpload(event, 'characterImage')">
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-ink" @click="clearImage('characterImage')">Remove Character</button>
              <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-ink" @click="centerCharacter">Center Character</button>
            </div>
          </div>

          <div class="grid gap-3 border-t border-slate-200 pt-5">
            <label class="grid gap-2 font-bold">Background image
              <input type="file" accept="image/*" class="text-sm" @change="event => handleImageUpload(event, 'backgroundImage')">
            </label>
            <div class="grid grid-cols-2 gap-4">
              <label class="grid gap-2 font-bold">Fallback color
                <input v-model="editor.background" type="color" class="h-12 w-full rounded-md border border-slate-300">
              </label>
              <label class="grid gap-2 font-bold">Accent color
                <input v-model="editor.color" type="color" class="h-12 w-full rounded-md border border-slate-300">
              </label>
            </div>
            <button class="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-ink" @click="clearImage('backgroundImage')">Remove Background Image</button>
          </div>

          <div class="grid gap-3 border-t border-slate-200 pt-5">
            <div class="grid grid-cols-2 gap-4">
              <label class="grid gap-2 font-bold">Font style
                <select v-model="editor.font" class="focus-ring rounded-md border border-slate-300 px-4 py-3">
                  <option v-for="font in fonts" :key="font">{{ font }}</option>
                </select>
              </label>
              <label class="grid gap-2 font-bold">Text color
                <input v-model="editor.textColor" type="color" class="h-12 w-full rounded-md border border-slate-300">
              </label>
            </div>
            <label class="grid gap-2 text-sm font-bold">Headline size: {{ editor.fontSize }}px
              <input v-model.number="editor.fontSize" type="range" min="36" max="104" class="accent-coral">
            </label>
            <label class="grid gap-2 text-sm font-bold">Text width: {{ editor.textWidth }}%
              <input v-model.number="editor.textWidth" type="range" min="38" max="92" class="accent-coral">
            </label>
          </div>

          <div class="grid gap-3 border-t border-slate-200 pt-5">
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="preset in placementPresets"
                :key="preset.label"
                class="rounded-md border border-slate-300 px-2 py-2 text-xs font-black text-ink hover:border-coral hover:text-coral"
                @click="applyPreset(preset)"
              >
                {{ preset.label }}
              </button>
            </div>
            <label class="grid gap-2 text-sm font-bold">Text horizontal: {{ editor.textX }}%
              <input v-model.number="editor.textX" type="range" min="2" max="78" class="accent-coral">
            </label>
            <label class="grid gap-2 text-sm font-bold">Text vertical: {{ editor.textY }}%
              <input v-model.number="editor.textY" type="range" min="8" max="82" class="accent-coral">
            </label>
            <label class="grid gap-2 text-sm font-bold">Sub text horizontal: {{ editor.subTextX }}%
              <input v-model.number="editor.subTextX" type="range" min="2" max="82" class="accent-coral">
            </label>
            <label class="grid gap-2 text-sm font-bold">Sub text vertical: {{ editor.subTextY }}%
              <input v-model.number="editor.subTextY" type="range" min="6" max="82" class="accent-coral">
            </label>
          </div>

          <div class="grid gap-3 border-t border-slate-200 pt-5">
            <label class="grid gap-2 text-sm font-bold">Character horizontal: {{ editor.characterX }}%
              <input v-model.number="editor.characterX" type="range" min="0" max="82" class="accent-coral">
            </label>
            <label class="grid gap-2 text-sm font-bold">Character vertical: {{ editor.characterY }}%
              <input v-model.number="editor.characterY" type="range" min="0" max="64" class="accent-coral">
            </label>
            <label class="grid gap-2 text-sm font-bold">Character size: {{ editor.characterScale }}%
              <input v-model.number="editor.characterScale" type="range" min="18" max="72" class="accent-coral">
            </label>
          </div>

          <div class="grid grid-cols-2 gap-3 border-t border-slate-200 pt-5">
            <button class="rounded-md bg-ink px-4 py-3 font-black text-white" @click="exportPreview('png')">Preview PNG</button>
            <button class="rounded-md bg-coral px-4 py-3 font-black text-white" @click="unlockHd">Unlock HD</button>
          </div>
        </div>
      </aside>

      <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div class="thumbnail-frame relative" :style="thumbnailStyle">
          <div v-if="!editor.backgroundImage" class="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.22),transparent_21%)]" />
          <div class="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
          <img
            v-if="editor.characterImage"
            :src="editor.characterImage"
            alt="Uploaded character"
            class="absolute object-contain drop-shadow-2xl"
            :style="characterStyle"
          >
          <img v-if="editor.logo" :src="editor.logo" alt="Uploaded logo" class="absolute right-8 top-8 max-h-24 max-w-32 rounded bg-white/90 p-2">
          <p
            class="absolute inline-block rounded px-4 py-2 text-base font-black text-ink shadow-lg md:text-lg"
            :style="subTextStyle"
          >
            {{ editor.subText }}
          </p>
          <h2
            class="absolute break-words font-black leading-none drop-shadow-lg"
            :style="mainTextStyle"
          >
            {{ editor.mainText }}
          </h2>
          <div class="watermark pointer-events-none absolute inset-0" />
        </div>
        <p class="mt-4 text-sm font-semibold text-slate-500">Preview is fixed at the YouTube 16:9 standard. Keep faces and headline inside the frame edges for clean mobile crops.</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
type EditorImageField = 'backgroundImage' | 'characterImage' | 'logo'

usePageSeo(
  'Thumbnail Editor - AI Thumbnail Maker',
  'Customize thumbnail text, colors, fonts, character uploads, background images, and placement before export.',
  '/editor'
)

const store = useThumbnailStore()
const editor = store.editor
const fonts = ['Impact', 'Arial Black', 'Verdana', 'Georgia', 'Trebuchet MS', 'Tahoma']
const placementPresets = [
  { label: 'Left', textX: 7, textY: 66, subTextX: 7, subTextY: 55, characterX: 62, characterY: 10 },
  { label: 'Center', textX: 18, textY: 64, subTextX: 34, subTextY: 52, characterX: 34, characterY: 8 },
  { label: 'Right', textX: 35, textY: 66, subTextX: 35, subTextY: 55, characterX: 5, characterY: 10 }
]

const thumbnailStyle = computed(() => ({
  backgroundColor: editor.background,
  backgroundImage: editor.backgroundImage ? `url(${editor.backgroundImage})` : undefined,
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}))

const mainTextStyle = computed(() => ({
  color: editor.textColor,
  fontFamily: editor.font,
  fontSize: `clamp(2rem, ${editor.fontSize / 13}vw, ${editor.fontSize}px)`,
  left: `${editor.textX}%`,
  top: `${editor.textY}%`,
  maxWidth: `${editor.textWidth}%`
}))

const subTextStyle = computed(() => ({
  backgroundColor: editor.color,
  left: `${editor.subTextX}%`,
  top: `${editor.subTextY}%`
}))

const characterStyle = computed(() => ({
  left: `${editor.characterX}%`,
  top: `${editor.characterY}%`,
  width: `${editor.characterScale}%`,
  maxHeight: '88%'
}))

const readImage = (file: File, onLoad: (value: string) => void) => {
  const reader = new FileReader()
  reader.onload = () => onLoad(String(reader.result || ''))
  reader.readAsDataURL(file)
}

const handleImageUpload = (event: Event, field: EditorImageField) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  readImage(file, value => {
    editor[field] = value
  })
}

const clearImage = (field: EditorImageField) => {
  editor[field] = ''
}

const centerCharacter = () => {
  editor.characterX = 34
  editor.characterY = 8
  editor.characterScale = 42
}

const applyPreset = (preset: typeof placementPresets[number]) => {
  editor.textX = preset.textX
  editor.textY = preset.textY
  editor.subTextX = preset.subTextX
  editor.subTextY = preset.subTextY
  editor.characterX = preset.characterX
  editor.characterY = preset.characterY
}

const loadImage = (source: string) => new Promise<HTMLImageElement>((resolve, reject) => {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.onload = () => resolve(image)
  image.onerror = reject
  image.src = source
})

const drawCoverImage = (context: CanvasRenderingContext2D, image: HTMLImageElement) => {
  const canvasWidth = context.canvas.width
  const canvasHeight = context.canvas.height
  const scale = Math.max(canvasWidth / image.width, canvasHeight / image.height)
  const width = image.width * scale
  const height = image.height * scale
  context.drawImage(image, (canvasWidth - width) / 2, (canvasHeight - height) / 2, width, height)
}

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  words.forEach(word => {
    const testLine = line ? `${line} ${word}` : word
    if (context.measureText(testLine).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = testLine
    }
  })

  if (line) lines.push(line)
  return lines
}

const drawWrappedText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  fontFamily: string
) => {
  context.font = `900 ${fontSize}px ${fontFamily}`
  context.fillStyle = editor.textColor
  context.shadowColor = 'rgba(0, 0, 0, 0.55)'
  context.shadowBlur = 14
  context.shadowOffsetX = 0
  context.shadowOffsetY = 5

  wrapText(context, text, maxWidth).forEach((line, index) => {
    context.fillText(line, x, y + index * fontSize * 0.95)
  })

  context.shadowColor = 'transparent'
  context.shadowBlur = 0
  context.shadowOffsetY = 0
}

const exportCanvas = async (format: 'png' | 'jpg', watermarked = true) => {
  const canvas = document.createElement('canvas')
  canvas.width = 1280
  canvas.height = 720
  const context = canvas.getContext('2d')
  if (!context) return

  context.fillStyle = editor.background
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (editor.backgroundImage) {
    drawCoverImage(context, await loadImage(editor.backgroundImage))
  }

  const overlay = context.createLinearGradient(0, 0, canvas.width, 0)
  overlay.addColorStop(0, 'rgba(0, 0, 0, 0.58)')
  overlay.addColorStop(0.6, 'rgba(0, 0, 0, 0.1)')
  overlay.addColorStop(1, 'rgba(0, 0, 0, 0)')
  context.fillStyle = overlay
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (editor.characterImage) {
    const character = await loadImage(editor.characterImage)
    const characterWidth = canvas.width * (editor.characterScale / 100)
    const characterHeight = character.height * (characterWidth / character.width)
    context.shadowColor = 'rgba(0, 0, 0, 0.45)'
    context.shadowBlur = 30
    context.drawImage(
      character,
      canvas.width * (editor.characterX / 100),
      canvas.height * (editor.characterY / 100),
      characterWidth,
      characterHeight
    )
    context.shadowColor = 'transparent'
    context.shadowBlur = 0
  }

  const subTextX = canvas.width * (editor.subTextX / 100)
  const subTextY = canvas.height * (editor.subTextY / 100)
  context.font = `900 34px ${editor.font}`
  const subTextWidth = context.measureText(editor.subText).width + 42
  context.fillStyle = editor.color
  context.fillRect(subTextX, subTextY - 34, subTextWidth, 52)
  context.fillStyle = '#111827'
  context.fillText(editor.subText, subTextX + 21, subTextY + 2)

  drawWrappedText(
    context,
    editor.mainText,
    canvas.width * (editor.textX / 100),
    canvas.height * (editor.textY / 100),
    canvas.width * (editor.textWidth / 100),
    editor.fontSize,
    editor.font
  )

  if (watermarked) {
    context.save()
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(-Math.PI / 11)
    context.fillStyle = 'rgba(0, 0, 0, 0.42)'
    context.fillRect(-260, -44, 520, 88)
    context.fillStyle = '#ffffff'
    context.font = '900 42px Arial Black'
    context.textAlign = 'center'
    context.fillText('PREVIEW', 0, 14)
    context.restore()
  }

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg'
  const link = document.createElement('a')
  link.href = canvas.toDataURL(mimeType, 0.92)
  link.download = `thumbnail-${Date.now()}.${format}`
  link.click()
}

const exportPreview = async (format: 'png' | 'jpg') => {
  await exportCanvas(format, true)
  const response = await $fetch<{ downloadUrl: string }>('/api/download-thumbnail', {
    method: 'POST',
    body: { thumbnailId: 'editor-custom', paid: false, format }
  })
  store.addDownload({ id: 'editor-custom', title: `Custom editor ${format.toUpperCase()}`, paid: false })
  window.alert(`Preview export prepared: ${response.downloadUrl}`)
}

const unlockHd = async () => {
  await navigateTo('/pricing?thumbnail=editor-custom&plan=single')
}
</script>

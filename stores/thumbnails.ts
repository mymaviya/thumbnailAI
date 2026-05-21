import { defineStore } from 'pinia'
import type { GeneratedThumbnail, ThumbnailTemplate } from '~/types/thumbnail'

export const useThumbnailStore = defineStore('thumbnails', {
  state: () => ({
    generated: [] as GeneratedThumbnail[],
    downloads: [] as Array<{ id: string; title: string; downloadedAt: string; paid: boolean }>,
    selectedTemplate: null as ThumbnailTemplate | null,
    editor: {
      mainText: 'YOUR VIRAL TITLE',
      subText: 'Ready for YouTube',
      color: '#ff4d5a',
      textColor: '#ffffff',
      background: '#111827',
      backgroundImage: '',
      characterImage: '',
      font: 'Impact',
      fontSize: 72,
      textX: 8,
      textY: 66,
      textWidth: 72,
      subTextX: 8,
      subTextY: 55,
      characterX: 66,
      characterY: 10,
      characterScale: 42,
      logo: ''
    }
  }),
  actions: {
    saveGenerated(thumbnail: GeneratedThumbnail) {
      this.generated.unshift(thumbnail)
    },
    setTemplate(template: ThumbnailTemplate) {
      this.selectedTemplate = template
      this.editor.mainText = template.headline
      this.editor.subText = template.subline
      this.editor.color = template.accent
    },
    useGeneratedAsBackground(thumbnail: GeneratedThumbnail) {
      this.editor.mainText = thumbnail.title.toUpperCase()
      this.editor.subText = thumbnail.category
      this.editor.backgroundImage = thumbnail.imageUrl
    },
    addDownload(payload: { id: string; title: string; paid: boolean }) {
      this.downloads.unshift({
        ...payload,
        downloadedAt: new Date().toISOString()
      })
    }
  },
  persist: false
})

import type { ThumbnailCategory } from '~/types/thumbnail'

interface GenerateThumbnailBody {
  videoTitle: string
  category: ThumbnailCategory
  mainText: string
  backgroundStyle: string
  colorTheme: string
  emotion: 'professional' | 'viral' | 'bold' | 'cinematic'
}

interface OpenAIImageResponse {
  data?: Array<{ b64_json?: string; url?: string }>
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event)
  const body = await readBody<GenerateThumbnailBody>(event)

  if (!config.openaiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'OPENAI_API_KEY is not configured on the server.'
    })
  }

  if (!body.videoTitle || !body.mainText || !body.category) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Video title, main text, and category are required.'
    })
  }

  const prompt = [
    'Create a high-converting YouTube video thumbnail.',
    'Canvas should be composed for a 16:9 thumbnail and safe to crop to 1280x720.',
    `Video title: ${body.videoTitle}.`,
    `Category: ${body.category}.`,
    `Main text on thumbnail: ${body.mainText}.`,
    `Background style: ${body.backgroundStyle || 'modern creator studio'}.`,
    `Color theme: ${body.colorTheme || 'bold complementary colors'}.`,
    `Emotion/style: ${body.emotion || 'viral'}.`,
    'Use bold readable text, strong contrast, dramatic subject placement, and no platform logos.'
  ].join(' ')

  const response = await $fetch<OpenAIImageResponse>('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: {
      model: 'gpt-image-1.5',
      prompt,
      size: '1536x1024',
      quality: 'medium',
      output_format: 'png',
      n: 1
    }
  })

  const image = response.data?.[0]
  const imageUrl = image?.b64_json
    ? `data:image/png;base64,${image.b64_json}`
    : image?.url

  if (!imageUrl) {
    throw createError({
      statusCode: 502,
      statusMessage: 'OpenAI did not return an image.'
    })
  }

  return {
    id: crypto.randomUUID(),
    title: body.videoTitle,
    category: body.category,
    prompt,
    imageUrl,
    createdAt: new Date().toISOString()
  }
})

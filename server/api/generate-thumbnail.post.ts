import type { ThumbnailCategory } from '~/types/thumbnail'

interface GenerateThumbnailBody {
  videoTitle: string
  category: ThumbnailCategory
  mainText: string
  backgroundStyle: string
  colorTheme: string
  emotion: 'professional' | 'viral' | 'bold' | 'cinematic'
  characterImage?: string
  backgroundImage?: string
}

interface OpenAIImageResponse {
  data?: Array<{ b64_json?: string; url?: string; revised_prompt?: string }>
}

export default defineEventHandler(async event => {
  const config = useRuntimeConfig(event)
  const body = await readBody<GenerateThumbnailBody>(event)
  const openaiApiKey = String(config.openaiApiKey || '').trim()

  if (!openaiApiKey || openaiApiKey === 'sk-your-key') {
    throw createError({
      statusCode: 500,
      statusMessage: 'OPENAI_API_KEY is not configured. Add your real key to .env and restart the dev server.'
    })
  }

  if (!body.videoTitle || !body.mainText || !body.category) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Video title, main text, and category are required.'
    })
  }

  const referenceImages = [
    body.characterImage ? { image_url: body.characterImage } : null,
    body.backgroundImage ? { image_url: body.backgroundImage } : null
  ].filter(Boolean)
  const hasReferenceImages = referenceImages.length > 0

  const prompt = [
    'Create a high-converting YouTube video thumbnail in a 16:9 composition.',
    'Design for 1280x720 usage with all important text and subjects inside the central safe area.',
    `Video title: ${body.videoTitle}.`,
    `Category: ${body.category}.`,
    `Main text on thumbnail: ${body.mainText}.`,
    `Background style: ${body.backgroundStyle || 'modern creator studio'}.`,
    `Color theme: ${body.colorTheme || 'bold complementary colors'}.`,
    `Emotion/style: ${body.emotion || 'viral'}.`,
    body.characterImage
      ? 'Use the first reference image as the main character or creator. Preserve the person, clothing, pose, and recognizable details as much as possible while making it thumbnail-ready.'
      : '',
    body.backgroundImage
      ? 'Use the second reference image as the background or setting. Adapt it with cinematic lighting, contrast, and depth while keeping the user-provided scene recognizable.'
      : '',
    'Use bold readable text, strong contrast, dramatic subject placement, and no platform logos.',
    'Avoid tiny text, avoid watermark marks, and keep the final image clean for YouTube upload.'
  ].filter(Boolean).join(' ')

  let response: OpenAIImageResponse

  try {
    response = await $fetch<OpenAIImageResponse>(`https://api.openai.com/v1/images/${hasReferenceImages ? 'edits' : 'generations'}`, {
      method: 'POST',
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: hasReferenceImages ? {
        model: 'gpt-image-1.5',
        images: referenceImages,
        prompt,
        size: '1536x1024',
        quality: 'medium',
        input_fidelity: 'high',
        output_format: 'png',
        n: 1
      } : {
        model: 'gpt-image-1.5',
        prompt,
        size: '1536x1024',
        quality: 'medium',
        output_format: 'png',
        n: 1
      }
    })
  } catch (error: any) {
    const message = error?.data?.error?.message || error?.data?.message || error?.message

    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: message || 'Image generation failed. Please try again.'
    })
  }

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
    prompt: image.revised_prompt || prompt,
    imageUrl,
    createdAt: new Date().toISOString()
  }
})

export type ThumbnailCategory =
  | 'Education'
  | 'Gaming'
  | 'News'
  | 'Vlog'
  | 'Business'
  | 'Tech'
  | 'Islamic'
  | 'School'
  | 'Hospital'

export interface ThumbnailTemplate {
  id: string
  title: string
  category: ThumbnailCategory
  accent: string
  gradient: string
  headline: string
  subline: string
  badge: string
  price: number
}

export interface GeneratedThumbnail {
  id: string
  title: string
  category: ThumbnailCategory
  prompt: string
  imageUrl: string
  createdAt: string
}

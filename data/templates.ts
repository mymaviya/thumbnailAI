import type { ThumbnailCategory, ThumbnailTemplate } from '~/types/thumbnail'

export const categories: ThumbnailCategory[] = [
  'Education',
  'Gaming',
  'News',
  'Vlog',
  'Business',
  'Tech',
  'Islamic',
  'School',
  'Hospital'
]

export const templates: ThumbnailTemplate[] = [
  {
    id: 'education-score-boost',
    title: 'Score Boost Class',
    category: 'Education',
    accent: '#ffd166',
    gradient: 'from-blue-600 via-skydeep to-slate-950',
    headline: 'TOP 10 STUDY HACKS',
    subline: 'Exam-ready in 7 days',
    badge: 'Education',
    price: 49
  },
  {
    id: 'gaming-final-boss',
    title: 'Final Boss Reveal',
    category: 'Gaming',
    accent: '#06d6a0',
    gradient: 'from-fuchsia-600 via-coral to-slate-950',
    headline: 'I FOUND THE FINAL BOSS',
    subline: 'Insane gameplay moment',
    badge: 'Gaming',
    price: 49
  },
  {
    id: 'news-breaking-angle',
    title: 'Breaking News Angle',
    category: 'News',
    accent: '#ef4444',
    gradient: 'from-red-700 via-slate-900 to-zinc-950',
    headline: 'BREAKING UPDATE',
    subline: 'What changed today?',
    badge: 'News',
    price: 39
  },
  {
    id: 'vlog-day-story',
    title: 'Day In My Life',
    category: 'Vlog',
    accent: '#f97316',
    gradient: 'from-orange-400 via-rose-500 to-slate-900',
    headline: 'A DAY IN MY LIFE',
    subline: 'Behind the scenes',
    badge: 'Vlog',
    price: 29
  },
  {
    id: 'business-growth',
    title: 'Growth Strategy',
    category: 'Business',
    accent: '#22c55e',
    gradient: 'from-emerald-600 via-slate-800 to-slate-950',
    headline: '5X YOUR REVENUE',
    subline: 'Simple business framework',
    badge: 'Business',
    price: 49
  },
  {
    id: 'tech-ai-toolkit',
    title: 'AI Toolkit Review',
    category: 'Tech',
    accent: '#38bdf8',
    gradient: 'from-cyan-500 via-blue-700 to-slate-950',
    headline: 'BEST AI TOOLS 2026',
    subline: 'Tested for creators',
    badge: 'Tech',
    price: 49
  },
  {
    id: 'islamic-reminder',
    title: 'Daily Reminder',
    category: 'Islamic',
    accent: '#10b981',
    gradient: 'from-teal-600 via-emerald-800 to-slate-950',
    headline: 'POWERFUL REMINDER',
    subline: 'Faith, focus, and peace',
    badge: 'Islamic',
    price: 39
  },
  {
    id: 'school-admission',
    title: 'Admission Open',
    category: 'School',
    accent: '#facc15',
    gradient: 'from-indigo-600 via-violet-700 to-slate-950',
    headline: 'ADMISSIONS OPEN',
    subline: 'New session starts soon',
    badge: 'School',
    price: 29
  },
  {
    id: 'hospital-health',
    title: 'Health Awareness',
    category: 'Hospital',
    accent: '#2dd4bf',
    gradient: 'from-teal-500 via-sky-700 to-slate-950',
    headline: 'DOCTOR EXPLAINS',
    subline: 'Health tips that matter',
    badge: 'Hospital',
    price: 39
  }
]

export const getTemplatesByCategory = (category?: string) => {
  if (!category) return templates
  return templates.filter(
    template => template.category.toLowerCase() === category.toLowerCase()
  )
}

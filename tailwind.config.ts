import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        ink: '#111827',
        coral: '#ff4d5a',
        lemon: '#ffd166',
        aqua: '#06d6a0',
        skydeep: '#118ab2'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(17, 24, 39, 0.12)'
      }
    }
  }
}

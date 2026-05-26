<template>
  <div>
    <PageHero
      eyebrow="Account access"
      title="Login with Google"
      description="Use your Google account to generate thumbnails, manage payments, and download HD files securely."
    />

    <section class="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <img v-if="user?.avatar" :src="user.avatar" alt="" class="mx-auto size-16 rounded-full object-cover">
        <h2 class="mt-4 text-2xl font-black text-ink">{{ user ? `Signed in as ${user.name}` : 'Welcome back' }}</h2>
        <p class="mt-3 leading-7 text-slate-600">
          Google login keeps your generated thumbnails, payment status, and HD downloads tied to your account.
        </p>
        <p v-if="loginError" class="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">
          {{ loginError }}
        </p>

        <div class="mt-6 grid gap-3">
          <a
            v-if="!user"
            href="/api/auth/google"
            class="inline-flex items-center justify-center gap-3 rounded-md border border-slate-300 bg-white px-5 py-3 font-black text-ink shadow-sm hover:border-coral hover:text-coral"
          >
            <span class="grid size-6 place-items-center rounded-full border border-slate-300 text-sm font-black">G</span>
            Continue with Google
          </a>
          <NuxtLink
            v-else
            to="/dashboard"
            class="rounded-md bg-coral px-5 py-3 font-black text-white hover:bg-red-500"
          >
            Go to Dashboard
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Login - AI Thumbnail Maker',
  'Login with Google to manage generated thumbnails, paid downloads, and creator account settings.',
  '/login',
  { noindex: true }
)

const { data } = await useFetch<{ user: any }>('/api/auth/me', {
  credentials: 'include'
})
const user = computed(() => data.value?.user)
const route = useRoute()
const loginError = computed(() => {
  if (route.query.error === 'google_oauth_failed') {
    return 'Google login could not be completed. Please check the hosted Google OAuth environment values and try again.'
  }
  return ''
})
</script>

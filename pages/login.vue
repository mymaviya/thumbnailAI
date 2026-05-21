<template>
  <div>
    <PageHero
      eyebrow="Account access"
      title="Login or register"
      description="A polished authentication UI ready to connect with your preferred auth provider."
    />
    <section class="mx-auto grid max-w-5xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8">
      <form class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-2xl font-black">Login</h2>
        <label class="mt-5 grid gap-2 font-bold">Email
          <input type="email" class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="creator@example.com">
        </label>
        <label class="mt-4 grid gap-2 font-bold">Password
          <input type="password" class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="••••••••">
        </label>
        <button class="mt-6 w-full rounded-md bg-coral px-4 py-3 font-black text-white">Login</button>
      </form>
      <form class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-2xl font-black">Register</h2>
        <label class="mt-5 grid gap-2 font-bold">Name
          <input class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="Channel owner">
        </label>
        <label class="mt-4 grid gap-2 font-bold">Email
          <input type="email" class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="you@example.com">
        </label>
        <label class="mt-4 grid gap-2 font-bold">Password
          <input type="password" class="focus-ring rounded-md border border-slate-300 px-4 py-3" placeholder="Create password">
        </label>
        <button class="mt-6 w-full rounded-md bg-ink px-4 py-3 font-black text-white">Create Account</button>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
usePageSeo(
  'Login - AI Thumbnail Maker',
  'Login or register to manage generated thumbnails, downloads, and creator account settings.',
  '/login'
)
</script>

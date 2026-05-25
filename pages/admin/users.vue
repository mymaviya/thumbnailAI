<template>
  <div>
    <PageHero
      eyebrow="Admin"
      title="Users"
      description="Review Google-authenticated users, roles, generated thumbnails, and downloads."
    />

    <section class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead class="bg-slate-50 text-xs font-black uppercase text-slate-500">
            <tr>
              <th class="px-4 py-3">User</th>
              <th class="px-4 py-3">Role</th>
              <th class="px-4 py-3">Thumbnails</th>
              <th class="px-4 py-3">Downloads</th>
              <th class="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="user in users" :key="user.id">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <img v-if="user.avatar" :src="user.avatar" alt="" class="size-10 rounded-full object-cover">
                  <div>
                    <p class="font-black text-ink">{{ user.name }}</p>
                    <p class="text-slate-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="rounded bg-slate-100 px-2 py-1 text-xs font-black uppercase text-slate-700">{{ user.role }}</span>
              </td>
              <td class="px-4 py-3 font-semibold">{{ user.totalThumbnails }}</td>
              <td class="px-4 py-3 font-semibold">{{ user.totalDownloads }}</td>
              <td class="px-4 py-3 text-slate-600">{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

usePageSeo(
  'Admin Users - AI Thumbnail Maker',
  'Admin user list for AI Thumbnail Maker.',
  '/admin/users'
)

const { data } = await useFetch<{ users: any[] }>('/api/admin/users', {
  credentials: 'include'
})
const users = computed(() => data.value?.users || [])
const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>

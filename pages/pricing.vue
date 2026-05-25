<template>
  <div>
    <PageHero
      eyebrow="HD downloads"
      title="Unlock watermark-free thumbnails"
      description="Generate or select a thumbnail, preview it with a watermark, then unlock HD downloads after payment."
    />
    <section class="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <h2 class="text-xl font-black">{{ plan.name }}</h2>
            <p class="mt-2 text-slate-600">{{ plan.description }}</p>
          </div>
          <span v-if="plan.badge" class="rounded bg-lemon px-2 py-1 text-xs font-black text-ink">{{ plan.badge }}</span>
        </div>
        <p class="mt-6 text-4xl font-black">{{ plan.price }}</p>
        <ul class="mt-6 space-y-3 text-sm font-semibold text-slate-600">
          <li v-for="feature in plan.features" :key="feature">✓ {{ feature }}</li>
        </ul>
        <button
          class="mt-6 w-full rounded-md bg-ink px-4 py-3 font-black text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loadingPlan === plan.id"
          @click="payWithRazorpay(plan)"
        >
          {{ loadingPlan === plan.id ? 'Opening Razorpay...' : 'Pay and Unlock' }}
        </button>
      </article>
    </section>

    <section v-if="paymentStatus || paymentError" class="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <p v-if="paymentStatus" class="rounded-md bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{{ paymentStatus }}</p>
      <p v-if="paymentError" class="rounded-md bg-red-50 p-4 text-sm font-bold text-red-700">{{ paymentError }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void }
  }
}

interface PricingPlan {
  id: string
  name: string
  price: string
  amount: number
  description: string
  badge?: string
  features: string[]
}

interface RazorpayOrderResponse {
  orderId: string
  paymentRecordId: string
  keyId: string
  provider: string
  plan: string
  thumbnailId: string | null
  amount: number
  currency: string
}

interface RazorpayHandlerResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface VerifyResponse {
  verified: boolean
  downloadUrl: string
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: RazorpayHandlerResponse) => void
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
  modal?: {
    ondismiss?: () => void
  }
}

usePageSeo(
  'Pricing - AI Thumbnail Maker',
  'Unlock watermark-free HD thumbnail downloads with single, pack, and monthly pricing plans.',
  '/pricing'
)

const route = useRoute()
const store = useThumbnailStore()
const selectedThumbnail = computed(() => String(route.query.thumbnail || 'selected-thumbnail'))
const loadingPlan = ref('')
const paymentStatus = ref('')
const paymentError = ref('')

const plans: PricingPlan[] = [
  {
    id: 'single',
    name: 'Single Thumbnail',
    price: '₹49',
    amount: 49,
    description: 'Best for one final YouTube upload.',
    features: ['1 HD download', 'No watermark', 'PNG or JPG export']
  },
  {
    id: 'pack-5',
    name: '5 Thumbnail Pack',
    price: '₹99',
    amount: 99,
    description: 'For creators preparing a batch of videos.',
    badge: 'Value',
    features: ['5 HD downloads', 'No watermark', 'Use across templates or AI generations']
  },
  {
    id: 'monthly',
    name: 'Monthly Unlimited',
    price: '₹299 – ₹999',
    amount: 299,
    description: 'For regular creators and channel teams.',
    features: ['Unlimited HD downloads', 'No watermark', 'Best for ongoing publishing']
  }
]

const loadRazorpayCheckout = () => new Promise<void>((resolve, reject) => {
  if (window.Razorpay) {
    resolve()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://checkout.razorpay.com/v1/checkout.js'
  script.onload = () => resolve()
  script.onerror = () => reject(new Error('Unable to load Razorpay Checkout.'))
  document.head.appendChild(script)
})

const payWithRazorpay = async (plan: PricingPlan) => {
  loadingPlan.value = plan.id
  paymentStatus.value = ''
  paymentError.value = ''

  try {
    await loadRazorpayCheckout()
    const order = await $fetch<RazorpayOrderResponse>('/api/payments/create-order', {
      method: 'POST',
      body: {
        plan: plan.name,
        amount: plan.amount,
        currency: 'INR',
        thumbnailId: selectedThumbnail.value
      }
    })

    const RazorpayCheckout = window.Razorpay
    if (!RazorpayCheckout) {
      throw new Error('Razorpay Checkout is unavailable.')
    }

    const checkout = new RazorpayCheckout({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'AI Thumbnail Maker',
      description: `${plan.name} HD download`,
      order_id: order.orderId,
      notes: {
        plan: plan.name,
        thumbnailId: selectedThumbnail.value
      },
      theme: {
        color: '#ff4d5a'
      },
      modal: {
        ondismiss: () => {
          loadingPlan.value = ''
        }
      },
      handler: async response => {
        try {
          const verified = await $fetch<VerifyResponse>('/api/payments/verify', {
            method: 'POST',
            body: {
              ...response,
              thumbnailId: selectedThumbnail.value
            }
          })
          store.addDownload({ id: selectedThumbnail.value, title: `${plan.name} HD download`, paid: true })
          paymentStatus.value = 'Payment verified. Your watermark-free HD download is unlocked.'
          if (verified.downloadUrl) {
            window.location.href = verified.downloadUrl
          }
        } catch (error: any) {
          paymentError.value = error?.data?.message || 'Payment could not be verified. Please contact support with your payment ID.'
        } finally {
          loadingPlan.value = ''
        }
      }
    })

    checkout.open()
  } catch (error: any) {
    paymentError.value = error?.data?.message || error?.message || 'Unable to start Razorpay payment.'
    loadingPlan.value = ''
  }
}
</script>

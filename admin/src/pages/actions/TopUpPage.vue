<template>
  <q-page class="topup-page q-pa-md q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="back-btn q-mr-lg" />
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">Top Up Wallet</div>
        <div class="text-subtitle1 text-grey-7">Add funds to your SwiftPay balance</div>
      </div>
    </div>

    <div class="row q-col-gutter-xl justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <q-card class="premium-topup-card no-border no-shadow q-pa-none overflow-hidden row items-stretch">
          <!-- Left Side: Balance & Summary -->
          <div class="col-12 col-md-5 bg-primary text-white q-pa-lg q-pa-sm-xl column justify-center text-center relative-position">
            <div class="glass-orb-top"></div>
            <div class="text-subtitle1 opacity-70 q-mb-sm">Current Balance</div>
            <div class="text-h3 text-weight-bolder q-mb-xl">Rs {{ accountStore.balance.toLocaleString('en-PK', { minimumFractionDigits: 2 }) }}</div>
            
            <q-separator dark class="q-my-xl opacity-20" />
            
            <div class="row items-center justify-between q-mb-md">
              <div class="text-subtitle2 opacity-60">Top Up Limit</div>
              <div class="text-subtitle2 text-weight-bold">Rs 50,000.00</div>
            </div>
            <div class="limit-progress q-mb-xl">
              <div class="limit-bar" style="width: 65%"></div>
            </div>
          </div>

          <!-- Right Side: Action -->
          <div class="col-12 col-md-7 q-pa-lg q-pa-sm-xl bg-white">
            <div class="text-subtitle1 text-weight-bold q-mb-md">Enter Amount</div>
            <q-input 
              v-model.number="amount" 
              type="number"
              placeholder="0.00" 
              outlined 
              rounded
              bg-color="grey-1"
              prefix="Rs"
              class="custom-amount-input q-mb-xl"
            />

            <div class="text-subtitle1 text-weight-bold q-mb-md">Payment Method</div>
            <div class="column q-gutter-y-sm q-mb-xl">
              <q-card 
                v-for="method in paymentMethods" 
                :key="method.id" 
                class="method-card no-border no-shadow q-pa-md cursor-pointer"
                :class="{ 'active-method': selectedMethod === method.id }"
                @click="selectedMethod = method.id"
                v-ripple
              >
                <div class="row items-center">
                  <q-icon :name="method.icon" :color="selectedMethod === method.id ? 'primary' : 'grey-7'" size="28px" class="q-mr-md" />
                  <div class="column">
                    <div class="text-weight-bold">{{ method.name }}</div>
                    <div class="text-caption text-grey-6">{{ method.info }}</div>
                  </div>
                  <q-space />
                  <q-radio v-model="selectedMethod" :val="method.id" dense color="primary" />
                </div>
              </q-card>
            </div>

            <q-btn 
              label="Add Funds Now" 
              color="primary" 
              class="full-width q-py-lg text-weight-bolder btn-topup" 
              rounded 
              unelevated
              no-caps
              :disable="!amount || !selectedMethod"
              :loading="loading"
              @click="processTopUp"
            >
              <q-icon name="add_circle" class="q-ml-md" />
            </q-btn>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAccountStore } from 'src/stores/account'
import { request } from 'src/api'

const $q = useQuasar()
const router = useRouter()
const accountStore = useAccountStore()

const amount = ref<number | null>(null)
const selectedMethod = ref(1)
const loading = ref(false)

const paymentMethods = [
  { id: 1, name: 'Visa Personal', info: 'Ending in 4290', icon: 'credit_card' },
  { id: 2, name: 'HBL Savings', info: 'Acc: 0042XXXX78', icon: 'account_balance' },
  { id: 3, name: 'Apple Pay', icon: 'apple' }
]

onMounted(async () => {
  await accountStore.fetchDashboardData()
})

const processTopUp = async () => {
  if (!amount.value) return

  loading.value = true
  try {
    await request('/transactions/top-up', {
      method: 'POST',
      body: JSON.stringify({ amount: amount.value })
    })

    // Refresh store data
    await accountStore.fetchDashboardData()
    
    $q.notify({
      type: 'positive',
      message: 'Funds Added Successfully!',
      caption: `Rs ${amount.value} added to your wallet`,
      position: 'top',
      timeout: 3000
    })
    
    await router.push('/')
  } catch (e: unknown) {
    const err = e as Error;
    $q.notify({
      type: 'negative',
      message: 'Top-up failed',
      caption: err.message || 'Please try again later'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.topup-page {
  background: #fbfcfe;
}

.premium-topup-card {
  border-radius: 40px;
  box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.1) !important;
}

.glass-orb-top {
  position: absolute;
  top: -100px;
  left: -100px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}

.limit-progress {
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.limit-bar {
  height: 100%;
  background: white;
  border-radius: 4px;
}

.custom-amount-input :deep(.q-field__control) {
  height: 72px;
  font-size: 24px;
  font-weight: 700;
}

.method-card {
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;
}

.method-card:hover {
  background: #f8fafc;
  border-color: var(--q-primary);
}

.method-card.active-method {
  border-color: var(--q-primary);
  background: rgba(59, 130, 246, 0.05);
}

.btn-topup {
  height: 64px;
  transition: all 0.3s ease;
}

.btn-topup:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.3);
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.opacity-70 { opacity: 0.7; }
.opacity-60 { opacity: 0.6; }
.opacity-20 { opacity: 0.2; }
</style>


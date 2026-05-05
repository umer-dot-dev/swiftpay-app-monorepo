<template>
  <q-page class="zakat-page q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="q-mr-sm" />
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">Zakat Calculator</div>
        <div class="text-subtitle1 text-grey-7">Calculate and fulfill your religious obligation</div>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Calculator Inputs -->
      <div class="col-12 col-md-7">
        <q-card class="no-border no-shadow border-radius-32 q-pa-lg q-pa-sm-xl bg-blend">
          <div class="text-h6 text-weight-bold q-mb-lg flex items-center">
            <q-icon name="account_balance_wallet" color="primary" class="q-mr-sm" />
            Liquid Assets (Cash & Bank)
          </div>
          
          <div class="row q-col-gutter-md q-mb-xl">
            <div class="col-12">
              <q-input 
                outlined 
                v-model.number="assets.bankBalance" 
                label="Cash in Bank (SwiftPay)" 
                prefix="Rs."
                readonly
                class="bg-blue-min"
              >
                <template v-slot:append>
                  <q-chip size="sm" color="blue-1" text-color="primary" label="Auto-filled" />
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input 
                outlined 
                v-model.number="assets.otherCash" 
                label="Other Cash in Hand" 
                prefix="Rs."
                type="number"
              />
            </div>
          </div>

          <div class="text-h6 text-weight-bold q-mb-lg flex items-center">
            <q-icon name="monetization_on" color="amber-8" class="q-mr-sm" />
            Gold & Silver
          </div>
          
          <div class="row q-col-gutter-md q-mb-xl">
            <div class="col-12 col-sm-6">
              <q-input 
                outlined 
                v-model.number="assets.gold" 
                label="Gold Value" 
                prefix="Rs."
                type="number"
                hint="Total market value of gold assets"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input 
                outlined 
                v-model.number="assets.silver" 
                label="Silver Value" 
                prefix="Rs."
                type="number"
                hint="Total market value of silver assets"
              />
            </div>
          </div>

          <div class="text-h6 text-weight-bold q-mb-lg flex items-center">
            <q-icon name="trending_up" color="green" class="q-mr-sm" />
            Other Wealth
          </div>
          
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-12 col-sm-6">
              <q-input 
                outlined 
                v-model.number="assets.investments" 
                label="Investments & Stocks" 
                prefix="Rs."
                type="number"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input 
                outlined 
                v-model.number="assets.business" 
                label="Business Goods/Assets" 
                prefix="Rs."
                type="number"
              />
            </div>
          </div>

          <q-separator q-my-xl />

          <div class="text-h6 text-weight-bold q-mb-lg flex items-center text-negative">
            <q-icon name="remove_circle" color="negative" class="q-mr-sm" />
            Liabilities (Deductions)
          </div>
          
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <q-input 
                outlined 
                v-model.number="assets.debts" 
                label="Debts & Bills Due" 
                prefix="Rs."
                type="number"
                color="negative"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Results Sidebar -->
      <div class="col-12 col-md-5">
        <q-card class="result-card no-border no-shadow border-radius-32 q-pa-xl sticky-results overflow-hidden">
          <div class="glass-bg"></div>
          
          <div class="relative-position">
            <div class="text-h6 text-white opacity-80 q-mb-xs">Your Net Wealth</div>
            <div class="text-h3 text-white text-weight-bolder q-mb-xl tracking-tight">
              Rs. {{ netWealth.toLocaleString() }}
            </div>

            <q-list dark padding class="q-mb-xl">
              <q-item class="q-pa-none q-mb-sm">
                <q-item-section>Total Assets</q-item-section>
                <q-item-section side class="text-white text-weight-bold">Rs. {{ totalAssets.toLocaleString() }}</q-item-section>
              </q-item>
              <q-item class="q-pa-none">
                <q-item-section>Total Deductions</q-item-section>
                <q-item-section side class="text-red-3 text-weight-bold">- Rs. {{ assets.debts.toLocaleString() }}</q-item-section>
              </q-item>
            </q-list>

            <div class="calculation-box q-pa-lg border-radius-24 q-mb-xl">
              <div class="text-subtitle2 text-white opacity-70 q-mb-sm uppercase tracking-widest text-weight-bold">Payable Zakat (2.5%)</div>
              <div :class="$q.screen.lt.sm ? 'text-h3' : 'text-h2'" class="text-white text-weight-bolder tracking-tighter">
                Rs. {{ Math.round(zakatAmount).toLocaleString() }}
              </div>
            </div>

            <div v-if="netWealth < nisabValue" class="nisab-warning q-pa-md border-radius-16 q-mb-xl text-center">
              <q-icon name="info" color="white" size="sm" class="q-mr-sm" />
              Wealth is below Nisab (Rs. {{ nisabValue.toLocaleString() }})
            </div>

            <q-btn 
              unelevated 
              color="white" 
              text-color="primary" 
              label="Fulfill Zakat Obligation" 
              class="full-width q-py-lg text-weight-bold border-radius-16 text-subtitle1"
              no-caps
              :disable="zakatAmount <= 0"
              @click="showPayDialog = true"
            />
            
            <p class="text-white opacity-60 text-center q-mt-md text-caption">
              Calculated based on current lunar year practices.
            </p>
          </div>
        </q-card>
      </div>
    </div>

    <!-- Payment Dialog -->
    <q-dialog v-model="showPayDialog" persistent>
      <q-card class="border-radius-32 q-pa-lg" style="width: 100%; max-width: 450px">
        <q-card-section class="column items-center q-pb-none">
          <q-avatar size="80px" color="blue-1" text-color="primary" icon="volunteer_activism" class="q-mb-md" />
          <div class="text-h5 text-weight-bold">Confirm Zakat Payment</div>
          <p class="text-grey-7 text-center q-mt-sm">You are transferring Rs. {{ zakatAmount.toLocaleString() }} from your wallet to the SwiftPay Zakat Fund.</p>
        </q-card-section>

        <q-card-section>
          <div class="bg-grey-1 q-pa-md border-radius-16">
            <div class="row justify-between q-mb-xs">
              <span class="text-grey-7">Current Balance</span>
              <span class="text-weight-bold">Rs. {{ accountStore.balance.toLocaleString() }}</span>
            </div>
            <div class="row justify-between text-negative q-mb-xs">
              <span>Zakat Amount</span>
              <span class="text-weight-bold">- Rs. {{ zakatAmount.toLocaleString() }}</span>
            </div>
            <q-separator q-my-sm />
            <div class="row justify-between text-subtitle1">
              <span class="text-weight-bold">Remaining</span>
              <span class="text-weight-bolder text-primary">Rs. {{ (accountStore.balance - zakatAmount).toLocaleString() }}</span>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="row q-col-gutter-sm">
          <div class="col-6">
            <q-btn flat label="Cancel" color="grey-7" no-caps class="full-width q-py-md text-weight-bold" v-close-popup />
          </div>
          <div class="col-6">
            <q-btn unelevated label="Confirm Pay" color="primary" no-caps class="full-width q-py-md text-weight-bold border-radius-16" @click="handleZakatPayment" :loading="isPaying" />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAccountStore } from '../../stores/account'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const accountStore = useAccountStore()

const assets = ref({
  bankBalance: 0,
  otherCash: 0,
  gold: 0,
  silver: 0,
  investments: 0,
  business: 0,
  debts: 0
})

const nisabValue = ref(85000) // Mock Nisab for Silver (approx 52.5 tolas)
const showPayDialog = ref(false)
const isPaying = ref(false)

onMounted(async () => {
  if (accountStore.balance === 0) {
    await accountStore.fetchDashboardData()
  }
  assets.value.bankBalance = accountStore.balance
})

const totalAssets = computed(() => {
  return assets.value.bankBalance + 
         assets.value.otherCash + 
         assets.value.gold + 
         assets.value.silver + 
         assets.value.investments + 
         assets.value.business
})

const netWealth = computed(() => {
  return totalAssets.value - assets.value.debts
})

const zakatAmount = computed(() => {
  if (netWealth.value < nisabValue.value) return 0
  return Math.max(0, netWealth.value * 0.025)
})

const handleZakatPayment = () => {
  if (zakatAmount.value > accountStore.balance) {
    $q.notify({ message: 'Insufficient balance to pay full zakat amount', color: 'negative', position: 'top', icon: 'error' })
    return
  }

  isPaying.value = true
  
  try {
    // Simulation of balance deduction
    accountStore.balance -= zakatAmount.value
    
    $q.notify({
      message: 'Zakat Payment Successful',
      caption: `Rs. ${zakatAmount.value.toLocaleString()} transferred to Zakat Fund`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      timeout: 3000
    })
    
    showPayDialog.value = false
    void router.push('/')
  } catch {
    $q.notify({ message: 'Payment failed, please try again', color: 'negative' })
  } finally {
    isPaying.value = false
  }
}
</script>

<style scoped>
.zakat-page {
  background-color: #fbfcfe;
  overflow-x: hidden;
}

.border-radius-32 { border-radius: 32px !important; }
.border-radius-24 { border-radius: 24px !important; }
.border-radius-16 { border-radius: 16px !important; }

.bg-blend {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.bg-blue-min {
  background-color: #f0f7ff !important;
}

.result-card {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  position: relative;
  min-height: 500px;
  color: white;
}

.glass-bg {
  position: absolute;
  top: -50%;
  right: -20%;
  width: 100%;
  height: 150%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  transform: rotate(-15deg);
}

.calculation-box {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

.nisab-warning {
  background: rgba(255, 152, 0, 0.15);
  border: 1px solid rgba(255, 152, 0, 0.3);
  color: #fff;
}

.sticky-results {
  position: sticky;
  top: 24px;
}

.tracking-tight { letter-spacing: -0.05em; }
.tracking-tighter { letter-spacing: -0.07em; }

.opacity-80 { opacity: 0.8; }
.opacity-70 { opacity: 0.7; }
.opacity-60 { opacity: 0.6; }

@media (max-width: 1023px) {
  .sticky-results {
    position: static;
    margin-top: 24px;
  }
}
</style>

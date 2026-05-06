<template>
  <q-page class="wallet-page q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">{{ $t('my_wallet') }}</div>
        <div class="text-subtitle1 text-grey-7">Your financial overview</div>
      </div>
      <q-btn v-if="$q.screen.gt.xs" color="accent" icon="add" label="Add Funds" rounded unelevated no-caps class="q-px-lg q-py-md text-weight-bold shadow-2 shadow-transition q-btn--push" @click="showAddFunds = true" />
      <q-btn v-else color="accent" icon="add" round unelevated class="shadow-2 shadow-transition q-btn--push" @click="showAddFunds = true" />
    </div>

    <div class="row q-col-gutter-xl">
      <!-- Balance & Main Action -->
      <div class="col-12 col-md-7">
        <div class="row justify-center justify-md-start">
          <q-card class="balance-card text-white no-border no-shadow q-pa-lg q-pa-sm-xl border-radius-32 position-relative overflow-hidden">
            <div class="glass-overlay"></div>
            <div class="row justify-between items-start position-relative card-top-layer">
              <div class="column">
                <div class="text-subtitle1 opacity-80 text-uppercase tracking-widest q-mb-sm">Total Balance</div>
                <div class="balance-amount text-weight-bolder tracking-tight">Rs {{ accountStore.balance.toLocaleString('en-PK', { minimumFractionDigits: 2 }) }}</div>
                <div class="row items-center q-mt-sm">
                  <q-icon name="trending_up" color="green-4" size="24px" class="q-mr-sm" />
                  <span class="text-green-4 text-weight-bold">+2.4%</span>
                  <span class="opacity-80 q-ml-sm">vs last month</span>
                </div>
              </div>
              <q-btn flat round color="white" icon="more_horiz" />
            </div>
            
            <div class="row q-gutter-x-md position-relative card-top-layer">
              <q-btn color="white" text-color="primary" label="Withdraw" icon="arrow_upward" rounded unelevated no-caps class="q-px-md q-px-sm-lg q-py-sm text-weight-bold col-auto" @click="showWithdraw = true" />
              <q-btn outline color="white" label="Exchange" icon="currency_exchange" rounded unelevated no-caps class="q-px-md q-px-sm-lg q-py-sm text-weight-bold col-auto" @click="showExchange = true" />
            </div>
          </q-card>
        </div>

        <div class="text-h6 text-weight-bold q-mb-lg q-mt-xl">Saving Goals</div>
        <div class="row q-col-gutter-md">
          <div v-for="goal in goals" :key="goal.title" class="col-12 col-sm-6">
            <q-card class="no-border no-shadow border-radius-24 bg-white q-pa-lg card-hover">
              <div class="row items-center justify-between q-mb-md">
                <q-avatar :color="goal.color + '-1'" :text-color="goal.color" :icon="goal.icon" />
                <div class="text-caption text-weight-bold color-grey">{{ goal.percent }}%</div>
              </div>
              <div class="text-weight-bold text-h6">{{ goal.title }}</div>
              <div class="text-grey-6 q-mb-md">Rs {{ goal.saved.toLocaleString() }} / Rs {{ goal.target.toLocaleString() }}</div>
              <q-linear-progress rounded size="8px" :value="goal.percent / 100" :color="goal.color" class="q-mt-sm" />
            </q-card>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="col-12 col-md-5">
        <div class="text-h6 text-weight-bold q-mb-lg">Monthly Breakdown</div>
        <q-card class="no-border no-shadow q-pa-lg q-pa-sm-xl bg-white border-radius-32">
          <div class="row items-end justify-between q-mb-lg">
            <div class="column">
              <div class="text-grey-6 text-uppercase tracking-widest text-caption">Total Spent</div>
              <div class="text-h4 text-weight-bold text-dark">Rs 245,000.00</div>
            </div>
            <q-btn flat round color="primary" icon="refresh" />
          </div>

          <q-list class="q-gutter-y-md">
            <q-item v-for="cat in spendings" :key="cat.name" class="q-pa-sm border-radius-16">
              <q-item-section avatar>
                <q-avatar :color="cat.color + '-1'" :text-color="cat.color" :icon="cat.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ cat.name }}</q-item-label>
                <q-linear-progress rounded size="6px" :value="cat.amount / 245000" :color="cat.color" class="q-mt-xs" />
              </q-item-section>
              <q-item-section side>
                <span class="text-weight-bold text-dark">Rs {{ cat.amount.toLocaleString() }}</span>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <!-- Interactive Modals -->
    <q-dialog v-model="showAddFunds" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 420px;">
        <q-card-section class="q-pa-lg row items-center justify-between pb-none">
          <div class="text-h5 text-weight-bolder text-dark">Add Funds</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        <q-card-section class="q-pa-lg pt-none">
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-sm text-weight-bold">Amount to Deposit</div>
          <q-input v-model="addAmount" outlined type="number" rounded class="q-mb-md text-h5 add-funds-input" placeholder="0.00">
             <template v-slot:prepend><div class="text-weight-bold text-dark q-pl-sm">Rs</div></template>
          </q-input>
          
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-sm q-mt-lg text-weight-bold">Funding Source</div>
          <q-select v-model="fundSource" :options="['Bank Account (**** 1234)', 'Credit Card (**** 5678)', 'Apple Pay']" outlined rounded class="q-mb-xl text-weight-medium bg-grey-1" behavior="menu" />
          
          <q-btn color="primary" label="Confirm Deposit" unelevated rounded class="full-width q-py-md text-weight-bold text-subtitle1 shadow-1" @click="confirmAddFunds" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showWithdraw" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 420px;">
        <q-card-section class="q-pa-lg row items-center justify-between pb-none">
          <div class="text-h5 text-weight-bolder text-dark">Withdraw Funds</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        <q-card-section class="q-pa-lg pt-none">
          <div class="row justify-between items-center q-mb-sm">
            <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest text-weight-bold">Amount</div>
            <div class="text-caption text-primary text-weight-bold">Available: Rs {{ accountStore.balance.toLocaleString('en-PK', { minimumFractionDigits: 2 }) }}</div>
          </div>
          <q-input v-model="withdrawAmount" outlined type="number" rounded class="q-mb-md text-h5 add-funds-input" placeholder="0.00">
             <template v-slot:prepend><div class="text-weight-bold text-dark q-pl-sm">Rs</div></template>
          </q-input>
          
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-sm q-mt-lg text-weight-bold">Destination</div>
          <q-select v-model="withdrawDestination" :options="['Chase Checking (**** 1234)', 'PayPal (user@email.com)']" outlined rounded class="q-mb-xl text-weight-medium bg-grey-1" behavior="menu" />
          
          <q-btn color="dark" label="Initiate Withdrawal" unelevated rounded class="full-width q-py-md text-weight-bold text-subtitle1 shadow-1" @click="confirmWithdraw" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showExchange" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 420px;">
        <q-card-section class="q-pa-lg row items-center justify-between pb-none">
          <div class="text-h5 text-weight-bolder text-dark">Currency Exchange</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>
        <q-card-section class="q-pa-lg pt-none">
          <div class="row items-center justify-between q-mb-md">
            <div class="col-5">
              <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs text-weight-bold">From</div>
              <q-select v-model="exchangeFrom" :options="['PKR', 'USD', 'EUR', 'GBP']" outlined rounded class="text-weight-bold" behavior="menu" />
            </div>
            <div class="col-2 text-center q-pt-md">
               <q-btn icon="swap_horiz" round flat color="primary" class="bg-blue-1" @click="swapCurrencies" />
            </div>
            <div class="col-5">
              <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-xs text-weight-bold">To</div>
              <q-select v-model="exchangeTo" :options="['EUR', 'USD', 'GBP', 'PKR']" outlined rounded class="text-weight-bold" behavior="menu" />
            </div>
          </div>
          
          <q-input v-model="exchangeAmount" outlined type="number" rounded class="q-mb-sm text-h5 q-mt-lg add-funds-input" placeholder="Amount">
             <template v-slot:append>
               <span class="text-subtitle1 text-grey-6 text-weight-bold q-pr-sm">{{ exchangeFrom }}</span>
             </template>
          </q-input>
          
          <div class="row justify-between items-center q-mb-xl q-px-sm">
             <div class="text-caption text-grey-6">Conversion Rate</div>
             <div class="text-caption text-weight-bold text-primary">1 {{ exchangeFrom }} = {{ mockRate }} {{ exchangeTo }}</div>
          </div>
          
          <q-btn color="primary" label="Complete Exchange" unelevated rounded class="full-width q-py-md text-weight-bold text-subtitle1 shadow-1" @click="confirmExchange" />
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAccountStore } from 'src/stores/account'
import { request } from 'src/api'

const $q = useQuasar()
const accountStore = useAccountStore()

onMounted(async () => {
  await accountStore.fetchDashboardData()
})

// State for Modals
const showAddFunds = ref(false)
const addAmount = ref('')
const fundSource = ref('Bank Account (**** 1234)')

const showWithdraw = ref(false)
const withdrawAmount = ref('')
const withdrawDestination = ref('Chase Checking (**** 1234)')

const showExchange = ref(false)
const exchangeFrom = ref('PKR')
const exchangeTo = ref('USD')
const exchangeAmount = ref('')

const mockRates: Record<string, number> = {
  'USD-EUR': 0.92,
  'EUR-USD': 1.09,
  'USD-GBP': 0.79,
  'GBP-USD': 1.27,
  'EUR-GBP': 0.86,
  'GBP-EUR': 1.17,
  'USD-USD': 1,
  'EUR-EUR': 1,
  'GBP-GBP': 1,
  'PKR-USD': 0.0036,
  'USD-PKR': 278.50,
  'PKR-EUR': 0.0033,
  'EUR-PKR': 301.20,
  'PKR-GBP': 0.0028,
  'GBP-PKR': 352.40
}

const mockRate = computed(() => {
  return mockRates[`${exchangeFrom.value}-${exchangeTo.value}`] || 1
})

const swapCurrencies = () => {
  const temp = exchangeFrom.value
  exchangeFrom.value = exchangeTo.value
  exchangeTo.value = temp
}

const confirmAddFunds = async () => {
  if (!addAmount.value) return;
  try {
    await request('/transactions/top-up', {
      method: 'POST',
      body: JSON.stringify({ amount: parseFloat(addAmount.value) })
    })
    await accountStore.fetchDashboardData()
    showAddFunds.value = false
    $q.notify({
      message: `Successfully deposited Rs ${addAmount.value}`,
      color: 'positive',
      icon: 'check_circle',
      position: 'top',
      classes: 'text-weight-bold',
      timeout: 2500
    })
    addAmount.value = ''
  } catch (error: unknown) {
    const err = error as Error;
    $q.notify({
      type: 'negative',
      message: 'Deposit failed',
      caption: err.message
    })
  }
}

const confirmWithdraw = () => {
  if (!withdrawAmount.value) return;
  showWithdraw.value = false
  $q.notify({
    message: `Withdrawal of Rs ${withdrawAmount.value} initiated`,
    color: 'positive',
    icon: 'check_circle',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 2500
  })
  withdrawAmount.value = ''
}

const confirmExchange = () => {
  if (!exchangeAmount.value) return;
  showExchange.value = false
  const converted = (parseFloat(exchangeAmount.value) * mockRate.value).toFixed(2)
  $q.notify({
    message: `Converted ${exchangeAmount.value} ${exchangeFrom.value} to ${converted} ${exchangeTo.value}`,
    color: 'primary',
    icon: 'currency_exchange',
    position: 'top',
    classes: 'text-weight-bold',
    timeout: 2500
  })
  exchangeAmount.value = ''
}

const goals = ref([
  { title: 'MacBook Pro', saved: 150000, target: 450000, percent: 33, icon: 'laptop_mac', color: 'blue' },
  { title: 'Summer Trip', saved: 80000, target: 400000, percent: 20, icon: 'flight_takeoff', color: 'teal' }
])

const spendings = ref([
  { name: 'Shopping', amount: 85000, icon: 'shopping_bag', color: 'purple' },
  { name: 'Housing', amount: 90000, icon: 'home', color: 'blue' },
  { name: 'Food & Groceries', amount: 45000, icon: 'restaurant', color: 'orange' },
  { name: 'Transport', amount: 25000, icon: 'directions_car', color: 'green' }
])
</script>

<style scoped>
.wallet-page {
  background: #fbfcfe;
}

.border-radius-32 {
  border-radius: 32px !important;
}

.border-radius-24 {
  border-radius: 24px !important;
}

.border-radius-16 {
  border-radius: 16px !important;
}

.border-radius-top-32 {
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.pb-none { padding-bottom: 0 !important; }
.pt-none { padding-top: 0 !important; }

.add-funds-input:deep(.q-field__control) {
  padding: 0 16px;
  font-weight: bold;
}

.balance-card {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  box-shadow: 0 30px 60px -15px rgba(37, 99, 235, 0.4) !important;
  transform: translateY(0);
  transition: all 0.4s ease;
  width: 100%;
  max-width: 480px;
  aspect-ratio: 1.6 / 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.balance-amount {
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  line-height: 1.1;
}

.balance-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 40px 80px -20px rgba(37, 99, 235, 0.5) !important;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0 30%);
  pointer-events: none;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.tracking-tight {
  letter-spacing: -0.05em;
}

.opacity-80 { opacity: 0.8; }
.card-top-layer { z-index: 1; }

.card-hover {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05) !important;
  border-color: #f1f5f9;
}
</style>

<template>
  <div class="transaction-list-container">
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Recent Transactions</div>
      <q-btn flat color="accent" label="See All" no-caps to="/transactions" />
    </div>

    <q-list separator>
      <q-item 
        v-for="tx in transactions" 
        :key="tx.id" 
        class="q-py-md transaction-item no-border"
        clickable
        v-ripple
        @click="openReceipt(tx)"
      >
        <q-item-section avatar>
          <q-avatar :color="getTypeColor(tx.type) + '-1'" :text-color="getTypeColor(tx.type)" :icon="getTypeIcon(tx.type)" class="modern-avatar" size="48px" rounded />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold">{{ tx.description || 'Transaction' }}</q-item-label>
          <q-item-label caption>{{ formatDate(tx.created_at) }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <div :class="['text-weight-bold', isIncome(tx) ? 'text-positive' : 'text-negative']">
            {{ isIncome(tx) ? '+' : '-' }}{{ tx.amount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', currencyDisplay: 'symbol' }).replace('PKR', 'Rs') }}
          </div>
          <q-badge 
            :color="getStatusColor(tx.status)" 
            :label="tx.status"
            class="q-mt-xs no-shadow"
            outline
          />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Receipt Dialog -->
    <q-dialog v-model="showReceipt" position="bottom" class="receipt-dialog">
      <q-card v-if="selectedTx" class="receipt-card border-radius-top-32 column no-wrap" style="width: 100%; max-width: 500px; max-height: 90vh;">
        <!-- Fixed Header -->
        <q-card-section class="q-pa-md bg-white" style="z-index: 10; border-bottom: 1px solid #f1f5f9;">
          <div class="row justify-center q-mb-md">
            <div class="drag-handle"></div>
          </div>
          
          <div class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Receipt</div>
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
        </q-card-section>

        <!-- Scrollable Content -->
        <q-card-section class="scroll q-pa-md">
          <div class="column items-center q-mb-xl">
          <q-avatar :color="getTypeColor(selectedTx.type) + '-1'" :text-color="getTypeColor(selectedTx.type)" :icon="getTypeIcon(selectedTx.type)" size="64px" class="modern-avatar q-mb-md" />
          <div class="text-h5 text-weight-bolder">{{ selectedTx.description || 'Transaction' }}</div>
          <div class="text-subtitle1 text-grey-6 q-mb-sm">{{ formatDate(selectedTx.created_at) }}</div>
          <div :class="['text-h3 text-weight-bold tracking-tight', isIncome(selectedTx) ? 'text-positive' : 'text-negative']">
            {{ isIncome(selectedTx) ? '+' : '-' }}{{ selectedTx.amount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', currencyDisplay: 'symbol' }).replace('PKR', 'Rs') }}
          </div>
          <q-badge :color="getStatusColor(selectedTx.status)" :label="selectedTx.status.toUpperCase()" class="q-mt-md q-px-md q-py-sm text-weight-bold tracking-widest border-radius-24" />
        </div>

        <div class="q-px-sm">
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-sm">Transaction Details</div>
          
          <div class="receipt-details q-pa-md bg-grey-1 border-radius-16">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-grey-7">Type</div>
              <div class="text-weight-bold">{{ selectedTx.type }}</div>
            </div>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-grey-7">Transaction ID</div>
              <div class="text-weight-bold font-mono">#{{ getShortId(selectedTx.id) }}</div>
            </div>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-grey-7">Payment Method</div>
              <div class="text-weight-bold row items-center">
                <q-icon name="account_balance_wallet" class="q-mr-xs" /> Wallet Balance
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row justify-between items-center">
              <div class="text-grey-7">Total Amount</div>
              <div class="text-weight-bolder text-subtitle1">{{ isIncome(selectedTx) ? '' : '-' }}{{ selectedTx.amount.toLocaleString('en-PK', { style: 'currency', currency: 'PKR', currencyDisplay: 'symbol' }).replace('PKR', 'Rs') }}</div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mt-xl q-mb-sm">
          <div class="col-12 col-sm-6 order-sm-last">
            <q-btn color="dark" label="Download PDF" icon="file_download" unelevated no-caps class="full-width text-weight-bold border-radius-12 q-py-sm" />
          </div>
          <div class="col-12 col-sm-6">
            <q-btn outline color="dark" label="Report Issue" no-caps class="full-width text-weight-bold border-radius-12 q-py-sm" />
          </div>
        </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

interface Transaction {
  id: string
  sender_id?: string
  receiver_id?: string
  amount: number
  type: 'transfer' | 'receive' | 'bill_payment' | 'top_up' | 'recharge'
  status: 'pending' | 'completed' | 'failed'
  description?: string
  created_at: string
}

defineProps<{
  transactions: Transaction[]
}>()

const showReceipt = ref(false)
const selectedTx = ref<Transaction | null>(null)

const openReceipt = (tx: Transaction) => {
  selectedTx.value = tx
  showReceipt.value = true
}

const getShortId = (id?: string) => {
  if (!id) return ''
  return id.split('-')[0]?.toUpperCase() || ''
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return 'Invalid Date'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'top_up': return 'add_circle'
    case 'transfer': return 'send'
    case 'receive': return 'download'
    case 'bill_payment': return 'receipt_long'
    case 'recharge': return 'phonelink_setup'
    default: return 'swap_horiz'
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'top_up': return 'green'
    case 'transfer': return 'blue'
    case 'receive': return 'teal'
    case 'bill_payment': return 'orange'
    case 'recharge': return 'deep-orange'
    default: return 'grey'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'positive'
    case 'pending': return 'warning'
    case 'failed': return 'negative'
    default: return 'grey'
  }
}

const isIncome = (tx: Transaction | null) => {
  if (!tx) return false
  const userId = authStore.user?.id
  
  // 1. Top-up is always income
  if (tx.type === 'top_up') return true
  
  // 2. Receiving money is income (receiver_id matches current user)
  if (tx.receiver_id === userId) return true
  
  // 3. Specifically 'receive' type
  if (tx.type === 'receive') return true

  // Default to false (transfer, bill_payment, recharge are expenses)
  return false
}
</script>

<style scoped>
.transaction-item {
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.transaction-item:hover {
  background: #f8fafc;
}

.no-border {
  border: none !important;
}

.modern-avatar {
  border-radius: 16px;
}

:deep(.q-avatar__content) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.receipt-card {
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
  box-shadow: 0 -20px 40px rgba(0,0,0,0.1) !important;
}

@media (min-width: 600px) {
  .receipt-card {
    border-radius: 32px !important;
    margin-bottom: 5vh;
  }
}

.drag-handle {
  width: 40px;
  height: 5px;
  background-color: #e2e8f0;
  border-radius: 10px;
}

.border-radius-16 { border-radius: 16px !important; }
.border-radius-12 { border-radius: 12px !important; }
.border-radius-24 { border-radius: 24px !important; }

.font-mono { font-family: inherit; }
.tracking-widest { letter-spacing: 0.1em; }
.tracking-tight { letter-spacing: -0.03em; }
</style>

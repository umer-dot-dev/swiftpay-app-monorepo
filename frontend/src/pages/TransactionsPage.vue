<template>
  <q-page class="transactions-page q-pa-md">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div :class="$q.screen.lt.sm ? 'text-h5' : 'text-h4'" class="text-weight-bolder text-primary tracking-tight">{{ $t('transactions') }}</div>
        <div class="text-subtitle1 text-grey-7" :class="$q.screen.lt.sm ? 'text-caption' : ''">Track and manage your expenses</div>
      </div>
      <q-btn v-if="$q.screen.gt.xs" color="primary" icon="download" label="Export Statement" rounded unelevated no-caps class="q-px-lg q-py-md text-weight-bold" @click="exportStatement" />
      <q-btn v-else color="primary" icon="download" round unelevated size="sm" @click="exportStatement" />
    </div>

    <q-card class="no-border no-shadow border-radius-32 bg-white" :class="$q.screen.lt.sm ? 'q-pa-md' : 'q-pa-lg'">
      <div class="row q-col-gutter-md q-mb-lg items-center justify-between">
        <div class="col-12 col-md-6">
          <q-input outlined rounded dense v-model="search" placeholder="Search transactions..." class="search-input">
            <template v-slot:prepend>
              <q-icon name="search" color="grey-6" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-auto row q-gutter-x-sm">
          <q-btn outline rounded no-caps label="Filter" icon="filter_list" :color="activeFilterCount > 0 ? 'primary' : 'grey-8'" class="q-px-md" @click="filterDialogOpen = true">
            <q-badge v-if="activeFilterCount > 0" color="primary" floating rounded>{{ activeFilterCount }}</q-badge>
          </q-btn>
          <q-btn outline rounded no-caps :label="selectedDateRange" icon="calendar_today" color="grey-8" class="q-px-md">
            <q-menu class="border-radius-20 shadow-4 q-py-xs" transition-show="scale" transition-hide="scale">
              <q-list style="min-width: 180px">
                <q-item v-for="range in dateRanges" :key="range" clickable v-close-popup @click="selectedDateRange = range" :class="{'bg-blue-1': selectedDateRange === range}" class="q-py-md transition-hover">
                  <q-item-section>
                    <q-item-label :class="{'text-weight-bold text-primary': selectedDateRange === range, 'text-grey-8': selectedDateRange !== range}">{{ range }}</q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="selectedDateRange === range">
                     <q-icon name="check_circle" color="primary" size="xs" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <q-list class="transactions-list">
        <template v-for="(tx, index) in filteredTransactions" :key="tx.id">
          <div v-if="index === 0 || formatMonth(tx.date) !== formatMonth(filteredTransactions[index - 1]?.date || '')" class="text-subtitle2 text-grey-6 q-mt-md q-mb-sm text-uppercase tracking-widest q-pl-md">
            {{ formatMonth(tx.date) }}
          </div>
          
          <q-item clickable v-ripple class="q-py-md border-radius-20 transition-hover q-mb-sm" @click="openReceipt(tx)">
            <q-item-section avatar>
              <q-avatar :color="tx.isIncome ? 'green-1' : 'red-1'" :text-color="tx.isIncome ? 'green' : 'red'" :icon="tx.icon" :size="$q.screen.lt.sm ? '42px' : '50px'" />
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="text-weight-bold" :class="$q.screen.lt.sm ? 'text-subtitle2' : 'text-body1'" style="line-height: 1.2; word-break: break-word;">
                {{ tx.name }}
              </q-item-label>
              <q-item-label caption class="text-grey-6">{{ tx.category }} • {{ formatDate(tx.date) }}</q-item-label>
            </q-item-section>
            
            <q-item-section side class="column items-end no-wrap">
              <div :class="['text-weight-bolder', $q.screen.lt.sm ? 'text-subtitle1' : 'text-h6', tx.isIncome ? 'text-green' : 'text-red']">
                {{ tx.isIncome ? '+' : '-' }}Rs {{ tx.amount.toLocaleString() }}
              </div>
              <q-badge v-if="tx.status === 'Pending'" color="warning" text-color="dark" label="Pending" rounded outline class="q-mt-xs" />
            </q-item-section>
          </q-item>
        </template>
      </q-list>
      
      <div v-if="filteredTransactions.length === 0" class="text-center q-pa-xl column items-center">
        <q-icon name="receipt_long" size="64px" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">No transactions found</div>
      </div>
    </q-card>

    <!-- Filter Dialog -->
    <q-dialog v-model="filterDialogOpen" :position="$q.screen.lt.sm ? 'bottom' : 'standard'">
      <q-card class="filter-card bg-white" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 400px; max-width: 100vw;">
        <q-card-section class="row items-center justify-between q-pb-none q-pt-lg q-px-lg">
          <div class="text-h6 text-weight-bold text-dark">Filter Transactions</div>
          <q-btn icon="close" flat round dense v-close-popup color="grey-6" />
        </q-card-section>

        <q-card-section class="q-pt-lg q-px-lg">
          <div class="text-subtitle2 text-grey-8 q-mb-sm text-weight-bold tracking-tight">Transaction Type</div>
          <div class="row q-gutter-sm">
            <q-btn :color="filters.type === 'All' ? 'primary' : 'grey-2'" :text-color="filters.type === 'All' ? 'white' : 'grey-8'" rounded unelevated label="All" no-caps @click="filters.type = 'All'" class="text-weight-medium" />
            <q-btn :color="filters.type === 'Income' ? 'positive' : 'grey-2'" :text-color="filters.type === 'Income' ? 'white' : 'grey-8'" rounded unelevated label="Income" no-caps @click="filters.type = 'Income'" class="text-weight-medium" />
            <q-btn :color="filters.type === 'Expense' ? 'negative' : 'grey-2'" :text-color="filters.type === 'Expense' ? 'white' : 'grey-8'" rounded unelevated label="Expense" no-caps @click="filters.type = 'Expense'" class="text-weight-medium" />
          </div>

          <div class="text-subtitle2 text-grey-8 q-mt-xl q-mb-sm text-weight-bold tracking-tight">Status</div>
          <div class="row q-gutter-sm">
            <q-btn :color="filters.status === 'All' ? 'primary' : 'grey-2'" :text-color="filters.status === 'All' ? 'white' : 'grey-8'" rounded unelevated label="All" no-caps @click="filters.status = 'All'" class="text-weight-medium" />
            <q-btn :color="filters.status === 'Completed' ? 'primary' : 'grey-2'" :text-color="filters.status === 'Completed' ? 'white' : 'grey-8'" rounded unelevated label="Completed" no-caps @click="filters.status = 'Completed'" class="text-weight-medium" />
            <q-btn :color="filters.status === 'Pending' ? 'warning' : 'grey-2'" :text-color="filters.status === 'Pending' ? 'dark' : 'grey-8'" rounded unelevated label="Pending" no-caps @click="filters.status = 'Pending'" class="text-weight-medium" />
          </div>
        </q-card-section>
        
        <q-card-actions align="right" class="q-pa-lg q-mt-md">
          <q-btn flat label="Reset" color="grey-8" no-caps @click="resetFilters" class="q-px-md border-radius-20 text-weight-medium" />
          <q-btn unelevated label="Apply Filters" color="primary" no-caps v-close-popup class="q-px-xl q-py-sm border-radius-20 text-weight-bold shadow-1" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Receipt Dialog -->
    <q-dialog v-model="showReceipt" :position="$q.screen.lt.sm ? 'bottom' : 'standard'" class="receipt-dialog">
      <q-card v-if="selectedTx" class="receipt-card bg-white column no-wrap" :class="$q.screen.lt.sm ? 'border-radius-top-32' : 'border-radius-32'" style="width: 100%; max-width: 500px; max-height: 90vh;">
        <!-- Fixed Header -->
        <q-card-section class="q-pa-md bg-white" style="z-index: 10; border-bottom: 1px solid #f1f5f9;">
          <div v-if="$q.screen.lt.sm" class="row justify-center q-mb-md">
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
          <q-avatar :color="selectedTx.isIncome ? 'green-1' : 'red-1'" :text-color="selectedTx.isIncome ? 'green' : 'red'" :icon="selectedTx.icon" size="80px" class="border-radius-24 q-mb-md" />
          <div class="text-h5 text-weight-bolder">{{ selectedTx.name }}</div>
          <div class="text-subtitle1 text-grey-6 q-mb-sm">{{ formatDate(selectedTx.date) }}</div>
          <div :class="['text-h3 text-weight-bold tracking-tight', selectedTx.isIncome ? 'text-green' : 'text-dark']">
            {{ selectedTx.isIncome ? '+' : '-' }}Rs {{ selectedTx.amount.toLocaleString() }}
          </div>
          <q-badge :color="selectedTx.status === 'Completed' ? 'positive' : 'warning'" :text-color="selectedTx.status === 'Completed' ? 'white' : 'dark'" :label="selectedTx.status.toUpperCase()" class="q-mt-md q-px-md q-py-sm text-weight-bold tracking-widest border-radius-24" />
        </div>

        <div class="q-px-sm">
          <div class="text-subtitle2 text-grey-6 text-uppercase tracking-widest q-mb-sm">Transaction Details</div>
          
          <div class="receipt-details q-pa-lg bg-grey-1 border-radius-20">
            <div class="row justify-between items-center q-mb-md">
              <div class="text-grey-7 text-weight-medium">Category</div>
              <div class="text-weight-bold">{{ selectedTx.category }}</div>
            </div>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-grey-7 text-weight-medium">Transaction ID</div>
              <div class="text-weight-bold font-mono">#TRX-{{ Math.random().toString(36).substring(2, 10).toUpperCase() }}</div>
            </div>
            <div class="row justify-between items-center q-mb-md">
              <div class="text-grey-7 text-weight-medium">Payment Method</div>
              <div class="text-weight-bold row items-center">
                <q-icon name="account_balance_wallet" class="q-mr-xs text-primary" size="sm" /> Wallet Balance
              </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="row justify-between items-center">
              <div class="text-grey-7 text-weight-medium">Total Amount</div>
              <div class="text-weight-bolder text-subtitle1">{{ selectedTx.isIncome ? '' : '-' }}Rs {{ selectedTx.amount.toLocaleString() }}</div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mt-xl q-mb-sm">
          <div class="col-12 col-sm-6 order-sm-last">
            <q-btn color="primary" label="Download PDF" icon="file_download" unelevated no-caps class="full-width text-weight-bold border-radius-12 q-py-sm shadow-1" />
          </div>
          <div class="col-12 col-sm-6">
            <q-btn outline color="primary" label="Report Issue" no-caps class="full-width text-weight-bold border-radius-12 q-py-sm" />
          </div>
        </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { exportFile, useQuasar } from 'quasar'
import { useAccountStore } from 'src/stores/account'

const $q = useQuasar()
const accountStore = useAccountStore()

const search = ref('')
const filterDialogOpen = ref(false)

const dateRanges = ['All Time', 'This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months']
const selectedDateRange = ref('All Time')

const filters = ref({
  type: 'All',
  status: 'All'
})

const showReceipt = ref(false)
const selectedTx = ref<Transaction | null>(null)

const openReceipt = (tx: Transaction) => {
  selectedTx.value = tx
  showReceipt.value = true
}

const activeFilterCount = computed(() => {
  let count = 0
  if (filters.value.type !== 'All') count++
  if (filters.value.status !== 'All') count++
  return count
})

const resetFilters = () => {
  filters.value = { type: 'All', status: 'All' }
}

const exportStatement = () => {
  const content = [
    ['Date', 'Name', 'Category', 'Type', 'Status', 'Amount'],
    ...filteredTransactions.value.map(t => [
      `"${new Date(t.date).toLocaleString('en-PK')}"`,
      `"${t.name}"`,
      `"${t.category}"`,
      t.isIncome ? 'Income' : 'Expense',
      t.status,
      t.amount.toFixed(2)
    ])
  ].map(e => e.join(',')).join('\n')

  const status = exportFile('swiftpay-statement.csv', content, 'text/csv')

  if (status !== true) {
    $q.notify({ message: 'Browser denied file download...', color: 'negative', icon: 'warning' })
  } else {
    $q.notify({ message: 'Statement exported successfully!', color: 'positive', icon: 'check_circle', position: 'top' })
  }
}

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
  isIncome: boolean;
  status: string;
}

interface BackendTransaction {
  id: string;
  type: string;
  amount: number;
  description?: string;
  status?: string;
  created_at: string;
}

const mapTransactionType = (tx: BackendTransaction): Transaction => {
  const isIncome = tx.type === 'top_up' || tx.type === 'receive'
  
  let icon = 'payments'
  let category = 'Transfer'
  
  if (tx.type === 'top_up') {
    icon = 'add_circle'
    category = 'Wallet Top-up'
  } else if (tx.type === 'bill_payment') {
    icon = 'receipt'
    category = 'Utility Bill'
  } else if (tx.type === 'recharge') {
    icon = 'phonelink_setup'
    category = 'Mobile Recharge'
  } else if (tx.type === 'transfer') {
    icon = 'send'
    category = 'Transfer'
  }

  return {
    id: tx.id,
    name: tx.description || 'Transaction',
    category: category,
    amount: tx.amount,
    date: tx.created_at,
    icon: icon,
    isIncome: isIncome,
    status: tx.status ? tx.status.charAt(0).toUpperCase() + tx.status.slice(1) : 'Completed'
  }
}

const transactions = computed(() => {
  return accountStore.transactions.map(mapTransactionType)
})

const filteredTransactions = computed(() => {
  const q = search.value.toLowerCase()
  const currentDate = new Date()
  
  return transactions.value.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    
    let matchesType = true
    if (filters.value.type === 'Income') matchesType = t.isIncome
    if (filters.value.type === 'Expense') matchesType = !t.isIncome
    
    let matchesStatus = true
    if (filters.value.status !== 'All') {
      matchesStatus = t.status === filters.value.status
    }

    let matchesDate = true
    if (selectedDateRange.value !== 'All Time') {
      const txDate = new Date(t.date)
      if (selectedDateRange.value === 'This Month') {
        matchesDate = txDate.getMonth() === currentDate.getMonth() && txDate.getFullYear() === currentDate.getFullYear()
      } else if (selectedDateRange.value === 'Last Month') {
        const lastMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        matchesDate = txDate.getMonth() === lastMonthDate.getMonth() && txDate.getFullYear() === lastMonthDate.getFullYear()
      } else if (selectedDateRange.value === 'Last 3 Months') {
        const threeMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate())
        matchesDate = txDate >= threeMonthsAgo
      } else if (selectedDateRange.value === 'Last 6 Months') {
        const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate())
        matchesDate = txDate >= sixMonthsAgo
      }
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate
  })
})

const formatMonth = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.transactions-page {
  background: #fbfcfe;
}

.border-radius-32 {
  border-radius: 32px !important;
}

.border-radius-top-32 {
  border-top-left-radius: 32px !important;
  border-top-right-radius: 32px !important;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.search-input:deep(.q-field__control) {
  border-radius: 24px;
}

.transition-hover {
  transition: all 0.3s ease;
}

.transition-hover:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.border-radius-24 { 
  border-radius: 24px !important; 
}

.border-radius-12 { 
  border-radius: 12px !important; 
}

.drag-handle { 
  width: 40px; 
  height: 5px; 
  background-color: #e2e8f0; 
  border-radius: 10px; 
}

.font-mono { 
  font-family: inherit; 
}

.tracking-tight { 
  letter-spacing: -0.03em; 
}
</style>

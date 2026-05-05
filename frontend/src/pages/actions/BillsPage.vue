<template>
  <q-page class="bills-page q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="back-btn q-mr-lg" />
        <div>
          <div class="text-h4 text-weight-bolder text-primary tracking-tight">Bill Payments</div>
          <div class="text-subtitle1 text-grey-7">Safe and encrypted utility payments</div>
        </div>
      </div>
      <q-btn outline color="primary" icon="history" label="All History" rounded no-caps class="q-px-lg q-py-md text-weight-bold" />
    </div>

    <div class="row q-col-gutter-xl">
      <div class="col-12 col-lg-3">
        <div class="text-h6 text-weight-bold q-mb-lg">Categories</div>
        <div class="column q-gutter-y-sm">
          <q-card 
            v-for="cat in categories" 
            :key="cat.name" 
            class="bill-cat-card no-border no-shadow q-pa-md cursor-pointer"
            :class="{ 'active-cat': activeCategory === cat.name }"
            @click="activeCategory = cat.name"
            v-ripple
          >
            <div class="row items-center">
              <div class="icon-circle q-mr-md" :style="{ background: cat.bg }">
                <q-icon :name="cat.icon" color="white" size="20px" />
              </div>
              <div class="text-weight-bold">{{ cat.name }}</div>
            </div>
          </q-card>
        </div>
      </div>

      <div class="col-12 col-lg-9">
        <div class="row items-center justify-between q-mb-lg">
          <div class="text-h6 text-weight-bold">Upcoming Bills</div>
          <div class="text-subtitle2 text-grey-6">2 Pending Payments</div>
        </div>

        <div class="row q-col-gutter-lg">
          <div v-for="bill in pendingBills" :key="bill.id" class="col-12">
            <q-card class="premium-bill-card no-border no-shadow q-pa-lg">
              <div class="row items-center">
                <div class="bill-type-icon q-mr-xl" :style="{ background: bill.bg }">
                  <q-icon :name="bill.icon" color="white" size="32px" />
                </div>
                
                <div class="column q-mr-xl">
                  <div class="text-h6 text-weight-bolder">{{ bill.title }}</div>
                  <div class="text-subtitle2 text-grey-6">{{ bill.account }}</div>
                </div>

                <div class="column q-mr-xl gt-sm">
                  <div class="text-caption text-grey-6 text-uppercase tracking-widest">Due Date</div>
                  <div class="text-subtitle1 text-weight-bold text-negative">{{ bill.dueDate }}</div>
                </div>

                <q-space />

                <div class="column items-end q-mr-xl">
                  <div class="text-caption text-grey-6 text-uppercase tracking-widest">Amount</div>
                  <div class="text-h5 text-weight-bolder">Rs {{ bill.amount }}</div>
                </div>

                <q-btn 
                  color="primary" 
                  label="Pay Bill" 
                  rounded 
                  unelevated 
                  no-caps 
                  class="q-px-xl q-py-md text-weight-bold"
                  @click="handleBillPayment(bill)"
                />
              </div>
            </q-card>
          </div>
        </div>

        <div class="text-h6 text-weight-bold q-mt-xl q-mb-lg">Recently Paid</div>
        <q-card class="no-border no-shadow border-radius-32 bg-white">
          <q-list separator>
            <q-item v-for="i in 3" :key="i" class="q-pa-lg">
              <q-item-section avatar>
                <div class="past-bill-icon">
                  <q-icon name="check_circle" color="positive" size="24px" />
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold text-body1">PTCL Broadband - April 2026</q-item-label>
                <q-item-label caption class="text-grey-6">Reference: 3244-129330-10</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="column items-end">
                  <div class="text-weight-bolder text-dark">Rs 12,500.00</div>
                  <div class="text-caption text-grey-5">05 Apr 2026</div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { useAccountStore } from 'src/stores/account'
import { request } from 'src/api'

const $q = useQuasar()
const router = useRouter()
const accountStore = useAccountStore()

interface Bill {
  id: number;
  title: string;
  account: string;
  amount: string;
  dueDate: string;
  icon: string;
  bg: string;
}

const activeCategory = ref('Electricity')

const categories = [
  { name: 'Electricity', icon: 'bolt', color: 'orange-6', bg: 'rgba(249, 115, 22, 0.12)' },
  { name: 'Water', icon: 'water_drop', color: 'blue-6', bg: 'rgba(37, 99, 235, 0.12)' },
  { name: 'Gas', icon: 'local_fire_department', color: 'deep-purple-5', bg: 'rgba(139, 92, 246, 0.12)' },
  { name: 'Internet', icon: 'wifi', color: 'teal-6', bg: 'rgba(6, 182, 212, 0.12)' }
]

const pendingBills: Bill[] = [
  { id: 1, title: 'IESCO Electricity', account: '14 12345 6789012 U', amount: '12,450.50', dueDate: 'Oct 20, 2026', icon: 'bolt', bg: 'rgba(249, 115, 22, 0.12)' },
  { id: 2, title: 'SNGPL Gas', account: '9283 1726 3544', amount: '3,210.00', dueDate: 'Oct 15, 2026', icon: 'local_fire_department', bg: 'rgba(139, 92, 246, 0.12)' },
  { id: 3, title: 'PTCL Broadband', account: '051 2233445', amount: '4,500.00', dueDate: 'Oct 25, 2026', icon: 'wifi', bg: 'rgba(6, 182, 212, 0.12)' }
]

const handleBillPayment = async (bill: Bill) => {
  const amountToPay = parseFloat(bill.amount.replace(/,/g, ''))

  if (amountToPay > accountStore.balance) {
    $q.notify({
      type: 'negative',
      message: 'Insufficient balance',
      caption: `You need Rs ${amountToPay - accountStore.balance} more`
    })
    return
  }

  $q.loading.show({ message: 'Authorizing transaction...' })
  try {
    await request('/transactions/bill-payment', {
      method: 'POST',
      body: JSON.stringify({
        amount: amountToPay,
        description: `Utility Bill: ${bill.title} (${bill.account})`
      })
    })

    // Refresh store
    await accountStore.fetchDashboardData()

    $q.notify({
      type: 'positive',
      message: 'Payment Successful!',
      caption: `${bill.title} bill of Rs ${bill.amount} paid successfully`,
      position: 'center',
      classes: 'premium-toast',
      timeout: 3000
    })
    
    // In a real app we would remove it from pendingBills, but this is a demo
    void router.push('/')
  } catch (error: unknown) {
    const err = error as Error
    $q.notify({
      type: 'negative',
      message: 'Payment failed',
      caption: err.message || 'Please try again later'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.bills-page {
  background: #fbfcfe;
}

.bill-cat-card {
  border-radius: 20px;
  background: white;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s ease;
}

.bill-cat-card:hover {
  border-color: var(--q-primary);
  background: #f8fafc;
}

.bill-cat-card.active-cat {
  background: var(--q-primary);
  color: white;
  border-color: var(--q-primary);
  transform: scale(1.02);
}

.icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.premium-bill-card {
  background: white;
  border-radius: 32px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s ease;
}

.premium-bill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08) !important;
  border-color: var(--q-primary);
}

.bill-type-icon {
  width: 80px;
  height: 80px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.border-radius-32 {
  border-radius: 32px !important;
}

.tracking-widest {
  letter-spacing: 0.1em;
}
</style>


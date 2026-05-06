<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-primary">System Transactions</div>
        <div class="text-subtitle1 text-grey-7">Full audit trail of all platform movements.</div>
      </div>
      <q-space />
      <q-btn
        color="primary"
        unelevated
        icon="download"
        label="Export Ledger"
        @click="exportCSV"
        class="border-radius-12 q-px-md"
      />
    </div>

    <q-card flat class="glass-panel border-radius-20 overflow-hidden">
      <q-table
        :rows="transactions"
        :columns="columns"
        row-key="id"
        :loading="loading"
        flat
        class="admin-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text-weight-bold text-grey-7"
              style="font-size: 0.9rem"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <q-badge :color="getTypeColor(props.row.type)" rounded class="q-px-sm q-py-xs border-radius-12 text-weight-bold">
              {{ props.row.type.toUpperCase().replace('_', ' ') }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props">
            <div class="text-weight-bold" :class="props.row.type === 'receive' ? 'text-positive' : 'text-dark'">
              {{ props.row.type === 'receive' ? '+' : '-' }} Rs {{ props.row.amount.toLocaleString() }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-created_at="props">
          <q-td :props="props" class="text-grey-7">
            {{ new Date(props.row.created_at).toLocaleString() }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { request } from 'src/api'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'

interface Transaction {
  id: string | number;
  sender_name: string;
  receiver_name: string;
  type: string;
  amount: number;
  created_at: string;
}

const $q = useQuasar()
const loading = ref(true)
const transactions = ref<Transaction[]>([])

const columns: QTableColumn[] = [
  { name: 'id', label: 'Reference', field: 'id', align: 'left', sortable: true },
  { name: 'sender_name', label: 'Origin', field: 'sender_name', align: 'left', sortable: true },
  { name: 'receiver_name', label: 'Destination', field: 'receiver_name', align: 'left', sortable: true },
  { name: 'type', label: 'Type', field: 'type', align: 'center', sortable: true },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'created_at', label: 'Timestamp', field: 'created_at', align: 'right', sortable: true }
]

async function fetchTransactions() {
  try {
    loading.value = true
    const data = await request('/admin/transactions')
    transactions.value = data as Transaction[]
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
  } finally {
    loading.value = false
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'transfer': return 'blue-2'
    case 'receive': return 'green-2'
    case 'bill_payment': return 'orange-2'
    case 'top_up': return 'purple-2'
    default: return 'grey-2'
  }
}

function exportCSV() {
  $q.notify({
    message: 'Preparing system ledger for export...',
    color: 'primary',
    icon: 'cloud_download'
  })
}

onMounted(() => {
  void fetchTransactions()
})
</script>

<style scoped>
.admin-table {
  background: transparent !important;
}
.border-radius-20 {
  border-radius: 20px !important;
}
.border-radius-12 {
  border-radius: 12px !important;
}
</style>


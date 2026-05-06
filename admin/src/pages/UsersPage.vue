<template>
  <q-page class="q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-gutter-y-md q-mb-xl">
      <div class="col-12 col-sm-auto">
        <div class="text-h4 text-weight-bold text-primary">User Management</div>
        <div class="text-subtitle1 text-grey-7">Monitor activity and manage user accounts.</div>
      </div>
      <div class="col-12 col-sm-auto">
        <q-input
          v-model="search"
          placeholder="Search users..."
          dense
          outlined
          rounded
          bg-color="white"
          style="width: 100%; max-width: 320px"
          class="shadow-1 border-radius-16"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>
      </div>
    </div>

    <q-card flat class="glass-panel border-radius-20 overflow-hidden">
      <q-table
        :rows="filteredUsers"
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

        <template v-slot:body-cell-full_name="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar size="32px" color="primary" text-color="white" class="q-mr-sm">
                {{ props.row.full_name.charAt(0) }}
              </q-avatar>
              <div class="text-weight-bold text-dark">{{ props.row.full_name }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge 
              :color="props.row.status === 'active' ? 'green-1' : 'red-1'" 
              :text-color="props.row.status === 'active' ? 'green-9' : 'red-9'" 
              :label="props.row.status" 
              class="q-px-sm q-py-xs border-radius-12 text-capitalize" 
            />
          </q-td>
        </template>

        <template v-slot:body-cell-balance="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">Rs {{ props.row.balance.toLocaleString() }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm text-center">
            <q-btn flat round color="primary" icon="visibility" @click.stop="viewUser(props.row)">
              <q-tooltip>View Details</q-tooltip>
            </q-btn>
            <q-btn 
              flat 
              round 
              :color="props.row.status === 'active' ? 'orange' : 'green'" 
              :icon="props.row.status === 'active' ? 'block' : 'check_circle'" 
              @click.stop="confirmBlock(props.row)"
            >
              <q-tooltip>{{ props.row.status === 'active' ? 'Block User' : 'Unblock User' }}</q-tooltip>
            </q-btn>
            <q-btn flat round color="red" icon="delete" @click.stop="confirmDelete(props.row)">
              <q-tooltip>Delete Permanently</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- User Detail Dialog -->
    <q-dialog v-model="showDetail">
      <q-card style="width: 450px" class="border-radius-20 glass-panel">
        <q-card-section class="bg-primary text-white q-pa-lg">
          <div class="text-h6 text-weight-bold">User Profile</div>
        </q-card-section>
        <q-card-section v-if="selectedUser" class="q-pa-xl">
          <div class="row items-center q-mb-xl">
            <q-avatar size="80px" color="primary" text-color="white" class="q-mr-lg shadow-2">
              {{ selectedUser.full_name.charAt(0) }}
            </q-avatar>
            <div>
              <div class="text-h5 text-weight-bold text-dark">{{ selectedUser.full_name }}</div>
              <div class="text-subtitle1 text-grey-7">{{ selectedUser.email }}</div>
            </div>
          </div>
          
          <div class="row q-col-gutter-md">
            <div class="col-6">
              <div class="text-caption text-grey-7">Account ID</div>
              <div class="text-weight-bold text-dark">#{{ selectedUser.id }}</div>
            </div>
            <div class="col-6">
              <div class="text-caption text-grey-7">Wallet Balance</div>
              <div class="text-weight-bold text-primary text-h6">Rs {{ selectedUser.balance }}</div>
            </div>
            <div class="col-12 q-mt-md">
              <div class="text-caption text-grey-7">Registration Date</div>
              <div class="text-weight-bold text-dark">{{ new Date(selectedUser.created_at).toLocaleString() }}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Close" color="primary" v-close-popup class="border-radius-12 q-px-md" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { request } from 'src/api'
import { useQuasar } from 'quasar'
import type { QTableColumn } from 'quasar'

interface User {
  id: string | number;
  full_name: string;
  email: string;
  balance: number;
  status: 'active' | 'blocked';
  created_at: string;
}

const $q = useQuasar()
const loading = ref(true)
const search = ref('')
const users = ref<User[]>([])
const showDetail = ref(false)
const selectedUser = ref<User | null>(null)

const columns: QTableColumn[] = [
  { name: 'full_name', label: 'Full Name', field: 'full_name', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'balance', label: 'Balance', field: 'balance', align: 'right', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const filteredUsers = computed(() => {
  if (!search.value) return users.value
  const s = search.value.toLowerCase()
  return users.value.filter(u => 
    u.full_name.toLowerCase().includes(s) || 
    u.email.toLowerCase().includes(s)
  )
})

async function fetchUsers() {
  try {
    loading.value = true
    const data = await request('/admin/users')
    users.value = data as User[]
  } catch (error) {
    console.error('Failed to fetch users:', error)
  } finally {
    loading.value = false
  }
}

function viewUser(user: User) {
  selectedUser.value = user
  showDetail.value = true
}

function confirmBlock(user: User) {
  const isBlocking = user.status === 'active'
  $q.dialog({
    title: isBlocking ? 'Confirm Block' : 'Confirm Unblock',
    message: `Are you sure you want to ${isBlocking ? 'block' : 'unblock'} ${user.full_name}?`,
    cancel: true,
    persistent: true,
    ok: {
      label: isBlocking ? 'Block' : 'Unblock',
      color: isBlocking ? 'orange' : 'green',
      unelevated: true
    }
  }).onOk(() => {
    void (async () => {
      try {
        const newStatus = isBlocking ? 'blocked' : 'active'
        await request(`/admin/users/${user.id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus })
        })
        $q.notify({
          color: 'positive',
          message: `User ${isBlocking ? 'blocked' : 'unblocked'} successfully`,
          icon: 'check'
        })
        void fetchUsers()
      } catch {
        $q.notify({ color: 'negative', message: 'Failed to update user status' })
      }
    })()
  })
}

function confirmDelete(user: User) {
  $q.dialog({
    title: 'Confirm Permanent Delete',
    message: `Are you sure you want to delete ${user.full_name}? This will remove all their balance, transactions, and card data. This cannot be undone.`,
    ok: { 
      label: 'Permanently Delete',
      color: 'red', 
      unelevated: true 
    },
    cancel: { 
      label: 'Cancel',
      flat: true, 
      color: 'grey-7' 
    },
    persistent: true
  }).onOk(() => {
    void (async () => {
      try {
        await request(`/admin/users/${user.id}`, { method: 'DELETE' })
        $q.notify({
          color: 'positive',
          message: 'User and all related data purged from system',
          icon: 'delete_forever'
        })
        void fetchUsers()
      } catch {
        $q.notify({ color: 'negative', message: 'Failed to delete user' })
      }
    })()
  })
}

onMounted(() => {
  void fetchUsers()
})
</script>

<style scoped>
.admin-table {
  background: transparent !important;
}

.border-radius-20 {
  border-radius: 20px !important;
}

.border-radius-16 {
  border-radius: 16px !important;
}

.border-radius-12 {
  border-radius: 12px !important;
}
</style>

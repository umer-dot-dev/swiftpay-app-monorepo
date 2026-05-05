<template>
  <q-page class="recharge-page q-pa-md q-pa-md-xl">
    <div class="row items-center justify-between q-mb-xl">
      <div class="row items-center">
        <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="back-btn q-mr-lg" />
        <div>
          <div class="text-h4 text-weight-bolder text-primary tracking-tight">Mobile Recharge</div>
          <div class="text-subtitle1 text-grey-7">Instant top-up for any network</div>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-xl justify-center">
      <div class="col-12 col-lg-8">
        <q-card class="premium-recharge-card no-border no-shadow q-pa-xl bg-white">
          <div class="row q-col-gutter-xl">
            <!-- Form Side -->
            <div class="col-12 col-md-6">
              <div class="section-title text-subtitle1 text-weight-bold q-mb-md">Enter Details</div>
              <q-input 
                v-model="phoneNumber" 
                placeholder="3XX XXXXXXX" 
                mask="### #######"
                unmasked-value
                outlined 
                rounded
                bg-color="grey-1"
                prefix="+92"
                class="q-mb-xl custom-input"
              >
                <template v-slot:append>
                  <q-icon name="contacts" class="cursor-pointer text-primary" />
                </template>
              </q-input>

              <div class="section-title text-subtitle1 text-weight-bold q-mb-md">Select Network</div>
              <div class="row q-col-gutter-sm q-mb-xl">
                <div v-for="op in operators" :key="op.name" class="col-3 text-center">
                  <div 
                    class="operator-vignette cursor-pointer" 
                    :class="{ 'active': selectedOperator === op.name }"
                    @click="selectedOperator = op.name"
                  >
                    <div class="op-icon-container" :style="{ background: op.color }">
                      <q-icon :name="op.icon" color="white" size="24px" />
                    </div>
                    <div class="op-label q-mt-sm text-caption text-weight-bold">{{ op.name }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Amount Side -->
            <div class="col-12 col-md-6">
              <div class="section-title text-subtitle1 text-weight-bold q-mb-md">Recharge Amount</div>
              <div class="row q-col-gutter-md q-mb-lg">
                <div v-for="plan in plans" :key="plan" class="col-4">
                  <q-card 
                    class="premium-plan-card text-center q-pa-md cursor-pointer no-shadow"
                    :class="{ 'active-plan': selectedAmount === plan }"
                    @click="selectedAmount = plan"
                  >
                    <div class="text-h6 text-weight-bolder">Rs {{ plan }}</div>
                  </q-card>
                </div>
              </div>
              
              <q-input 
                v-model="selectedAmount" 
                placeholder="Custom Amount" 
                outlined 
                rounded
                bg-color="grey-1"
                prefix="Rs"
                class="q-mb-xl custom-input"
              />

              <q-btn 
                label="Process Recharge" 
                color="primary" 
                class="full-width q-py-lg text-weight-bolder btn-recharge" 
                rounded 
                unelevated
                no-caps
                :disable="!phoneNumber || !selectedAmount || !selectedOperator"
                @click="rechargeNow"
              >
                <q-icon name="flash_on" class="q-ml-md" />
              </q-btn>
            </div>
          </div>
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

const phoneNumber = ref('')
const selectedOperator = ref('')
const selectedAmount = ref('')

const operators = [
  { name: 'Jazz', icon: 'bolt', color: 'linear-gradient(135deg, #ef4444, #b91c1c)' },
  { name: 'Telenor', icon: 'signal_cellular_alt', color: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
  { name: 'Zong', icon: 'eco', color: 'linear-gradient(135deg, #22c55e, #15803d)' },
  { name: 'Ufone', icon: 'cell_tower', color: 'linear-gradient(135deg, #f97316, #c2410c)' }
]

const plans = ['100', '200', '500', '1000', '2000', '5000']

const rechargeNow = async () => {
  if (!phoneNumber.value || !selectedAmount.value || !selectedOperator.value) return
  const amountToRecharge = parseFloat(selectedAmount.value)

  if (amountToRecharge > accountStore.balance) {
    $q.notify({
      type: 'negative',
      message: 'Insufficient balance',
      caption: `You need Rs ${amountToRecharge - accountStore.balance} more`
    })
    return
  }

  $q.loading.show({
    backgroundColor: 'primary',
    message: 'Processing recharge...',
    messageColor: 'white'
  })
  
  try {
    await request('/transactions/recharge', {
      method: 'POST',
      body: JSON.stringify({
        phoneNumber: phoneNumber.value,
        amount: amountToRecharge
      })
    })

    // Refresh store data
    await accountStore.fetchDashboardData()

    $q.notify({
      type: 'positive',
      message: 'Recharge Successful!',
      caption: `Rs ${selectedAmount.value} credited to ${phoneNumber.value}`,
      position: 'center',
      classes: 'premium-toast',
      timeout: 3000
    })
    void router.push('/')
  } catch (error: unknown) {
    const err = error as Error
    $q.notify({
      type: 'negative',
      message: 'Recharge failed',
      caption: err.message || 'Please try again later'
    })
  } finally {
    $q.loading.hide()
  }
}
</script>

<style scoped>
.recharge-page {
  background: #fbfcfe;
}

.premium-recharge-card {
  border-radius: 40px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 40px 80px -20px rgba(15, 23, 42, 0.1) !important;
}

.operator-vignette {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.op-icon-container {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.operator-vignette.active .op-icon-container {
  transform: scale(1.1);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  border: 4px solid white;
}

.operator-vignette.active .op-label {
  color: var(--q-primary);
}

.premium-plan-card {
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 18px;
  transition: all 0.3s ease;
}

.premium-plan-card:hover {
  transform: translateY(-4px);
  background: white;
  border-color: var(--q-primary);
}

.premium-plan-card.active-plan {
  background: var(--q-primary);
  color: white;
  border-color: var(--q-primary);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
}

.custom-input :deep(.q-field__control) {
  height: 64px;
}

.btn-recharge {
  height: 64px;
  transition: all 0.3s ease;
}

.btn-recharge:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.3);
}

.tracking-tight {
  letter-spacing: -0.02em;
}
</style>


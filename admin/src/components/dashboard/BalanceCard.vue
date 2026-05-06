<template>
  <q-card class="balance-card relative-position overflow-hidden no-border text-white q-pa-md q-pa-sm-lg q-pa-md-xl">
    <!-- Decorative Glass Overlay -->
    <div class="glass-overlay"></div>

    <div class="card-content full-height column justify-between position-relative card-top-layer">
      <div class="row items-start justify-between no-wrap">
        <div class="column col-grow">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <div class="text-caption text-uppercase tracking-widest opacity-60 font-weight-bold" style="font-size: 0.7rem">Available Balance</div>
            <q-btn
              flat
              dense
              no-caps
              :label="showBalance ? 'Hide Balance' : 'Show Balance'"
              class="text-caption text-weight-bold opacity-80 decoration-none"
              style="font-size: 0.7rem; min-height: unset; padding: 2px 4px; border-radius: 4px;"
              @click="showBalance = !showBalance"
            />
          </div>
          <div class="balance-amount text-weight-bolder tracking-tight">
            {{ showBalance ? `Rs ${balance.toLocaleString('en-PK', { minimumFractionDigits: 2 })}` : 'Rs ********' }}
          </div>
        </div>
        <div class="icon-circle bg-white text-dark shadow-1 q-ml-sm">
          <q-icon name="account_balance_wallet" size="20px" />
        </div>
      </div>

      <div class="row items-end justify-between q-mt-md no-wrap">
        <div class="column col-grow">
          <div class="text-caption text-uppercase tracking-widest opacity-60 q-mb-xs font-weight-bold" style="font-size: 0.7rem">Account Number</div>
          <div class="account-number-text text-weight-bolder tracking-widest font-mono">
            {{ formatAccountNumber(accountNumber) }}
          </div>
        </div>
        <q-icon name="contactless" size="28px" class="opacity-60 q-ml-sm" />
      </div>
    </div>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  balance: number
  accountNumber: string
}>()

const showBalance = ref(false)

const formatAccountNumber = (acc: string) => {
  if (!acc) return '';
  // If it's already masked (e.g. **** **** **** 1234), just return
  if (acc.includes('*')) return acc;
  return acc.replace(/(.{4})/g, '$1 ').trim();
}
</script>


<style scoped>
.balance-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  border-radius: 24px !important;
  color: white;
  width: 100%;
  max-width: 480px;
  min-height: 180px;
  aspect-ratio: 1.6 / 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.5) !important;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 480px) {
  .balance-card {
    aspect-ratio: 1.58 / 1;
    padding: 24px !important;
    min-height: 200px;
  }
}

.balance-card:hover {
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 35px 60px -15px rgba(15, 23, 42, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
  pointer-events: none;
}

.icon-circle {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
}

.balance-amount {
  font-size: clamp(1.6rem, 8vw, 2.8rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.account-number-text {
  font-size: clamp(0.9rem, 4vw, 1.2rem);
}

.font-mono {
  font-family: inherit; /* Using standard font but spaced nicely looks better than actual courier */
}

.tracking-widest {
  letter-spacing: 0.15em;
}

.tracking-tight {
  letter-spacing: -0.02em;
}

.opacity-60 { opacity: 0.6; }
.card-top-layer { z-index: 1; }
</style>

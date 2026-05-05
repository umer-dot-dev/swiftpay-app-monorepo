<template>
  <q-page class="invest-page q-pa-md q-pa-md-xl">
    <div class="row items-center q-mb-xl">
      <q-btn flat round icon="arrow_back" color="primary" @click="$router.back()" class="q-mr-md" />
      <div>
        <div class="text-h4 text-weight-bolder text-primary tracking-tight">Investments</div>
        <div class="text-subtitle1 text-grey-7">Grow your wealth with smart financial choices</div>
      </div>
    </div>

    <!-- Portfolio Card -->
    <div class="row justify-center justify-md-start q-mb-xl">
      <q-card class="portfolio-card relative-position overflow-hidden no-border text-white q-pa-md q-pa-sm-lg q-pa-md-xl">
        <!-- Decorative Elements -->
        <div class="card-glass-shine"></div>
        
        <div class="card-top-layer full-height column justify-between relative-position">
          <div class="row items-start justify-between no-wrap">
            <div class="column col-grow">
              <div class="text-caption text-uppercase tracking-widest opacity-60 q-mb-xs font-weight-bold" style="font-size: 0.7rem">Total Portfolio Value</div>
              <div class="portfolio-amount text-weight-bolder tracking-tight">
                Rs 245,600.00
              </div>
            </div>
            <div class="icon-circle bg-white text-primary shadow-2">
              <q-icon name="trending_up" size="20px" />
            </div>
          </div>

          <div class="row items-center justify-between q-mt-md no-wrap">
            <div class="column">
              <div class="row items-center bg-white-10 text-positive q-px-md q-py-sm border-radius-12 text-weight-bold portfolio-stats">
                <q-icon name="arrow_upward" size="xs" class="q-mr-xs" />
                +12.4% <span class="gt-xs q-ml-xs">(Rs 27,200)</span>
              </div>
            </div>
            <q-icon name="insights" size="28px" class="opacity-40" />
          </div>
        </div>
      </q-card>
    </div>

    <!-- Investment Categories -->
    <div class="text-h6 text-weight-bold q-mb-md">Explore Assets</div>
    <div class="row q-col-gutter-lg q-mb-xl">
      <div v-for="asset in assets" :key="asset.label" class="col-12 col-sm-4">
        <q-card class="asset-card q-pa-lg cursor-pointer transition-hover no-shadow border-radius-24 border-light">
          <q-avatar :color="asset.color + '-1'" :text-color="asset.color" :icon="asset.icon" size="56px" class="q-mb-md" />
          <div class="text-h6 text-weight-bold">{{ asset.label }}</div>
          <div class="text-caption text-grey-6 q-mb-md">{{ asset.description }}</div>
          <div class="row items-center justify-between">
            <div class="text-weight-bold text-positive">{{ asset.return }} p.a</div>
            <q-btn flat round color="grey-4" icon="chevron_right" dense />
          </div>
        </q-card>
      </div>
    </div>

    <!-- Market Overview / Top Funds -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6 text-weight-bold">Top Performing Funds</div>
      <q-btn flat color="primary" label="See All" no-caps />
    </div>

    <q-card class="no-border no-shadow border-radius-24 bg-white border-light q-pa-none overflow-hidden">
      <q-list separator>
        <q-item v-for="fund in topFunds" :key="fund.name" class="q-py-lg q-px-xl transition-hover">
          <q-item-section avatar>
            <q-img :src="fund.logo" width="48px" height="48px" class="border-radius-12" />
          </q-item-section>
          
          <q-item-section>
            <q-item-label class="text-weight-bold text-subtitle1">{{ fund.name }}</q-item-label>
            <q-item-label caption class="text-grey-6">{{ fund.risk }} Risk • {{ fund.category }}</q-item-label>
          </q-item-section>

          <q-item-section side class="text-right">
            <q-item-label class="text-weight-bold text-positive text-subtitle1">+{{ fund.yield }}%</q-item-label>
            <q-item-label caption>3Y Return</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <!-- Investment CTA -->
    <q-card class="cta-card q-pa-xl q-mt-xl text-center border-radius-32 shadow-3 no-border bg-dark text-white">
      <div class="text-h5 text-weight-bold q-mb-sm">Ready to build your future?</div>
      <div class="text-subtitle1 opacity-70 q-mb-lg">Start with as little as Rs 1,000 only.</div>
      <q-btn color="white" text-color="dark" label="Get Started Now" rounded unelevated class="q-px-xl q-py-md text-weight-bold" no-caps />
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
const assets = [
  { 
    label: 'Mutual Funds', 
    icon: 'account_balance', 
    color: 'blue', 
    return: '15-18%', 
    description: 'Diversified portfolios managed by professionals.' 
  },
  { 
    label: 'Stocks', 
    icon: 'show_chart', 
    color: 'green', 
    return: '20-25%', 
    description: 'Directly invest in top companies across the market.' 
  },
  { 
    label: 'Digital Gold', 
    icon: 'monetization_on', 
    color: 'orange', 
    return: '8-12%', 
    description: 'Secure, physical gold backed by digital convenience.' 
  }
]

const topFunds = [
  { 
    name: 'Growth Equity Fund', 
    yield: '24.5', 
    risk: 'High', 
    category: 'Equity', 
    logo: 'https://cdn-icons-png.flaticon.com/128/2965/2965306.png' 
  },
  { 
    name: 'Stable Income Fund', 
    yield: '14.2', 
    risk: 'Low', 
    category: 'Money Market', 
    logo: 'https://cdn-icons-png.flaticon.com/128/2422/2422841.png' 
  },
  { 
    name: 'Shariah Compliant ETF', 
    yield: '18.9', 
    risk: 'Medium', 
    category: 'Balanced', 
    logo: 'https://cdn-icons-png.flaticon.com/128/3309/3309991.png' 
  }
]
</script>

<style scoped>
.invest-page {
  background: #fbfcfe;
}

.portfolio-card {
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
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 480px) {
  .portfolio-card {
    aspect-ratio: unset;
    min-height: 160px;
    padding: 16px !important;
  }
}

.portfolio-amount {
  font-size: clamp(1.6rem, 8vw, 2.8rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.portfolio-stats {
  font-size: clamp(0.75rem, 2vw, 0.9rem);
}

.card-top-layer { z-index: 1; }

.card-glass-shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
  pointer-events: none;
}

.icon-circle {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-white-10 {
  background: rgba(255, 255, 255, 0.1);
}

.asset-card {
  background: white;
}

.border-light {
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.asset-card:hover {
  transform: translateY(-8px);
  border-color: var(--q-primary);
  box-shadow: 0 20px 30px -10px rgba(0,0,0,0.06) !important;
}

.transition-hover {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-card {
  background: #0f172a;
}

.border-radius-32 { border-radius: 32px !important; }
.border-radius-24 { border-radius: 24px !important; }
.border-radius-16 { border-radius: 16px !important; }
.border-radius-12 { border-radius: 12px !important; }

.tracking-tight { letter-spacing: -0.03em; }
.tracking-widest { letter-spacing: 0.15em; }

.bg-positive-soft {
  background: rgba(34, 197, 94, 0.1);
}
</style>

import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'send', component: () => import('pages/actions/SendPage.vue') },
      { path: 'receive', component: () => import('pages/actions/ReceivePage.vue') },
      { path: 'recharge', component: () => import('pages/actions/RechargePage.vue') },
      { path: 'bills', component: () => import('pages/actions/BillsPage.vue') },
      { path: 'topup', component: () => import('pages/actions/TopUpPage.vue') },
      { path: 'cards', component: () => import('pages/actions/CardsPage.vue') },
      { path: 'tickets', component: () => import('pages/actions/TicketsPage.vue') },
      { path: 'invest', component: () => import('pages/actions/InvestPage.vue') },
      { path: 'zakat', component: () => import('pages/actions/ZakatPage.vue') },
      { path: 'transactions', component: () => import('pages/TransactionsPage.vue') },
      { path: 'wallet', component: () => import('pages/WalletPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') }
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/auth/LoginPage.vue') },
      { path: '/signup', component: () => import('pages/auth/SignupPage.vue') },
    ]
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

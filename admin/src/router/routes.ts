import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'transactions', component: () => import('pages/TransactionsPage.vue') },
      { path: 'cards', component: () => import('pages/CardsPage.vue') },
      { path: 'notifications', component: () => import('pages/BroadcastPage.vue') },
      { path: 'settings', component: () => import('pages/SettingsPage.vue') }
    ],
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '/login', component: () => import('pages/auth/LoginPage.vue') },
      { path: '/signup', component: () => import('pages/auth/SignupPage.vue') }
    ]
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

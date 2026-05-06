# SwiftPay Monorepo 🚀

SwiftPay is a high-performance, premium digital wallet and payment platform built with a modern monorepo architecture. It features a sleek user dashboard, a powerful administrative control center, and a robust serverless backend.

## 🏗 Project Architecture

This is a monorepo containing three main packages:

- **`frontend/`**: A premium Quasar (Vue 3) application for users to manage their wallet, send money, and pay bills.
- **`admin/`**: A comprehensive administrative panel for managing users, monitoring transactions, and broadcasting system-wide notifications.
- **`backend/`**: A high-performance Hono-based API deployed on Cloudflare Workers, using Cloudflare D1 as the database.

## 🛠 Technology Stack

- **Frontend/Admin**: [Quasar Framework](https://quasar.dev/) (Vue 3, TypeScript, Vite)
- **Backend**: [Hono](https://hono.dev/) (Serverless framework for Cloudflare Workers)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQL database)
- **Styling**: Vanilla CSS, SCSS, and Quasar Design System
- **State Management**: [Pinia](https://pinia.vuejs.org/)

## 🚀 Key Features

### 👤 User Application (Frontend)
- **Dashboard**: Real-time balance updates and quick action shortcuts.
- **Instant Transfers**: Send money to live users via email discovery.
- **Wallet Management**: Add funds (Top-up), pay utility bills, and mobile recharge.
- **Notification System**: Real-time alerts with bulk management (Mark all read/Clear all).
- **Security**: Biometric-ready authentication and secure JWT-based sessions.

### 🛡 Administrative Panel (Admin)
- **User Management**: Block/Unblock users, delete accounts with cascading cleanup, and view detailed user profiles.
- **Transaction Ledger**: Full visibility into system-wide fund movements.
- **Broadcast System**: Send global notifications to all users instantly.
- **Analytics**: High-level dashboard stats and system health monitoring.

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm
- Cloudflare Wrangler CLI (`npm install -g wrangler`)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/umer-dot-dev/swiftpay-app-monorepo.git
   cd swiftpay-app-monorepo
   ```

2. **Install dependencies**:
   ```bash
   # Install root dependencies and bootstrap packages
   npm install
   ```

### Running Locally

To launch the full development environment, you can run the following commands in separate terminals:

1. **Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend (User App)**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Admin Panel**:
   ```bash
   cd admin
   npm run dev
   ```

The applications will be available at:
- Frontend: `http://localhost:9000`
- Admin: `http://localhost:9100`
- API: `http://localhost:8787`

## ☁️ Deployment

The project is designed for seamless deployment on **Cloudflare Pages** and **Cloudflare Workers**.

1. **Backend**:
   ```bash
   cd backend
   npx wrangler deploy
   ```

2. **Frontend/Admin**:
   Connect your GitHub repository to Cloudflare Pages and set the build commands:
   - Build Command: `npm run build`
   - Output Directory: `dist/spa`

## 📄 License

This project is proprietary and for demonstration purposes.

---
Built with ❤️ by the SwiftPay Team.

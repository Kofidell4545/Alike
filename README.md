# Alikke👬

A decentralized, anonymous mental health and addiction support platform built with Oasis Sapphire and ROFL for secure backend logic, paired with a modern React frontend.

## 🚀 Features

* Decentralized and confidential peer-to-professional support
* Verified psychologist and professional onboarding only
* Anonymous user interactions with zero identity exposure
* Confidential conversation handling in ROFL Trusted Execution Environments (TEE)
* Secure storage and computation via Oasis Sapphire
* React frontend with TypeScript and Tailwind CSS
* Seamless user experience with privacy-first design

## 📋 Prerequisites

* Node.js (v18 or higher)
* npm package manager
* Oasis CLI
* Sapphire testnet wallet and test tokens

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <https://github.com/Kofidell4545/Alike.git >
cd alikke
```

### 2. Set Up Oasis Sapphire Environment

Follow the official [Oasis Sapphire Docs](https://docs.oasis.io/) to:

* Install Oasis CLI
* Set up ROFL app and test wallet
* Request test tokens

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

## 💻 Development

### ROFL Backend

The backend logic is written to run in a ROFL TEE environment and uses Sapphire services for confidential execution.

To deploy and run:

```bash
# Build ROFL logic
cd backend
rofl build

# Deploy ROFL app
rofl deploy --network testnet
```

### Frontend

Built with React, TypeScript, Tailwind CSS.

To start the development server:

```bash
cd frontend
npm dev
```

To build for production:

```bash
pnpm build
```

## 🏗️ Project Structure

```
alikke/
├── backend/               # ROFL confidential logic
│   ├── /          # Message handlers
│   └/            # ROFL + Sapphire settings
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── views/         # Pages
│   │   ├── config/        # App config (ROFL addresses, network)
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🔧 Configuration

### ROFL/Sapphire

* Set secret keys, TEE authentication logic, and confidential app configs in `/backend/config`
* Use `roflEnsureAuthorizedOrigin` to verify TEE-authenticated messages

### Frontend

* Network and app IDs are configured in `src/config`
* Confidential frontend logic fetches from ROFL endpoints via secure client

## 🔐 Security

* All sessions and conversations handled confidentially in Sapphire TEEs
* Only verified professionals onboarded to offer support
* Data never leaves the confidential execution space
* Wallet authentication ensures user anonymity and prevents impersonation

## 🧪 Testing

### Backend (ROFL)

```bash
cd backend
rofl test
```

### Frontend

```bash
cd frontend
pnpm test
```

## 📦 Deployment

### ROFL

```bash
cd backend
rofl build
rofl deploy --network mainnet
```

### Frontend

```bash
cd frontend
pnpm build
# Deploy with your preferred static host (Vercel, Netlify, etc.)
```

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License. See `LICENSE` for details.

## 🙏 Acknowledgments

* Oasis Protocol Foundation
* React & Vite Teams
* ROFL + Sapphire Contributors
* Mental health advocates and the wider Web3 community

## 📞 Support

For support, please open an issue or contact the maintainers directly.

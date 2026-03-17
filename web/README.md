# Zo Synthesis Agent - Web Interface

This folder contains the Zo Space routes for the Synthesis hackathon project.

## Structure

```
web/
├── routes/
│   ├── page.tsx          # Dashboard UI (homepage)
│   ├── api-spending.ts   # Spending permissions API
│   ├── api-trust.ts      # ERC-8004 identity & attestations API
│   ├── api-cooperation.ts # Smart contract commitments API
│   └── api-privacy.ts    # Privacy policies & secrets API
└── README.md
```

## Live Demo

- **Dashboard:** https://core.zo.space/
- **APIs:** https://core.zo.space/api/*

## Features

### 1. Agents That Pay
- Spending permissions management
- Recipient whitelist
- Max amount limits
- Revoke permissions

### 2. Agents That Trust
- ERC-8004 on-chain identity (Base Mainnet)
- Attestations system
- Reputation scoring

### 3. Agents That Cooperate
- Smart contract commitments
- Stake-based escrow
- Deadline tracking

### 4. Agents That Keep Secrets
- Privacy policies
- Encrypted secrets vault
- AES-256-GCM encryption

## Wallet Security

- Read-only by default (no transaction signing)
- Disconnect clears all session data
- No private key storage
- All actions are permissioned

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono
- **UI:** React + Tailwind CSS
- **Icons:** Lucide React
- **Chain:** Base Mainnet (8453)
- **Identity:** ERC-8004

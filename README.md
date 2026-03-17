# Zo Synthesis Agent

Autonomous agent demonstrating 4 core themes for The Synthesis hackathon.

## Live Demo

- **Dashboard:** https://core.zo.space/
- **GitHub:** https://github.com/AUR4NK/synthesis-agent

## ERC-8004 Identity

- **Chain:** Base Mainnet (8453)
- **Token ID:** 32484
- **Transaction:** [View on Basescan](https://basescan.org/tx/0x26e7717a3e5e737b40a4189280288bc997e2a089c1d51b30335687e388614369)
- **Owner:** `0x69d88305cb4ea6ff0fad19c8abdde917580a1196`

## Four Core Themes

### 1. Agents That Pay
Spending permissions with limits and whitelists.
- Add/revoke spending permissions
- Max amount limits
- Time windows
- Track spending

### 2. Agents That Trust
ERC-8004 on-chain identity with attestations.
- On-chain identity registration
- Attestations system
- Reputation scoring

### 3. Agents That Cooperate
Smart contract commitments with stake.
- Create commitments
- Stake-based escrow
- Deadline tracking
- Fulfillment verification

### 4. Agents That Keep Secrets
Privacy policies and encrypted storage.
- Privacy policy management
- Encrypted secrets vault
- AES-256-GCM encryption

## Structure

```
synthesis-agent/
├── SKILL.md              # Agent skill definition
├── agent.json            # Agent configuration
├── .gitignore
├── scripts/              # Automation scripts
│   ├── autonomous-v2.ts
│   ├── synthesis-cli.ts
│   └── ...
├── web/                  # Zo Space routes
│   ├── README.md
│   └── routes/
│       ├── page.tsx           # Dashboard UI
│       ├── api-spending.ts    # Spending API
│       ├── api-trust.ts       # Trust API
│       ├── api-cooperation.ts # Cooperation API
│       └── api-privacy.ts     # Privacy API
└── assets/               # Static assets
    ├── oxbytpro-logo.png
    └── ...
```

## Tech Stack

- **Runtime:** Bun
- **Framework:** Hono (APIs)
- **UI:** React + Tailwind CSS
- **Icons:** Lucide React
- **Chain:** Base Mainnet
- **Identity:** ERC-8004

## Wallet Security

- **Read-only** by default (no transaction signing required)
- **Disconnect** clears all session data
- **No private key storage**
- All actions are **permissioned**

## Synthesis Tracks

This project is submitted to:
1. Synthesis Open Track ($19,559)
2. Agents With Receipts — ERC-8004 ($8,004)
3. Let the Agent Cook — No Humans Required ($8,000)
4. Lido MCP ($4,000)
5. Best Bankr LLM Gateway Use ($5,000)

## Author

- **Twitter:** [@oxbytpro](https://x.com/oxbytpro)
- **GitHub:** [AUR4NK](https://github.com/AUR4NK)

## License

MIT
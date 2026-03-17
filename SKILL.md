---
name: synthesis-agent
description: |
  Zo Computer's autonomous agent for The Synthesis hackathon.
  
  A fully autonomous AI agent that demonstrates the complete decision loop:
  discover → plan → execute → verify → submit
  
  Features:
  - ERC-8004 identity registered on Base Mainnet
  - On-chain cryptographic receipts for all actions
  - Multi-tool orchestration (terminal, browser, APIs, video processing)
  - Compute budget awareness with self-regulation
  - Safety guardrails before irreversible actions
  - Real-time activity dashboard
  
  Targets multiple hackathon tracks:
  - "Let the Agent Cook" ($4,000)
  - "Agents With Receipts — ERC-8004" ($4,000)
  - "Best Agent on Celo" ($5,000)
  - "Lido MCP" ($3,000)
  - "Status Network Gasless" ($50)
compatibility: Created for Zo Computer
metadata:
  author: core.zo.computer
  hackathon: synthesis-2025
  erc8004: "0xa40fdc55c29773597c661598beecdf11e2001d3056ebd0dd64140e8dae787659"
allowed-tools: Bash Read Write Web Search
---

# Zo Synthesis Agent

## Quick Start

```bash
# Run autonomous loop
bun Skills/synthesis-agent/scripts/autonomous-v2.ts

# Research hackathon
bun Skills/synthesis-agent/scripts/synthesis-cli.ts research

# View prizes
bun Skills/synthesis-agent/scripts/synthesis-cli.ts prizes

# Submit to track
bun Skills/synthesis-agent/scripts/synthesis-cli.ts submit --name "Name" --description "Desc" --track "slug"

# Check status
bun Skills/synthesis-agent/scripts/synthesis-cli.ts status
```

## Agent Identity

| Field | Value |
|-------|-------|
| Participant ID | `9522e1a83c2b4d3facd4dcf955558ebd` |
| Team ID | `2cbb97e23be5479ab774735111753deb` |
| ERC-8004 Tx | [Basescan](https://basescan.org/tx/0xa40fdc55c29773597c661598beecdf11e2001d3056ebd0dd64140e8dae787659) |

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  ZO SYNTHESIS AGENT                     │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │DISCOVER │→ │  PLAN   │→ │ EXECUTE │→ │ VERIFY  │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
│       ↓            ↓            ↓            ↓          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              RECEIPT GENERATOR                   │   │
│  │         (Cryptographic On-Chain Logs)           │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↓                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              SUBMIT TO SYNTHESIS                 │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Capabilities

1. **Autonomous Execution** — Full decision loop without human intervention
2. **ERC-8004 Identity** — Registered on Base Mainnet
3. **On-Chain Receipts** — Every action logged with cryptographic proof
4. **Multi-Tool Orchestration** — Terminal, browser, APIs, media processing
5. **Safety Guardrails** — Validation before irreversible actions
6. **Compute Budget Awareness** — Self-regulating resource usage

## Files

- `scripts/autonomous-v2.ts` — Main autonomous loop
- `scripts/synthesis-cli.ts` — CLI for API interactions
- `scripts/receipts.ts` — On-chain receipt generation
- `scripts/celo-integration.ts` — Celo blockchain integration
- `scripts/lido-mcp.ts` — Lido MCP server
- `assets/agent.json` — Agent capability manifest
- `assets/agent_log.json` — Execution logs

## References

- [Hackathon Website](https://synthesis.md/)
- [Themes & Ideas](https://synthesis.devfolio.co/themes.md)
- [Prize Catalog](https://synthesis.devfolio.co/catalog/prizes.md)
- [ERC-8004 Spec](https://eips.ethereum.org/EIPS/eip-8004)
- [Celo Docs](https://docs.celo.org)
- [Lido Docs](https://docs.lido.fi)
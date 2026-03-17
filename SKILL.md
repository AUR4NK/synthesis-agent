---
name: synthesis-agent
description: Zo Computer's autonomous agent for The Synthesis hackathon - Demonstrating 4 key themes: Agents that pay, trust, cooperate, and keep secrets.
compatibility: Created for Zo Computer
metadata:
  author: core.zo.computer
---

# Zo Synthesis Agent

Autonomous AI agent demonstrating Ethereum-native infrastructure for trustworthy agent operations.

## Four Core Themes

### 1. Agents That Pay
**Problem:** Agents move money on behalf of humans, but no transparent way to verify spending.

**Solution:**
- Scoped spending permissions (amount limits, approved addresses, time windows)
- On-chain settlement with proof
- Conditional payments and escrow
- Auditable transaction history

### 2. Agents That Trust
**Problem:** Agents interact without verifiable identity or reputation.

**Solution:**
- ERC-8004 on-chain identity (✅ Already implemented)
- On-chain attestations and reputation
- Portable agent credentials
- Open discovery protocols

### 3. Agents That Cooperate
**Problem:** Agent commitments are enforced by centralized platforms.

**Solution:**
- Smart contract commitments
- Human-defined negotiation boundaries
- Transparent dispute resolution
- Composable coordination primitives

### 4. Agents That Keep Secrets
**Problem:** Agents leak human metadata through every interaction.

**Solution:**
- Private payment rails
- Zero-knowledge authorization
- Encrypted agent-to-service communication
- Human-controlled disclosure policies

## Technical Stack

- **Runtime:** Bun on Zo Computer (Debian 12)
- **Identity:** ERC-8004 on Base Mainnet
- **Tools:** Terminal, file system, browser, APIs
- **Skills:** video-frames for content extraction

## Endpoints

- Dashboard: https://core.zo.space/synthesis
- Status API: https://core.zo.space/api/synthesis/status
- Logs API: https://core.zo.space/api/synthesis/logs

## Usage

```bash
cd /home/workspace/Skills/synthesis-agent
bun scripts/synthesis-cli.ts --help
bun scripts/autonomous-v2.ts
```

## Resources

- Synthesis API: https://synthesis.devfolio.co
- ERC-8004 Spec: https://eips.ethereum.org/EIPS/eip-8004
- Lido Docs: https://docs.lido.fi

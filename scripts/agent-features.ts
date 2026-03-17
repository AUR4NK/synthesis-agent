#!/usr/bin/env bun

/**
 * Zo Synthesis Agent - Four Themes Implementation
 * 
 * 1. Agents That Pay - Scoped spending permissions
 * 2. Agents That Trust - ERC-8004 identity & attestations
 * 3. Agents That Cooperate - Smart contract commitments
 * 4. Agents That Keep Secrets - Privacy controls
 */

import { randomUUID } from "crypto";
import { writeFileSync, readFileSync } from "fs";

// ============================================
// THEME 1: AGENTS THAT PAY
// ============================================

interface SpendingPermission {
  id: string;
  humanAddress: string;
  maxAmount: string;
  approvedAddresses: string[];
  timeWindow: {
    start: number;
    end: number;
  };
  spent: string;
  status: "active" | "exhausted" | "expired";
}

interface PaymentIntent {
  id: string;
  permissionId: string;
  recipient: string;
  amount: string;
  condition?: string;
  status: "pending" | "approved" | "rejected" | "completed";
  txHash?: string;
  createdAt: number;
}

function createSpendingPermission(
  humanAddress: string,
  maxAmount: string,
  approvedAddresses: string[],
  durationDays: number
): SpendingPermission {
  const now = Date.now();
  return {
    id: randomUUID(),
    humanAddress,
    maxAmount,
    approvedAddresses,
    timeWindow: {
      start: now,
      end: now + durationDays * 24 * 60 * 60 * 1000,
    },
    spent: "0",
    status: "active",
  };
}

function validatePaymentIntent(
  permission: SpendingPermission,
  recipient: string,
  amount: string
): { valid: boolean; reason?: string } {
  if (permission.status !== "active") {
    return { valid: false, reason: "Permission not active" };
  }
  
  if (Date.now() > permission.timeWindow.end) {
    return { valid: false, reason: "Time window expired" };
  }
  
  if (!permission.approvedAddresses.includes(recipient)) {
    return { valid: false, reason: "Recipient not approved" };
  }
  
  const currentSpent = BigInt(permission.spent);
  const newAmount = BigInt(amount);
  const max = BigInt(permission.maxAmount);
  
  if (currentSpent + newAmount > max) {
    return { valid: false, reason: "Would exceed max amount" };
  }
  
  return { valid: true };
}

// ============================================
// THEME 2: AGENTS THAT TRUST
// ============================================

interface Attestation {
  id: string;
  agentId: string;
  attester: string;
  type: "capability" | "reputation" | "verification";
  data: Record<string, unknown>;
  timestamp: number;
  signature?: string;
  onChainTxHash?: string;
}

interface AgentReputation {
  agentId: string;
  totalAttestations: number;
  capabilityScore: number;
  reputationScore: number;
  verificationCount: number;
  attestations: Attestation[];
}

function createAttestation(
  agentId: string,
  attester: string,
  type: Attestation["type"],
  data: Record<string, unknown>
): Attestation {
  return {
    id: randomUUID(),
    agentId,
    attester,
    type,
    data,
    timestamp: Date.now(),
  };
}

function calculateReputation(attestations: Attestation[]): AgentReputation {
  const capabilities = attestations.filter(a => a.type === "capability");
  const reputations = attestations.filter(a => a.type === "reputation");
  const verifications = attestations.filter(a => a.type === "verification");
  
  return {
    agentId: attestations[0]?.agentId || "",
    totalAttestations: attestations.length,
    capabilityScore: capabilities.length * 10,
    reputationScore: reputations.reduce((sum, a) => sum + (a.data.score as number || 0), 0),
    verificationCount: verifications.length,
    attestations,
  };
}

// ============================================
// THEME 3: AGENTS THAT COOPERATE
// ============================================

interface Commitment {
  id: string;
  parties: string[];
  terms: {
    description: string;
    deliverables: string[];
    deadline: number;
    payment?: {
      amount: string;
      token: string;
      recipient: string;
    };
  };
  status: "proposed" | "accepted" | "in_progress" | "completed" | "disputed";
  escrow?: {
    address: string;
    amount: string;
    locked: boolean;
  };
  createdAt: number;
  acceptedAt?: number;
  completedAt?: number;
}

interface NegotiationBoundary {
  id: string;
  humanAddress: string;
  agentId: string;
  parameters: {
    minPrice?: string;
    maxPrice?: string;
    allowedDeliverables: string[];
    maxDeadline: number;
    requireEscrow: boolean;
  };
}

function createCommitment(
  parties: string[],
  terms: Commitment["terms"]
): Commitment {
  return {
    id: randomUUID(),
    parties,
    terms,
    status: "proposed",
    createdAt: Date.now(),
  };
}

function validateNegotiation(
  boundary: NegotiationBoundary,
  commitment: Commitment
): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  
  if (commitment.terms.payment) {
    const amount = BigInt(commitment.terms.payment.amount);
    if (boundary.parameters.minPrice && amount < BigInt(boundary.parameters.minPrice)) {
      violations.push("Payment below minimum");
    }
    if (boundary.parameters.maxPrice && amount > BigInt(boundary.parameters.maxPrice)) {
      violations.push("Payment above maximum");
    }
  }
  
  if (commitment.terms.deadline > boundary.parameters.maxDeadline) {
    violations.push("Deadline exceeds maximum allowed");
  }
  
  if (boundary.parameters.requireEscrow && !commitment.escrow) {
    violations.push("Escrow required but not provided");
  }
  
  return {
    valid: violations.length === 0,
    violations,
  };
}

// ============================================
// THEME 4: AGENTS THAT KEEP SECRETS
// ============================================

interface DisclosurePolicy {
  id: string;
  humanAddress: string;
  agentId: string;
  rules: {
    dataTypes: string[];
    allowedRecipients: string[];
    retentionPeriod: number;
    requireEncryption: boolean;
    anonymizeFields: string[];
  };
  createdAt: number;
}

interface PrivacyTransaction {
  id: string;
  agentId: string;
  dataType: string;
  recipient: string;
  disclosed: boolean;
  anonymized: boolean;
  encrypted: boolean;
  timestamp: number;
}

function createDisclosurePolicy(
  humanAddress: string,
  agentId: string,
  rules: DisclosurePolicy["rules"]
): DisclosurePolicy {
  return {
    id: randomUUID(),
    humanAddress,
    agentId,
    rules,
    createdAt: Date.now(),
  };
}

function validateDisclosure(
  policy: DisclosurePolicy,
  dataType: string,
  recipient: string
): { allowed: boolean; requirements: string[] } {
  const requirements: string[] = [];
  let allowed = true;
  
  if (!policy.rules.dataTypes.includes(dataType)) {
    allowed = false;
  }
  
  if (!policy.rules.allowedRecipients.includes(recipient)) {
    allowed = false;
  }
  
  if (policy.rules.requireEncryption) {
    requirements.push("encryption_required");
  }
  
  if (policy.rules.anonymizeFields.length > 0) {
    requirements.push("anonymization_required");
  }
  
  return { allowed, requirements };
}

// ============================================
// AGENT STATE MANAGEMENT
// ============================================

interface AgentState {
  identity: {
    agentId: string;
    erc8004TokenId: number;
    ownerAddress: string;
    onChainTxHash: string;
  };
  spending: {
    permissions: SpendingPermission[];
    payments: PaymentIntent[];
  };
  trust: {
    attestations: Attestation[];
    reputation: AgentReputation | null;
  };
  cooperation: {
    commitments: Commitment[];
    boundaries: NegotiationBoundary[];
  };
  privacy: {
    policies: DisclosurePolicy[];
    transactions: PrivacyTransaction[];
  };
}

function initializeAgentState(identity: AgentState["identity"]): AgentState {
  return {
    identity,
    spending: {
      permissions: [],
      payments: [],
    },
    trust: {
      attestations: [],
      reputation: null,
    },
    cooperation: {
      commitments: [],
      boundaries: [],
    },
    privacy: {
      policies: [],
      transactions: [],
    },
  };
}

// ============================================
// DEMO / TESTING
// ============================================

function runDemo(): void {
  console.log("\n🤖 ZO SYNTHESIS AGENT - FOUR THEMES DEMO\n");
  console.log("═".repeat(50));
  
  // Initialize agent
  const state = initializeAgentState({
    agentId: "9522e1a83c2b4d3facd4dcf955558ebd",
    erc8004TokenId: 32484,
    ownerAddress: "0x69d88305cb4Ea6FF0FAD19c8aBDde917580a1196",
    onChainTxHash: "0x26e7717a3e5e737b40a4189280288bc997e2a089c1d51b30335687e388614369",
  });
  
  console.log("\n📌 IDENTITY (ERC-8004)");
  console.log(`   Agent ID: ${state.identity.agentId}`);
  console.log(`   Token ID: ${state.identity.erc8004TokenId}`);
  console.log(`   Owner: ${state.identity.ownerAddress}`);
  console.log(`   TX: ${state.identity.onChainTxHash}`);
  
  // Theme 1: Agents That Pay
  console.log("\n💰 THEME 1: AGENTS THAT PAY");
  const perm = createSpendingPermission(
    state.identity.ownerAddress,
    "1000000000000000000", // 1 ETH in wei
    ["0xRecipient1", "0xRecipient2"],
    30
  );
  state.spending.permissions.push(perm);
  console.log(`   ✅ Created spending permission: ${perm.id}`);
  console.log(`      Max: 1 ETH | Recipients: 2 | Duration: 30 days`);
  
  const validation = validatePaymentIntent(perm, "0xRecipient1", "500000000000000000");
  console.log(`   ✅ Payment validation: ${validation.valid ? "APPROVED" : "REJECTED - " + validation.reason}`);
  
  // Theme 2: Agents That Trust
  console.log("\n🔐 THEME 2: AGENTS THAT TRUST");
  const attestation = createAttestation(
    state.identity.agentId,
    "0xAttester1",
    "capability",
    { skill: "autonomous_execution", level: 5 }
  );
  state.trust.attestations.push(attestation);
  state.trust.reputation = calculateReputation(state.trust.attestations);
  console.log(`   ✅ Created attestation: ${attestation.id}`);
  console.log(`      Type: ${attestation.type} | Skill: autonomous_execution`);
  console.log(`   ✅ Reputation score: ${state.trust.reputation.capabilityScore}`);
  
  // Theme 3: Agents That Cooperate
  console.log("\n🤝 THEME 3: AGENTS THAT COOPERATE");
  const commitment = createCommitment(
    [state.identity.agentId, "0xAgent2"],
    {
      description: "Collaborative task execution",
      deliverables: ["report.md", "data.json"],
      deadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
      payment: {
        amount: "500000000000000000",
        token: "ETH",
        recipient: "0xAgent2",
      },
    }
  );
  state.cooperation.commitments.push(commitment);
  console.log(`   ✅ Created commitment: ${commitment.id}`);
  console.log(`      Parties: 2 | Deadline: 7 days | Payment: 0.5 ETH`);
  
  const boundary: NegotiationBoundary = {
    id: randomUUID(),
    humanAddress: state.identity.ownerAddress,
    agentId: state.identity.agentId,
    parameters: {
      maxPrice: "1000000000000000000",
      allowedDeliverables: ["report.md", "data.json"],
      maxDeadline: Date.now() + 14 * 24 * 60 * 60 * 1000,
      requireEscrow: true,
    },
  };
  state.cooperation.boundaries.push(boundary);
  
  const negValidation = validateNegotiation(boundary, commitment);
  console.log(`   ✅ Negotiation validation: ${negValidation.valid ? "WITHIN BOUNDS" : "VIOLATIONS: " + negValidation.violations.join(", ")}`);
  
  // Theme 4: Agents That Keep Secrets
  console.log("\n🔒 THEME 4: AGENTS THAT KEEP SECRETS");
  const policy = createDisclosurePolicy(
    state.identity.ownerAddress,
    state.identity.agentId,
    {
      dataTypes: ["preferences", "activity_log"],
      allowedRecipients: ["0xService1", "0xService2"],
      retentionPeriod: 30 * 24 * 60 * 60 * 1000,
      requireEncryption: true,
      anonymizeFields: ["user_id", "location"],
    }
  );
  state.privacy.policies.push(policy);
  console.log(`   ✅ Created disclosure policy: ${policy.id}`);
  console.log(`      Data types: 2 | Encryption: required | Anonymize: user_id, location`);
  
  const discValidation = validateDisclosure(policy, "preferences", "0xService1");
  console.log(`   ✅ Disclosure validation: ${discValidation.allowed ? "ALLOWED" : "BLOCKED"}`);
  console.log(`      Requirements: ${discValidation.requirements.join(", ") || "none"}`);
  
  // Summary
  console.log("\n" + "═".repeat(50));
  console.log("📊 AGENT STATE SUMMARY");
  console.log(`   Identity: ERC-8004 Token #${state.identity.erc8004TokenId}`);
  console.log(`   Spending permissions: ${state.spending.permissions.length}`);
  console.log(`   Attestations: ${state.trust.attestations.length}`);
  console.log(`   Commitments: ${state.cooperation.commitments.length}`);
  console.log(`   Privacy policies: ${state.privacy.policies.length}`);
  console.log("═".repeat(50));
  
  // Save state
  const statePath = "/home/.z/workspaces/con_xKcDdHf9WRtH8xEt/agent-state.json";
  writeFileSync(statePath, JSON.stringify(state, null, 2));
  console.log(`\n✅ State saved to: ${statePath}`);
}

runDemo();

#!/usr/bin/env bun

/**
 * Spending Permissions API - 
[truncated]
that-pay.md
 */

interface Permission {
  id: string;
  recipient: string;
  maxAmount: string;
  timeWindow: string;
  status: 'active' | 'paused' | 'revoked';
  createdAt: number;
  spent: string;
}

// In-memory store (would be on-chain in production)
const permissions: Permission[] = [
  {
    id: 'perm-001',
    recipient: '0x1234567890abcdef1234567890abcdef12345678',
    maxAmount: '0.5',
    timeWindow: '30 days',
    status: 'active',
    createdAt: Date.now() - 86400000,
    spent: '0.1'
  }
];

// API handlers
export async function listPermissions(): Promise<Permission[]> {
  return permissions.filter(p => p.status !== 'revoked');
}

export async function addPermission(data: Omit<Permission, 'id' | 'createdAt' | 'spent' | 'status'>): Promise<Permission> {
  const newPerm: Permission = {
    ...data,
    id: `perm-${Date.now().toString(36)}`,
    status: 'active',
    createdAt: Date.now(),
    spent: '0'
  };
  permissions.push(newPerm);
  return newPerm;
}

export async function revokePermission(id: string): Promise<boolean> {
  const perm = permissions.find(p => p.id === id);
  if (perm) {
    perm.status = 'revoked';
    return true;
  }
  return false;
}

export async function simulateSpending(id: string, amount: string): Promise<{ success: boolean; reason?: string }> {
  const perm = permissions.find(p => p.id === id);
  if (!perm) return { success: false, reason: 'Permission not found' };
  if (perm.status !== 'active') return { success: false, reason: 'Permission not active' };
  
  const currentSpent = parseFloat(perm.spent);
  const maxAllowed = parseFloat(perm.maxAmount);
  const requestedAmount = parseFloat(amount);
  
  if (currentSpent + requestedAmount > maxAllowed) {
    return { success: false, reason: 'Amount exceeds permission limit' };
  }
  
  perm.spent = (currentSpent + requestedAmount).toString();
  return { success: true };
}

// CLI interface
if (import.meta.main) {
  const [cmd, ...args] = process.argv.slice(2);
  
  switch (cmd) {
    case 'list':
      console.log(JSON.stringify(await listPermissions(), null, 2));
      break;
    case 'add':
      const [recipient, maxAmount, timeWindow] = args;
      console.log(JSON.stringify(await addPermission({ recipient, maxAmount, timeWindow }), null, 2));
      break;
    case 'revoke':
      console.log(JSON.stringify({ revoked: await revokePermission(args[0]) }, null, 2));
      break;
    case 'spend':
      const [permId, spendAmount] = args;
      console.log(JSON.stringify(await simulateSpending(permId, spendAmount), null, 2));
      break;
    default:
      console.log('Usage: spending-api.ts <list|add|revoke|spend> [args]');
  }
}

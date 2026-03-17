import type { Context } from "hono";

let attestations: { type: string; claim: string; issuer: string; timestamp: number; evidence?: string }[] = [
  { type: "identity", claim: "Registered agent on Base Mainnet", issuer: "ERC-8004", timestamp: 1773711600000 }
];
let reputationScore = 10;

export default async (c: Context) => {
  const method = c.req.method;
  
  if (method === "GET") {
    return c.json({ attestations, reputationScore });
  }
  
  if (method === "POST") {
    try {
      const body = await c.req.json();
      const newAtt = {
        type: body.type || "capability",
        claim: body.claim || "",
        issuer: body.issuer || "self",
        timestamp: Date.now(),
        evidence: body.evidence
      };
      attestations.push(newAtt);
      reputationScore += 5;
      return c.json({ ...newAtt, reputationScore });
    } catch {
      return c.json({ attestations, reputationScore });
    }
  }
  
  return c.json({ error: "Method not allowed" }, 405);
};
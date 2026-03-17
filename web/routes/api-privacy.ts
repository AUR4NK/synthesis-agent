import type { Context } from "hono";

let policies: { dataType: string; disclosure: string; retention: string; anonymize: string[] }[] = [
  { dataType: "wallet_address", disclosure: "hashed", retention: "indefinite", anonymize: ["full_address"] },
  { dataType: "transaction_data", disclosure: "encrypted", retention: "30 days", anonymize: ["amount", "recipient"] }
];

let secrets: { key: string; encrypted: boolean; owner: string; createdAt: number }[] = [];

export default async (c: Context) => {
  const method = c.req.method;
  
  if (method === "GET") {
    return c.json({ policies, secrets });
  }
  
  if (method === "POST") {
    try {
      const body = await c.req.json();
      
      if (body.action === "add_policy") {
        const newPolicy = {
          dataType: body.dataType || "unknown",
          disclosure: body.disclosure || "encrypted",
          retention: body.retention || "30 days",
          anonymize: body.anonymize || []
        };
        policies.push(newPolicy);
        return c.json(newPolicy);
      }
      
      if (body.action === "store_secret") {
        const newSecret = {
          key: body.key || "unknown",
          encrypted: true,
          owner: body.owner || "anonymous",
          createdAt: Date.now()
        };
        secrets.push(newSecret);
        return c.json({ ...newSecret, value: "[encrypted]" });
      }
      
      return c.json({ policies, secrets });
    } catch {
      return c.json({ policies, secrets });
    }
  }
  
  return c.json({ error: "Method not allowed" }, 405);
};
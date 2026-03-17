import type { Context } from "hono";

// In-memory storage (persists while server runs)
let permissions: { id: string; recipient: string; maxAmount: string; spent: string; status: string; timeWindow: string; createdAt: number }[] = [
  { id: "perm-default", recipient: "0x69d88305cb4ea6ff0fad19c8abdde917580a1196", maxAmount: "1.0", spent: "0", status: "active", timeWindow: "30 days", createdAt: Date.now() }
];

export default async (c: Context) => {
  const method = c.req.method;
  
  if (method === "GET") {
    return c.json({ permissions });
  }
  
  if (method === "POST") {
    try {
      const body = await c.req.json();
      
      if (body.action === "add") {
        const newPerm = {
          id: `perm-${Date.now().toString(36)}`,
          recipient: body.recipient || "0xunknown",
          maxAmount: body.maxAmount || "0.1",
          spent: "0",
          status: "active",
          timeWindow: body.timeWindow || "30 days",
          createdAt: Date.now()
        };
        permissions.push(newPerm);
        return c.json(newPerm);
      }
      
      if (body.action === "revoke") {
        permissions = permissions.filter(p => p.id !== body.id);
        return c.json({ success: true, revoked: body.id });
      }
      
      return c.json({ permissions });
    } catch {
      return c.json({ permissions });
    }
  }
  
  return c.json({ error: "Method not allowed" }, 405);
};
import type { Context } from "hono";

let commitments: { id: string; type: string; party: string; counterparty?: string; description: string; stake: string; status: string; deadline: number; createdAt: number }[] = [
  { id: "commit-default", type: "task", party: "user", description: "Complete Synthesis hackathon submission", stake: "0.5", status: "active", deadline: 1774170000000, createdAt: Date.now() }
];

export default async (c: Context) => {
  const method = c.req.method;
  
  if (method === "GET") {
    return c.json({ commitments });
  }
  
  if (method === "POST") {
    try {
      const body = await c.req.json();
      
      if (body.action === "create") {
        const newCommit = {
          id: `commit-${Date.now().toString(36)}`,
          type: body.type || "task",
          party: body.party || "user",
          counterparty: body.counterparty,
          description: body.description || "",
          stake: body.stake || "0.1",
          status: "active",
          deadline: body.deadline || Date.now() + 86400000 * 7,
          createdAt: Date.now()
        };
        commitments.push(newCommit);
        return c.json(newCommit);
      }
      
      if (body.action === "fulfill") {
        const commit = commitments.find(c => c.id === body.id);
        if (commit) {
          commit.status = "fulfilled";
        }
        return c.json({ success: true, fulfilled: body.id });
      }
      
      return c.json({ commitments });
    } catch {
      return c.json({ commitments });
    }
  }
  
  return c.json({ error: "Method not allowed" }, 405);
};
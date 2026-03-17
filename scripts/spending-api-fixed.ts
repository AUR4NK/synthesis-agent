import type { Context } from "hono";

const DATA_FILE = "/home/.z/workspaces/con_xKcDdHf9WRtH8xEt/spending-data.json";

function loadData(): { permissions: { id: string; recipient: string; maxAmount: string; spent: string; status: string; timeWindow: string; createdAt: number }[] } {
  try {
    const fs = require("fs");
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }
  } catch {}
  return { permissions: [] };
}

function saveData(data: ReturnType<typeof loadData>) {
  const fs = require("fs");
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export default (c: Context) => {
  const method = c.req.method;
  
  if (method === "GET") {
    return c.json(loadData());
  }
  
  if (method === "POST") {
    return c.json(loadData());
  }
  
  return c.json({ error: "Method not allowed" }, 405);
};

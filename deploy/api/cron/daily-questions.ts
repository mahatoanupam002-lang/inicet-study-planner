import type { VercelRequest, VercelResponse } from "@vercel/node";

// Vercel cron runs this at 18:30 UTC = 00:00 IST
// It pre-generates the day's AI questions so the first user doesn't wait
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel automatically sets this header for cron requests
  const isVercelCron = req.headers["x-vercel-cron"] === "1";
  const secret = req.headers["authorization"];
  const validSecret = process.env.CRON_SECRET && secret === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !validSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const results: Record<string, string> = {};

  for (const date of [today, tomorrow]) {
    try {
      const r = await fetch(`${baseUrl}/api/daily-questions?date=${date}`);
      results[date] = r.ok ? "ok" : `error ${r.status}`;
    } catch (e) {
      results[date] = `failed: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return res.json({ generated: results, ts: new Date().toISOString() });
}

// Vercel cron — runs at 18:30 UTC = 00:00 IST
export default async function handler(req: any, res: any) {
  const isVercelCron = req.headers["x-vercel-cron"] === "1";
  const validSecret =
    process.env.CRON_SECRET &&
    req.headers["authorization"] === `Bearer ${process.env.CRON_SECRET}`;

  if (!isVercelCron && !validSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const today    = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const base     = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

  const results: Record<string, string> = {};
  for (const date of [today, tomorrow]) {
    try {
      const r = await fetch(`${base}/api/daily-questions?date=${date}`);
      results[date] = r.ok ? "ok" : `error ${r.status}`;
    } catch (e) {
      results[date] = `failed: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  return res.json({ generated: results, ts: new Date().toISOString() });
}

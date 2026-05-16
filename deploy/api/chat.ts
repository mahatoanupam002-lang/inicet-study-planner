import type { VercelRequest, VercelResponse } from "@vercel/node";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are an expert NEET PG medical exam tutor helping an Indian postgraduate medical aspirant preparing for NEET PG (National Board of Examinations, Nov 2026).

Your role:
- Give concise, high-yield exam-focused answers
- Use mnemonics and memory hooks whenever relevant
- Highlight key exam-specific facts (DOC, DOC in pregnancy, classic presentations, exceptions)
- When asked about drug classifications, use standard Indian PG exam format (e.g., Vaughan Williams for antiarrhythmics)
- Point out common MCQ traps and favourite examiners' tricks
- Keep answers ≤300 words unless the topic genuinely demands more
- Use bullet points and **bold** for scannable reading
- Always mention the most likely exam angle at the end (e.g., "Most likely asked as: identify the drug from its mechanism")

Subjects covered: Anatomy, Physiology, Biochemistry, Pharmacology, Pathology, Microbiology, FMT/Forensics, PSM/Community Medicine, Medicine, Surgery, OBG, Paediatrics, Orthopaedics, Ophthalmology, ENT, Psychiatry, Radiology, Skin.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfiguration: ANTHROPIC_API_KEY not set" });
  }

  const { messages, context } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string; // optional day context e.g. "Day 5: GI Surgery"
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Keep last 20 messages to avoid excessive token usage
  const trimmedMessages = messages.slice(-20);

  const systemPrompt = context
    ? `${SYSTEM_PROMPT}\n\nThe user is currently studying: ${context}. Prioritise this topic in your responses when relevant.`
    : SYSTEM_PROMPT;

  try {
    const client = new Anthropic({ apiKey });

    // Set up SSE headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const stream = client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: systemPrompt,
      messages: trimmedMessages,
    });

    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!res.headersSent) {
      res.status(500).json({ error: msg });
    } else {
      res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    }
  }
}

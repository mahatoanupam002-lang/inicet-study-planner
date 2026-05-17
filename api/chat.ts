// Root-level Vercel serverless function — zero npm deps, pure fetch
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

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = (req.headers["x-api-key"] as string | undefined) || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(401).json({
      error: "No API key provided. Add your Anthropic API key in the AI Tutor settings (key icon).",
    });
  }

  const { messages, context } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  const trimmedMessages = messages.slice(-20);
  const systemPrompt = context
    ? `${SYSTEM_PROMPT}\n\nThe user is currently studying: ${context}. Prioritise this topic in your responses when relevant.`
    : SYSTEM_PROMPT;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        stream: true,
        system: systemPrompt,
        messages: trimmedMessages,
      }),
    });

    if (!anthropicRes.ok) {
      const err = await anthropicRes.json() as any;
      const msg = err?.error?.message || `Anthropic API error ${anthropicRes.status}`;
      return res.status(anthropicRes.status).json({ error: msg });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    const reader = (anthropicRes.body as any).getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        try {
          const evt = JSON.parse(data);
          if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
            res.write(`data: ${JSON.stringify({ text: evt.delta.text })}\n\n`);
          }
        } catch {}
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

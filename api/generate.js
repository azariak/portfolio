import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, systemInstructions } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  // Debug: Log if API key exists (not the actual key)
  console.log("API Key exists:", !!apiKey, "Length:", apiKey?.length || 0);

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!systemInstructions) {
    return res.status(400).json({ error: "System instructions are required" });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: "Server configuration error: Missing API key",
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstructions,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const responseText = result.response.text();

    // Send as SSE format for frontend compatibility
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.write(`data: ${JSON.stringify({ chunk: responseText })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
      stack: error.stack,
    });
  }
}

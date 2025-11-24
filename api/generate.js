import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, systemInstructions } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

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
      model: "gemini-2.0-flash",
      systemInstruction: systemInstructions,
    });

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
      }
    }

    res.end();
  } catch (error) {
    console.error("Detailed Gemini API stream error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Failed to generate streaming response",
        details: error.message,
      });
    } else {
      res.write(`event: error\ndata: ${JSON.stringify({ error: "Failed to generate response", details: error.message })}\n\n`);
      res.end();
    }
  }
}

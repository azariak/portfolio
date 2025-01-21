import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import questionsAndAnswers from './data/questionsAndAnswers.json';

dotenv.config();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body; // Changed to match client-side 'prompt'
  const apiKey = process.env.GEMINI_API_KEY;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  if (!apiKey) {
    return res.status(500).json({
      error: "Server configuration error: Missing API key",
    });
  }

  try {
    const systemInstructions = questionsAndAnswers.systemInstructions;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp"});

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const responseText = response.text();

    return res.status(200).json({ response: responseText });
  } catch (error) {
    console.error("Detailed Gemini API error:", error);
    return res.status(500).json({
      error: "Failed to generate response",
      details: error.message,
    });
  }
}

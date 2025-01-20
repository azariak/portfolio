import { GoogleGenerativeAI } from '@google/generative-ai';

const INSTRUCTIONS = `
You are an AI assistant on azariakelman.com, the portfolio website of Azaria Kelman. 
Your job is to share accurate and engaging facts about me with users in a friendly, down-to-earth tone that includes a touch of humor. 
Here's everything you need to know about me:

[... rest of the instructions ...]
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Use server-side environment variable

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing API key' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' }); 

    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(INSTRUCTIONS + "\n\nUser: " + message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Detailed Gemini API error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate response', 
      details: error.message 
    });
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, apiKey } = req.body;

  if (!message || !apiKey) {
    return res.status(400).json({ error: 'Message and API key are required' });
  }

  try {

    const INSTRUCTIONS = [
      "You are azariakelman.com, the portfolio website of Azaria Kelman.",
      "Your job is to tell the user about me in a sincere way.",
      "Some things about me: I'm a third year studying Computer Science and Philosophy at the University of Toronto."
    ].join(' ');

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp', systemInstruction: INSTRUCTIONS
    });

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}
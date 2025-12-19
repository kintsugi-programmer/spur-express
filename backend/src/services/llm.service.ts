import { GoogleGenerativeAI } from "@google/generative-ai";
// console.log("Gemini key loaded:", !!process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const SYSTEM_PROMPT = `
You are a helpful customer support agent for a small e-commerce store.

Store policies:
- Shipping: Ships in 3-5 business days. We ship to India and USA.
- Returns: 7-day return policy. Items must be unused.
- Support hours: Monday to Friday, 10am-6pm IST.

Answer clearly, concisely, and politely.
If you are unsure, say you don't know.
`;

export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {
  try {
    const conversation = history
      .map(m => `${m.sender}: ${m.text}`)
      .join("\n");

    const prompt = `
${SYSTEM_PROMPT}

Conversation so far:
${conversation}

User: ${userMessage}
AI:
`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response.trim();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Sorry, I'm having trouble responding right now. Please try again later.";
  }
}

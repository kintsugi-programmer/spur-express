import { Request, Response } from "express";
import {
  createConversation,
  saveMessage,
  getConversationHistory,
} from "../services/chat.service";
import { generateReply } from "../services/llm.service";

export async function postMessage(req: Request, res: Response) {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const conversationId = sessionId || await createConversation();

  await saveMessage(conversationId, "user", message);

  // // TEMP reply (LLM comes next phase) 
  // const reply = "Thanks! Your message has been received.";

  // fetch history BEFORE LLM call
  const history = await getConversationHistory(conversationId);

  const reply = await generateReply(history, message);

  await saveMessage(conversationId, "ai", reply);

  // fetch updated history (includes AI reply)
  const updatedHistory = await getConversationHistory(conversationId);

  res.json({
    reply,
    sessionId: conversationId,
    history: updatedHistory,
  });
}

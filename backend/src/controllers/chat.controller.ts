import { Request, Response } from "express";
import {
  createConversation,
  saveMessage,
  getConversationHistory,
} from "../services/chat.service";

export async function postMessage(req: Request, res: Response) {
  const { message, sessionId } = req.body;

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const conversationId = sessionId || await createConversation();

  await saveMessage(conversationId, "user", message);

  // TEMP reply (LLM comes next phase)
  const reply = "Thanks! Your message has been received.";

  await saveMessage(conversationId, "ai", reply);

  const history = await getConversationHistory(conversationId);

  res.json({
    reply,
    sessionId: conversationId,
    history,
  });
}

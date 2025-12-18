import { pool } from "../db";
import { v4 as uuidv4 } from "uuid";

export async function createConversation(): Promise<string> {
  const id = uuidv4();
  await pool.query(
    "INSERT INTO conversations (id) VALUES ($1)",
    [id]
  );
  return id;
}

export async function saveMessage(
  conversationId: string,
  sender: "user" | "ai",
  text: string
) {
  await pool.query(
    `INSERT INTO messages (id, conversation_id, sender, text)
     VALUES ($1, $2, $3, $4)`,
    [uuidv4(), conversationId, sender, text]
  );
}

export async function getConversationHistory(conversationId: string) {
  const { rows } = await pool.query(
    `SELECT sender, text
     FROM messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );
  return rows;
}

import { z } from "zod";

export const chatHistory = z.object({
  id: z.number().int(),
  customer_id: z.number().int(),
  user_name: z.string(),
  message: z.string(),
  response: z.string(),
  created_at: z.string(),
});

export const chatHistoryInsert = chatHistory.omit({ 
  id: true, 
  created_at: true 
});

export const ChatHistoryModel = {
  tableName: "chat_history",
  primaryKeys: ["id"],
  schema: chatHistory,
  serializer: (obj: object): object => {
    const record = obj as Record<string, unknown>;
    return {
      ...record,
    };
  },
  serializerSchema: chatHistory,
};
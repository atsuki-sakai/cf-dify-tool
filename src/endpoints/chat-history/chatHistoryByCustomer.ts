import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { createDB, chatHistory } from '../../db';
import { chatHistory as chatHistorySchema } from './base';
import { AppContext } from '../../types';

export class ChatHistoryByCustomer extends OpenAPIRoute {
  schema = {
    tags: ['Chat History'],
    summary: 'Get chat history by customer ID',
    request: {
      params: z.object({
        // Cloudflare D1/Drizzle の型整合性のため文字列のまま受け取り
        customerId: z.string(),
      }),
    },
    responses: {
      '200': {
        description: 'Chat history for the customer',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.array(chatHistorySchema),
            }),
          },
        },
      },
    },
  };

  async handle(c: AppContext) {
    const { params } = await this.getValidatedData<typeof this.schema>();
    const { customerId } = params;

    const db = createDB(c.env.DB);
    // Drizzle の列型に合わせ、右辺も string として比較
    const result = await db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.customer_id, customerId));

    return {
      success: true,
      data: result,
    };
  }
}
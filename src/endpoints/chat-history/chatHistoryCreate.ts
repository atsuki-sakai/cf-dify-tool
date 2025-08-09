import { D1CreateEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { ChatHistoryModel } from './base';

export class ChatHistoryCreate extends D1CreateEndpoint<HandleArgs> {
  schema = {
    tags: ["Chat History"],
    summary: "Create chat history",
  };
  _meta = {
    model: ChatHistoryModel,
    fields: ChatHistoryModel.schema.pick({
      customer_id: true,
      user_name: true,
      message: true,
      response: true,
    }),
  };
}
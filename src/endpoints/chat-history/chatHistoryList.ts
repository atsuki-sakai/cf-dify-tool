import { D1ListEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { ChatHistoryModel } from './base';

export class ChatHistoryList extends D1ListEndpoint<HandleArgs> {
  schema = {
    tags: ["Chat History"],
    summary: "List chat history",
  };
  _meta = {
    model: ChatHistoryModel,
  };
}
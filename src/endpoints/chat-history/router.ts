import { fromHono } from "chanfana";
import { Hono } from "hono";

import { ChatHistoryCreate } from "./chatHistoryCreate";
import { ChatHistoryList } from "./chatHistoryList";
import { ChatHistoryByCustomer } from "./chatHistoryByCustomer";

const app = new Hono();

const openapi = fromHono(app, {
  schema: {
    info: {
      title: "Chat History API",
      version: "1.0.0",
    },
    servers: [
      { url: "https://dify-tool.atk721.workers.dev/chat" },
    ],
  },
});

openapi.post("/", ChatHistoryCreate);
openapi.get("/", ChatHistoryList);
openapi.get("/customer/:customerId", ChatHistoryByCustomer);

export { openapi as chatHistoryRouter };
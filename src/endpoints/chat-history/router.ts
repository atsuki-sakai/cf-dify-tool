import { fromHono } from "chanfana";
import { Hono } from "hono";

import { ChatHistoryCreate } from "./chatHistoryCreate";
import { ChatHistoryList } from "./chatHistoryList";
import { ChatHistoryByCustomer } from "./chatHistoryByCustomer";
import { DEPLOY_URL } from "../../lib/constant";

const app = new Hono();

// Add debug route for testing
app.post("/debug", async (c) => {
  const body = await c.req.json();
  console.log("Debug body:", body);
  return c.json({ success: true, body });
});

const openapi = fromHono(app, {
  schema: {
    info: {
      title: "Chat History API",
      version: "1.0.0",
    },
    servers: [
      { url: `${DEPLOY_URL}/chat` },
    ],
  },
});

openapi.post("/", ChatHistoryCreate);
openapi.get("/", ChatHistoryList);
openapi.get("/customer/:customerId", ChatHistoryByCustomer);

export { openapi as chatHistoryRouter };
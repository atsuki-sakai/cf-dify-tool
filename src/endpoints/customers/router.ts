import { fromHono } from "chanfana";
import { Hono } from "hono";

import { CustomerCreate } from "./customerCreate";
import { CustomerDelete } from "./customerDelete";
import { CustomerList } from "./customerList";
import { CustomerRead } from "./customerRead";
import { CustomerUpdate } from "./customerUpdate";
import { DEPLOY_URL } from "../../lib/constant";

const app = new Hono();

const openapi = fromHono(app, {
  schema: {
    info: {
      title: "Customer API",
      version: "1.0.0",
      description: "This is the documentation for Customer CRUD API",
    },
    servers: [
      { url: `${DEPLOY_URL}/customers` },
    ],
  },
});

openapi.post("/", CustomerCreate);
openapi.get("/", CustomerList);
openapi.get("/:id", CustomerRead);
openapi.put("/:id", CustomerUpdate);
openapi.delete("/:id", CustomerDelete);

export { openapi as customersRouter };
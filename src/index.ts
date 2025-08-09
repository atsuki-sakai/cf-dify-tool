import { ApiException, fromHono } from "chanfana";
import { Hono } from "hono";
import { requireBearer } from "./middleware/auth";
import { customersRouter } from "./endpoints/customers/router";
import { chatHistoryRouter } from "./endpoints/chat-history/router";
import { reservationsRouter } from "./endpoints/reservations/router";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { DEPLOY_URL } from "./lib/constant";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Protect only API routes, keep docs ("/") public
app.use("/customers/*", requireBearer);
app.use("/chat/*", requireBearer);
app.use("/reservations/*", requireBearer);

app.onError((err, c) => {
  if (err instanceof ApiException) {
    // If it's a Chanfana ApiException, let Chanfana handle the response
    return c.json(
      { success: false, errors: err.buildResponse() },
      err.status as ContentfulStatusCode,
    );
  }

  console.error("Global error handler caught:", err); // Log the error if it's not known

  // For other errors, return a generic 500 response
  return c.json(
    {
      success: false,
      errors: [{ code: 7000, message: "Internal Server Error" }],
    },
    500,
  );
});

// Setup OpenAPI registry
const openapi = fromHono(app, {
  docs_url: "/",
  schema: {
    info: {
      title: "Dify Tool Cloudflare Worker API",
      version: "1.0.0",
      description: "This is the documentation for Dify Tool Cloudflare Worker API to d1 database to store chat history and reservations",
    },
    servers: [
      { url: DEPLOY_URL },
    ],
  },
});

// Register Sub routers
openapi.route("/customers", customersRouter);
openapi.route("/chat", chatHistoryRouter);
openapi.route("/reservations", reservationsRouter);

// Export the Hono app
export default app;

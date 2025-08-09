import { fromHono } from "chanfana";
import { Hono } from "hono";

import { ReservationCreate } from "./reservationCreate";
import { ReservationList } from "./reservationList";
import { ReservationUpdate } from "./reservationUpdate";
import { ReservationsByCustomer } from "./reservationsByCustomer";

const app = new Hono();

const openapi = fromHono(app, {
  schema: {
    info: {
      title: "Reservation API",
      version: "1.0.0",
      description: "This is the documentation for Reservation CRUD API",
    },
    servers: [
      { url: "https://dify-tool.atk721.workers.dev/reservations" },
    ],
  },
});

openapi.post("/", ReservationCreate);
openapi.get("/", ReservationList);
openapi.get("/customer/:customerId", ReservationsByCustomer);
openapi.put("/:id", ReservationUpdate);

export { openapi as reservationsRouter };
import { fromHono } from "chanfana";
import { Hono } from "hono";

import { ReservationCreate } from "./reservationCreate";
import { ReservationList } from "./reservationList";
import { ReservationUpdate } from "./reservationUpdate";
import { ReservationsByCustomer } from "./reservationsByCustomer";
import { DEPLOY_URL } from "../../lib/constant";

const app = new Hono();

const openapi = fromHono(app, {
  schema: {
    info: {
      title: "Reservation API",
      version: "1.0.0",
      description: "This is the documentation for Reservation CRUD API",
    },
    servers: [
      { url: `${DEPLOY_URL}/reservations` },
    ],
  },
});

openapi.post("/", ReservationCreate);
openapi.get("/", ReservationList);
openapi.get("/customer/:customerId", ReservationsByCustomer);
openapi.put("/:id", ReservationUpdate);

export { openapi as reservationsRouter };
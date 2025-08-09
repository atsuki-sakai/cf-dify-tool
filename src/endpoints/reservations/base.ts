import { z } from "zod";

export const reservation = z.object({
  id: z.number().int(),
  customer_id: z.number().int(),
  customer_name: z.string(),
  service_name: z.string(),
  reservation_date: z.string(),
  status: z.string(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const reservationInsert = reservation.omit({ 
  id: true, 
  created_at: true, 
  updated_at: true 
});

export const ReservationModel = {
  tableName: "reservations",
  primaryKeys: ["id"],
  schema: reservation,
  serializer: (obj: object): object => {
    const record = obj as Record<string, unknown>;
    return {
      ...record,
    };
  },
  serializerSchema: reservation,
};
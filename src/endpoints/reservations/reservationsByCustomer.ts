import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { createDB, reservations } from '../../db';
import { reservation } from './base';
import { AppContext } from '../../types';

export class ReservationsByCustomer extends OpenAPIRoute {
  schema = {
    tags: ['Reservations'],
    summary: 'Get reservations by customer ID',
    request: {
      params: z.object({
        customerId: z.string().transform(val => parseInt(val)),
      }),
    },
    responses: {
      '200': {
        description: 'Reservations for the customer',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.array(reservation),
            }),
          },
        },
      },
      '404': {
        description: 'No reservations found for this customer',
      },
    },
  };

  async handle(c: AppContext) {
    const { params } = await this.getValidatedData<typeof this.schema>();
    const { customerId } = params;

    const db = createDB(c.env.DB);
    const result = await db.select().from(reservations).where(eq(reservations.customer_id, customerId));

    return {
      success: true,
      data: result,
    };
  }
}
import { OpenAPIRoute } from 'chanfana';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { createDB, reservations } from '../../db';
import { reservation } from './base';
import { AppContext } from '../../types';

export class ReservationsByDate extends OpenAPIRoute {
  schema = {
    tags: ['Reservations'],
    summary: 'Get reservations by date',
    request: {
      params: z.object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
      }),
    },
    responses: {
      '200': {
        description: 'Reservations for the specified date',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              data: z.array(reservation),
            }),
          },
        },
      },
      '400': {
        description: 'Invalid date format',
      },
    },
  };

  async handle(c: AppContext) {
    const { params } = await this.getValidatedData<typeof this.schema>();
    const { date } = params;

    const db = createDB(c.env.DB);
    const result = await db.select().from(reservations).where(eq(reservations.reservation_date, date));

    return {
      success: true,
      data: result,
    };
  }
}
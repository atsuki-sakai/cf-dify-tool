import { D1CreateEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { ReservationModel } from './base';

export class ReservationCreate extends D1CreateEndpoint<HandleArgs> {
  schema = {
    tags: ["Reservations"],
    summary: "Create reservation",
  };
  _meta = {
    model: ReservationModel,
    fields: ReservationModel.schema.pick({
      customer_id: true,
      customer_name: true,
      service_name: true,
      reservation_date: true,
    }).extend({
      status: ReservationModel.schema.shape.status.optional(),
      notes: ReservationModel.schema.shape.notes.optional(),
    }),
  };
}
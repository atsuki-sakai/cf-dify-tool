import { D1UpdateEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { ReservationModel } from './base';

export class ReservationUpdate extends D1UpdateEndpoint<HandleArgs> {
  _meta = {
    model: ReservationModel,
    fields: ReservationModel.schema.pick({
      customer_id: true,
      customer_name: true,
      service_name: true,
      reservation_date: true,
      status: true,
      notes: true,
    }),
  };
}
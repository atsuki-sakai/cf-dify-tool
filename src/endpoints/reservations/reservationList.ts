import { D1ListEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { ReservationModel } from './base';

export class ReservationList extends D1ListEndpoint<HandleArgs> {
  schema = {
    tags: ["Reservations"],
    summary: "List reservations",
  };
  _meta = {
    model: ReservationModel,
  };
}
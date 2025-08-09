import { D1DeleteEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerDelete extends D1DeleteEndpoint<HandleArgs> {
  schema = {
    tags: ["Customers"],
    summary: "Delete customer",
  };
  _meta = {
    model: CustomerModel,
  };
}
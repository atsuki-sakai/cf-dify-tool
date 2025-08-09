import { D1CreateEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerCreate extends D1CreateEndpoint<HandleArgs> {
  schema = {
    tags: ["Customers"],
    summary: "Create customer",
  };
  _meta = {
    model: CustomerModel,
    fields: CustomerModel.schema.pick({
      name: true,
      email: true,
      phone: true,
    }),
  };
}
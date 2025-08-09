import { D1UpdateEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerUpdate extends D1UpdateEndpoint<HandleArgs> {
  schema = {
    tags: ["Customers"],
    summary: "Update customer",
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
import { D1ListEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerList extends D1ListEndpoint<HandleArgs> {
  schema = {
    tags: ["Customers"],
    summary: "List customers",
  };
  _meta = {
    model: CustomerModel,
  };
}
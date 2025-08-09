import { D1ReadEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerRead extends D1ReadEndpoint<HandleArgs> {
  schema = {
    tags: ["Customers"],
    summary: "Read customer",
  };
  _meta = {
    model: CustomerModel,
  };
}
import { D1ReadEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerRead extends D1ReadEndpoint<HandleArgs> {
  _meta = {
    model: CustomerModel,
  };
}
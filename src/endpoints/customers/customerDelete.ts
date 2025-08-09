import { D1DeleteEndpoint } from 'chanfana';
import { HandleArgs } from '../../types';
import { CustomerModel } from './base';

export class CustomerDelete extends D1DeleteEndpoint<HandleArgs> {
  _meta = {
    model: CustomerModel,
  };
}
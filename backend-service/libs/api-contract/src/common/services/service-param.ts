import { ContextData } from '@libs/common/context';

export interface ServiceParam<T> {
  context: ContextData;
  data?: T;
}

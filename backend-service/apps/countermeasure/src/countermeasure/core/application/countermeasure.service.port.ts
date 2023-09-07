import { BaseServicePort } from '@libs/common/base';
import { Countermeasure } from '../domain/countermeasure';

export interface CountermeasureServicePort
  extends BaseServicePort<Countermeasure> {}

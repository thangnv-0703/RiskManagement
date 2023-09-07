import { BaseServicePort } from '@libs/common/base';
import { Cpe } from '../domain/cpe';

export interface CpeServicePort extends BaseServicePort<Cpe> {
  getCpeByKeyword: (keyword: string) => Promise<Cpe[]>;
}

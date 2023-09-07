import { BaseServicePort } from '@libs/common/base';
import { Cwe } from '../domain/cwe';

export interface CweServicePort extends BaseServicePort<Cwe> {
  getCwebyCweId(cweId: string): Promise<Cwe>;
}

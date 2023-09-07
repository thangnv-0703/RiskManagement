import { BaseRepositoryPort } from '@libs/common/base';
import { Cve } from './cve';

export interface CveRepositoryPort extends BaseRepositoryPort<Cve> {
  findCveByCpeName(cpeName: string): Promise<Cve[]>;
}

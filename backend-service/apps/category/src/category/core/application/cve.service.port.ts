import { BaseServicePort } from '@libs/common/base';
import { Cve } from '../domain/cve';

export interface CveServicePort extends BaseServicePort<Cve> {
  getCveByCpeName(cpeName: string): Promise<Cve[]>;
  getCvebyCveId(cveId: string): Promise<Cve>;
}

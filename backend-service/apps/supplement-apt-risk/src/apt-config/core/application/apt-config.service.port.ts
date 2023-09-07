import { BaseServicePort } from '@libs/common/base';
import { AptConfig } from '../domain/apt-config';

export interface AptConfigServicePort extends BaseServicePort<AptConfig> {
  getConfig(): Promise<AptConfig>;
  saveConfig(config: AptConfig): Promise<boolean>;
}

import { SystemProfile } from './system-profile';

export interface SystemProfilePublisherPort {
  publishSystemProfileUpdated(data: SystemProfile): void;
  publishSystemProfileDeleted(data: SystemProfile): void;
}

import { ContextData } from './context-data';

export interface IContextService {
  getContext(): ContextData;

  setContext(data: ContextData): void;
}

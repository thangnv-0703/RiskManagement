import { Injectable, Scope } from '@nestjs/common';
import { ContextData } from './context-data';
import { IContextService } from './context.service.interface';

@Injectable({ scope: Scope.REQUEST })
export class ContextService implements IContextService {
  getContext(): ContextData {
    return this.context;
  }
  setContext(data: ContextData): void {
    this.context = data;
  }
  private context: ContextData;
}

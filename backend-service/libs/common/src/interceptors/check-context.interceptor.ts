import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  NestInterceptor,
} from '@nestjs/common';
import { ServiceParam } from '@libs/api-contract';
import { CustomRpcException } from '@libs/common/exception-filters';
import { IContextService } from '@libs/common/context';
import { CONTEXT_SERVICE } from '../constant';

export class CheckContextInterceptor implements NestInterceptor {
  constructor(
    @Inject(CONTEXT_SERVICE)
    private contextService: IContextService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>) {
    const contextData = (context.getArgByIndex(0) as ServiceParam<any>)
      ?.context;
    if (!contextData) {
      throw new CustomRpcException({
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    this.contextService.setContext(contextData);
    return next.handle();
  }
}

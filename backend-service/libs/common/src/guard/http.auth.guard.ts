import { ContextData, IContextService } from '@libs/common/context';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { ACCOUNT_SERVICE, CONTEXT_SERVICE } from '../constant';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AccountPattern } from '@libs/api-contract';
import { CustomRpcException } from '../exception-filters';

class CurrentUser {
  id: string;
  email: string;
  role: string;
  active: string;
}

@Injectable()
export class HttpAuthGuard implements CanActivate {
  constructor(
    @Inject(ACCOUNT_SERVICE)
    private readonly client: ClientProxy,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: IContextService
  ) {}

  public async canActivate(ctx: ExecutionContext): Promise<boolean> | never {
    const request = ctx.switchToHttp().getRequest();
    const token: string = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await firstValueFrom(
      this.client.send<CurrentUser, string>(AccountPattern.CurrentUser, token)
    );

    if (!user) {
      throw new CustomRpcException({
        message: 'Unauthorized',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    request.user = user;
    const contextData: ContextData = {
      email: user.email,
      id: user.id,
      role: user.role,
      active: user.active,
    };
    this.contextService.setContext(contextData);

    return true;
  }
}

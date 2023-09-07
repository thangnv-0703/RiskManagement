import { ResponseBase } from '@libs/api-contract';
import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassContructor {
  new (...args: any[]): {};
}

export function Serialize(dto: ClassContructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassContructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data?.hasOwnProperty('data') && data?.hasOwnProperty('total')) {
          return new ResponseBase(
            serializeObject(this.dto, data.data),
            context.switchToHttp().getResponse().statusCode,
            data.total
          );
        }
        return new ResponseBase(
          serializeObject(this.dto, data),
          context.switchToHttp().getResponse().statusCode
        );
      })
    );
  }
}

export const serializeObject = (dto: ClassContructor, data: any) => {
  return plainToInstance(dto, data, {
    excludeExtraneousValues: true,
  });
};

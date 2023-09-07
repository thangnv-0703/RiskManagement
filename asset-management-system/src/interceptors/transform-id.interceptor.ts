import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          // If the response is an array, map over each item
          return data.map((item) => this.transformId(item));
        } else {
          // If the response is a single object, transform its _id field
          return this.transformId(data);
        }
      }),
    );
  }

  private transformId(data: any): any {
    if (data && data._id) {
      data.id = data._id.toString();
      delete data._id;
    }
    return data;
  }
}

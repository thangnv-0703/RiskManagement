import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const KEY_NOT_CONVERT = ['impact', 'condition', 'True', 'False'];

@Injectable()
export class CamelToSnakeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseData) => {
        return convertKeysToSnakeCase(responseData);
      })
    );
  }
}

export const convertKeysToSnakeCase = (data: any): any => {
  if (typeof data !== 'object' || data === null || data instanceof Date) {
    return data;
  } else if (Array.isArray(data)) {
    return data.map((item) => convertKeysToSnakeCase(item));
  }

  const convertedData = {};
  for (const key of Object.keys(data)) {
    if (KEY_NOT_CONVERT.includes(key)) {
      convertedData[key] = data[key];
    } else {
      const snakeCaseKey = camelToSnake(key);
      convertedData[snakeCaseKey] = convertKeysToSnakeCase(data[key]);
    }
  }
  return convertedData;
};

const camelToSnake = (key: string): string => {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const KEY_NOT_CONVERT = ['cve_id', 'cwe_id'];

@Injectable()
export class SnakeToCamelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Convert request parameters
    const params = convertKeysToCamelCase(request.params);
    Object.keys(params).forEach((key) => {
      request.params[key] = params[key];
    });

    // Convert query parameters
    const query = convertKeysToCamelCase(request.query);
    Object.keys(query).forEach((key) => {
      request.query[key] = query[key];
    });

    // Convert request body
    request.body = convertKeysToCamelCase(request.body);
    return next.handle();
  }
}

export const convertKeysToCamelCase = (data: any): any => {
  if (typeof data !== 'object' || data === null || data instanceof Date) {
    return data;
  } else if (Array.isArray(data)) {
    return data.map((item) => convertKeysToCamelCase(item));
  }

  const convertedData = {};
  for (const key of Object.keys(data)) {
    if (KEY_NOT_CONVERT.includes(key)) {
      convertedData[key] = data[key];
    } else {
      const camelCaseKey = snakeToCamel(key);
      convertedData[camelCaseKey] = convertKeysToCamelCase(data[key]);
    }
    const camelCaseKey = snakeToCamel(key);
    convertedData[camelCaseKey] = convertKeysToCamelCase(data[key]);
  }
  return convertedData;
};

export const snakeToCamel = (key: string): string => {
  return key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

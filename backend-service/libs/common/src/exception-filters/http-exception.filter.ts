import { ResponseBase } from '@libs/api-contract';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomRpcException } from './custom-rpc-exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly serviceName: string
  ) {}

  catch(exception: CustomRpcException, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    Logger.error(exception, this.serviceName);
    let responseBody: ResponseBase<null>;
    let httpStatus: HttpStatus;
    if (exception?.response) {
      httpStatus = exception.response?.['status']
        ? exception.response['status']
        : HttpStatus.BAD_REQUEST;

      responseBody = {
        status: httpStatus,
        data: null,
        success: false,
        errors: [exception.response?.['message']],
      };
    } else {
      httpStatus = !isNaN(exception?.status)
        ? exception.status
        : HttpStatus.INTERNAL_SERVER_ERROR;

      responseBody = {
        status: httpStatus,
        data: null,
        success: false,
        errors: [exception.message],
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}

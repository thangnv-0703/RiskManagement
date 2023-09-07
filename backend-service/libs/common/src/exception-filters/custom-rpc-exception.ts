import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

export interface IRpcException {
  message: string;
  status: HttpStatus;
}

export class CustomRpcException extends RpcException implements IRpcException {
  status: HttpStatus;
  response: object;
  constructor(err: IRpcException) {
    super(err);
    this.message = err.message;
    this.status = err.status;
  }
}

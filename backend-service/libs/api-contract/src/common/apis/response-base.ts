import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseBase<T> {
  @ApiProperty({
    example: 200,
    description: 'Http status code of response',
  })
  status: HttpStatus;

  @ApiProperty({
    example: 5312,
    description: 'Api is called success or not',
  })
  success: boolean;

  @ApiProperty({
    example: 5312,
    description: 'The returned data of the request',
  })
  data?: T;

  @ApiProperty({
    example: 5312,
    description: 'The returned message of the request',
  })
  message?: string;

  @ApiProperty({
    example: 5312,
    description: 'The returned message of the request',
  })
  errors?: string[];

  @ApiProperty({
    example: 5312,
    description: 'Total number of items if return list of data',
  })
  total?: number;

  constructor(
    data: T,
    status: HttpStatus = HttpStatus.OK,
    total: number = null,
    success: boolean = true,
    message: string = ''
  ) {
    this.data = data;
    this.status = status;
    this.success = success;
    if (message) {
      this.message = message;
    }
    if (total) {
      this.total = total;
    }
  }
}

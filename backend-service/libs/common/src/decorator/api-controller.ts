import { Controller, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function ApiController(endPoint: string, tagName: string) {
  return applyDecorators(
    ApiBearerAuth('authorization'),
    ApiTags(tagName),
    Controller(endPoint)
  );
}

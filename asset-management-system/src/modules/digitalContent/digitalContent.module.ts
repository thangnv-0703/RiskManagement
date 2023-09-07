import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DigitalContentSchema } from '../../models/schemas/digitalContent.schema';
import { DigitalContentToSourceCodeSchema } from '../../models/schemas/digitalContentToSourceCode.schema';
import { SourceCodeModule } from '../sourceCode/sourceCode.module';
import { DigitalContentController } from './digitalContent.controller';
import { DigitalContentService } from './digitalContent.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DigitalContent', schema: DigitalContentSchema },
      {
        name: 'DigitalContentToSourceCode',
        schema: DigitalContentToSourceCodeSchema,
      },
    ]),
    forwardRef(() => SourceCodeModule),
  ],
  controllers: [DigitalContentController],
  providers: [DigitalContentService],
  exports: [DigitalContentService],
})
export class DigitalContentModule {}

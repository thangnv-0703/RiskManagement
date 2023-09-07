import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeprecationSchema } from '../../models/schemas/deprecation.schema';
import { CategoryModule } from '../category/category.module';
import { DeprecationController } from './deprecation.controller';
import { DeprecationService } from './deprecation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Deprecation', schema: DeprecationSchema },
    ]),
    CategoryModule,
  ],
  controllers: [DeprecationController],
  providers: [DeprecationService],
  exports: [DeprecationService],
})
export class DeprecationModule {}

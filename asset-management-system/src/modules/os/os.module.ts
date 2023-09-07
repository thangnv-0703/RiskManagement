import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OSController } from './os.controller';
import { OSService } from './os.service';
import { OSSchema } from '../../models/schemas/os.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'OS', schema: OSSchema }])],
  controllers: [OSController],
  providers: [OSService],
  exports: [OSService],
})
export class OSModule {}

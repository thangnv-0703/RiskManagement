import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetSchema } from '../../models/schemas/asset.schema';
import { StatusSchema } from '../../models/schemas/status.schema';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Status', schema: StatusSchema },
      { name: 'Asset', schema: AssetSchema },
    ]),
  ],
  controllers: [StatusController],
  providers: [StatusService],
  exports: [StatusService],
})
export class StatusModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config.service';
import { SystemProfileModule } from './system-profile/system-profile.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    SystemProfileModule,
  ],
})
export class RootModule {}

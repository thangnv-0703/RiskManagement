import { Module } from '@nestjs/common';
import { AptConfigService } from './core/application/apt-config.service';
import { AptConfigRepository } from './infrastructure/repositories/apt-config.repository';
import { AptConfig, AptConfigSchema } from './core/domain/apt-config';
import { MongooseModule } from '@nestjs/mongoose';
import { AptConfigDIToken } from './api/di-token';
import { ContextService } from '@libs/common/context';
import { AptConfigController } from './api/apt-config.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AptConfig.name, schema: AptConfigSchema },
    ]),
    ClientsModule.register([RabbitmqConfig.accountQueue()]),
  ],
  controllers: [AptConfigController],
  providers: [
    {
      provide: AptConfigDIToken.AptConfigService,
      useClass: AptConfigService,
    },
    {
      provide: AptConfigDIToken.AptConfigRepository,
      useClass: AptConfigRepository,
    },
    {
      provide: AptConfigDIToken.ContextService,
      useClass: ContextService,
    },
  ],
})
export class AptConfigModule {}

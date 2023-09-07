import { Module } from '@nestjs/common';
import { CpeMessageHandler } from './api/cpe.message.handler';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryDIToken } from './api/di-token';
import { ContextService } from '@libs/common/context';
import { CpeService } from './core/application/cpe.service';
import { CpeRepository } from './infrastructure/repositories/cpe.repository';
import { CveService } from './core/application/cve.service';
import { CveRepository } from './infrastructure/repositories/cve.repository';
import { CweService } from './core/application/cwe.service';
import { CweRepository } from './infrastructure/repositories/cwe.repository';
import { Cpe, CpeSchema } from './core/domain/cpe';
import { Cve, CveSchema } from './core/domain/cve';
import { Cwe, CweSchema } from './core/domain/cwe';
import { CveMessageHandler } from './api/cve.message.handler';
import { CveController } from './api/cve.controller';
import { CweController } from './api/cwe.controller';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitmqConfig } from '../configs/rabbimq.config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cpe.name, schema: CpeSchema },
      { name: Cve.name, schema: CveSchema },
      { name: Cwe.name, schema: CweSchema },
    ]),
    ClientsModule.register([RabbitmqConfig.accountQueue()]),
  ],
  controllers: [
    CpeMessageHandler,
    CveMessageHandler,
    CveController,
    CweController,
  ],
  providers: [
    {
      provide: CategoryDIToken.CpeService,
      useClass: CpeService,
    },
    {
      provide: CategoryDIToken.CpeRepository,
      useClass: CpeRepository,
    },
    {
      provide: CategoryDIToken.CveService,
      useClass: CveService,
    },
    {
      provide: CategoryDIToken.CveRepository,
      useClass: CveRepository,
    },
    {
      provide: CategoryDIToken.CweService,
      useClass: CweService,
    },
    {
      provide: CategoryDIToken.CweRepository,
      useClass: CweRepository,
    },
    {
      provide: CategoryDIToken.ContextService,
      useClass: ContextService,
    },
  ],
})
export class CategoryModule {}

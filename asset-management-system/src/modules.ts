import { ConfigModule } from '@nestjs/config';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { BullModule } from '@nestjs/bull';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AssetModule } from './modules/asset/asset.module';
import { CategoryModule } from './modules/category/category.module';
import { AdminModule } from './modules/admin/admin.module';
import { ManufacturerModule } from './modules/manufacturer/manufacturer.module';
import { SupplierModule } from './modules/supplier/supplier.module';
import { StatusModule } from './modules/status/status.module';
import { LocationModule } from './modules/location/location.module';
import { DepartmentModule } from './modules/department/department.module';
import { LicenseModule } from './modules/license/license.module';
import { SourceCodeModule } from './modules/sourceCode/sourceCode.module';
import { DigitalContentModule } from './modules/digitalContent/digitalContent.module';
import { DeprecationModule } from './modules/deprecation/deprecation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './modules/notification/notification.module';
import { AssetMaintenanceModule } from './modules/assetMaintenance/assetMaintenance.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MailModule } from './modules/mail/mail.module';
import { ApplicationModule } from './modules/application/application.module';
import { OSModule } from './modules/os/os.module';
import { AssetDeploymentScenarioModule } from './modules/assetDeploymentScenario/assetDeploymentScenario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './configs/mongo.config.service';
import { AllAssetModule } from './modules/allAsset/allAsset.module';

export const Modules = [
  ConfigModule.forRoot({
    // envFilePath: '.env',
    isGlobal: true,
  }),

  MongooseModule.forRootAsync({
    useClass: MongooseConfigService,
  }),
  ScheduleModule.forRoot(),
  // AuthModule,
  AdminModule,
  UsersModule,
  AssetModule,
  AssetMaintenanceModule,
  CategoryModule,
  ManufacturerModule,
  SupplierModule,
  StatusModule,
  LocationModule,
  DepartmentModule,
  LicenseModule,
  SourceCodeModule,
  DigitalContentModule,
  DeprecationModule,
  NotificationModule,
  InventoryModule,
  MailModule,
  ApplicationModule,
  OSModule,
  AssetDeploymentScenarioModule,
  AllAssetModule,
];

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Application,
  ApplicationSchema,
} from '../../models/schemas/application.schema';
import { AllAssetService } from './allAsset.service';
import { AllAssetController } from './allAsset.controller';
import { License, LicenseSchema } from 'src/models/schemas/license.schema';
import { SourceCode } from 'eslint';
import { OS, OSSchema } from 'src/models/schemas/os.schema';
import { Asset, AssetSchema } from 'src/models/schemas/asset.schema';
import {
  DigitalContent,
  DigitalContentSchema,
} from 'src/models/schemas/digitalContent.schema';
import { SourceCodeSchema } from 'src/models/schemas/sourceCode.schema';
import { AllAssetMessageHandler } from './allAsset.message.handler';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: License.name, schema: LicenseSchema },
      { name: SourceCode.name, schema: SourceCodeSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: OS.name, schema: OSSchema },
      { name: Asset.name, schema: AssetSchema },
      { name: DigitalContent.name, schema: DigitalContentSchema },
    ]),
  ],
  controllers: [AllAssetController, AllAssetMessageHandler],
  providers: [AllAssetService],
})
export class AllAssetModule {}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SourceCode } from '../../models/schemas/sourceCode.schema';
import { Model } from 'mongoose';
import { Application } from '../../models/schemas/application.schema';
import { Asset } from '../../models/schemas/asset.schema';
import { OS } from '../../models/schemas/os.schema';
import { DigitalContent } from '../../models/schemas/digitalContent.schema';
import { License } from '../../models/schemas/license.schema';

@Injectable()
export class AllAssetService {
  constructor(
    @InjectModel(SourceCode.name)
    private readonly sourceCodeModel: Model<SourceCode>,
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
    @InjectModel(Asset.name)
    private readonly assetModel: Model<Asset>,
    @InjectModel(OS.name)
    private readonly osModel: Model<OS>,
    @InjectModel(DigitalContent.name)
    private readonly digitalContentModel: Model<DigitalContent>,
    @InjectModel(License.name)
    private readonly licenseModel: Model<License>,
  ) {}

  async getAllAsset(): Promise<any> {
    const applications = await this.applicationModel.find().exec();
    const assets = await this.assetModel.find().exec();
    const oses = await this.osModel.find().exec();
    const digitalContents = await this.digitalContentModel.find().exec();
    const licenses = await this.licenseModel.find().exec();
    const sourceCodes = await this.sourceCodeModel.find().exec();

    const allAsset = [
      ...applications.map((app) => ({
        id: app.id,
        name: app.name,
        part: 'a',
      })),
      ...digitalContents.map((digitalContent) => ({
        id: digitalContent.id,
        name: digitalContent.name,
        part: 'a',
      })),
      ...licenses.map((license) => ({
        id: license.id,
        name: license.name,
        part: 'a',
      })),
      ...sourceCodes.map((sourceCode) => ({
        id: sourceCode.id,
        name: sourceCode.name,
        part: 'a',
      })),
      ...assets.map((asset) => ({
        id: asset.id,
        name: asset.name,
        part: 'h',
      })),
      ...oses.map((os) => ({
        id: os.id,
        name: os.name,
        part: 'o',
      })),
    ];
    return {
      data: allAsset,
      total: allAsset.length,
    };
  }
}

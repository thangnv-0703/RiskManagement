import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DigitalContent } from '../../models/schemas/digitalContent.schema';
import { DigitalContentToSourceCode } from '../../models/schemas/digitalContentToSourceCode.schema';
import { SourceCodeService } from '../sourceCode/sourceCode.service';
import { CheckinDigitalContentDto } from './dtos/checkinDigitalContent.dto';
import { CheckoutDigitalContentDto } from './dtos/checkoutDigitalContent.dto';
import { DigitalContentDto } from './dtos/digitalContent.dto';
import { DigitalContentToSourceCodeQueryDto } from './dtos/digitalContentToSourceCode.dto';

@Injectable()
export class DigitalContentService {
  private logger = new Logger(DigitalContentService.name);

  constructor(
    @InjectModel(DigitalContent.name)
    private digitalContentModel: Model<DigitalContent>,
    @InjectModel(DigitalContentToSourceCode.name)
    private digitalContentToSourceCodeModel: Model<DigitalContentToSourceCode>,
    private sourceCodeService: SourceCodeService,
  ) {}

  async getAllDigitalContents() {
    const digitalContents = await this.digitalContentModel.find({
      deletedAt: null,
    });
    const res = digitalContents.map((digitalContent) =>
      digitalContent.toObject(),
    );
    return res;
  }

  async getDigitalContentById(id: string) {
    const digitalContent = await this.digitalContentModel.findOne({
      _id: id,
      deletedAt: null,
    });
    return digitalContent.toObject();
  }

  async getDigitalContentToSourceCode(
    digitalContentToSourceCodeDto?: DigitalContentToSourceCodeQueryDto,
  ): Promise<any> {
    // Find withDeleted = true
    const digitalContentToSourceCodes =
      await this.digitalContentToSourceCodeModel
        .find({
          ...(digitalContentToSourceCodeDto.sourceCodeId && {
            sourceCode: { _id: digitalContentToSourceCodeDto.sourceCodeId },
          }),
          ...(digitalContentToSourceCodeDto.digitalContentId && {
            digitalContent: {
              _id: digitalContentToSourceCodeDto.digitalContentId,
            },
          }),
        })
        .populate('sourceCode')
        .populate('digitalContent');
    const res = digitalContentToSourceCodes.map(
      (digitalContentToSourceCode) => {
        const { sourceCode, digitalContent, ...rest } =
          digitalContentToSourceCode.toObject();
        return {
          ...rest,
          sourceCodeId: sourceCode?._id,
          sourceCodeName: sourceCode?.name,
          digitalContentId: digitalContent?._id,
          digitalContentName: digitalContent?.name,
        };
      },
    );
    return res;
  }

  async createNewDigitalContent(digitalContentDto: DigitalContentDto) {
    const digitalContent = new this.digitalContentModel(digitalContentDto);
    return await digitalContent.save();
  }

  async updateDigitalContent(id: string, digitalContentDto: DigitalContentDto) {
    const updated = await this.digitalContentModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      digitalContentDto,
    );
    return updated;
  }

  async deleteDigitalContent(id: string) {
    const toRemove = await this.digitalContentModel
      .findById(id)
      .populate('digitalContentToSourceCodes');
    if (toRemove) {
      toRemove.deletedAt = new Date(Date.now());
      await toRemove.save();
    }
    return toRemove;
  }

  /*------------------------ checkin/checkout sourceCode ------------------------- */

  async checkoutDigitalContent(
    checkoutDigitalContentDto: CheckoutDigitalContentDto,
  ) {
    if (
      await this.digitalContentToSourceCodeModel.findOne({
        digitalContent: { _id: checkoutDigitalContentDto.digitalContentId },
        sourceCode: { _id: checkoutDigitalContentDto.sourceCodeId },
      })
    )
      throw new HttpException(
        'This source code is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const digitalContent = await this.digitalContentModel.findOne({
      _id: checkoutDigitalContentDto.digitalContentId,
      deletedAt: null,
    });
    const sourceCode = await this.sourceCodeService.getSourceCodeById(
      checkoutDigitalContentDto.sourceCodeId,
    );
    const digitalContentToSourceCode =
      new this.digitalContentToSourceCodeModel();
    digitalContentToSourceCode.digitalContent = digitalContent;
    digitalContentToSourceCode.sourceCode = sourceCode;
    digitalContentToSourceCode.checkout_date =
      checkoutDigitalContentDto.checkout_date;
    digitalContentToSourceCode.checkout_note =
      checkoutDigitalContentDto.checkout_note;
    await digitalContentToSourceCode.save();
    return digitalContentToSourceCode;
  }

  async checkinDigitalContent(
    checkinDigitalContentDto: CheckinDigitalContentDto,
  ) {
    const digitalContentToSourceCode =
      await this.digitalContentToSourceCodeModel.findOne({
        _id: checkinDigitalContentDto.digitalContentToSourceCodeId,
        deletedAt: null,
      });
    digitalContentToSourceCode.checkin_date =
      checkinDigitalContentDto.checkin_date;
    digitalContentToSourceCode.checkin_note =
      checkinDigitalContentDto.checkin_note;
    digitalContentToSourceCode.deletedAt = new Date(Date.now());
    await digitalContentToSourceCode.save();
    return digitalContentToSourceCode;
  }
}

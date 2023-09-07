import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SourceCode } from '../../models/schemas/sourceCode.schema';
import { SourceCodeToUser } from '../../models/schemas/sourceCodeToUser.schema';
import { UsersService } from '../users/users.service';
import { CheckinSourceCodeDto } from './dtos/checkinSourceCode.dto';
import { CheckoutSourceCodeDto } from './dtos/checkoutSourceCode.dto';
import { SourceCodeDto } from './dtos/sourceCode.dto';
import { SourceCodeToUserQueryDto } from './dtos/sourceCodeToUser.dto';

@Injectable()
export class SourceCodeService {
  private logger = new Logger(SourceCodeService.name);

  constructor(
    @InjectModel(SourceCode.name)
    private readonly sourceCodeModel: Model<SourceCode>,
    @InjectModel(SourceCodeToUser.name)
    private readonly sourceCodeToUserModel: Model<SourceCodeToUser>,
    private userService: UsersService,
  ) {}

  async getAllSourceCodes() {
    const sourceCodes = await this.sourceCodeModel.find({ deletedAt: null });
    const res = sourceCodes.map((sourceCode) => {
      return sourceCode.toObject();
    });
    return res;
  }

  async getSourceCodeById(id: string) {
    const sourceCode = await this.sourceCodeModel.findOne({
      _id: id,
      deletedAt: null,
    });
    return sourceCode.toObject();
  }

  async getSourceCodeToUser(
    sourceCodeToUserQueryDto?: SourceCodeToUserQueryDto,
  ): Promise<any> {
    const sourceCodeToUsers = await this.sourceCodeToUserModel
      .find({
        ...(sourceCodeToUserQueryDto.userId && {
          user: { _id: sourceCodeToUserQueryDto.userId },
        }),
        ...(sourceCodeToUserQueryDto.sourceCodeId && {
          sourceCode: { _id: sourceCodeToUserQueryDto.sourceCodeId },
        }),
      })
      .populate('user')
      .populate('sourceCode');
    const res = sourceCodeToUsers.map((sourceCodeToUser) => {
      const { sourceCode, user, ...rest } = sourceCodeToUser.toObject();
      return {
        ...rest,
        sourceCodeId: sourceCode?._id,
        sourceCodeName: sourceCode?.name,
        userId: user?._id,
        userName: user?.name,
      };
    });
    return res;
  }

  async createNewSourceCode(sourceCodeDto: SourceCodeDto) {
    const sourceCode = Object.assign({}, sourceCodeDto);
    await this.sourceCodeModel.create(sourceCode);
    return sourceCode;
  }

  async updateSourceCode(id: string, sourceCodeDto: SourceCodeDto) {
    const updated = await this.sourceCodeModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      sourceCodeDto,
    );
    return updated;
  }

  async deleteSourceCode(id: string) {
    const toRemove = await this.sourceCodeModel.findOne({
      _id: id,
      deletedAt: null,
    });
    if (toRemove) {
      toRemove.deletedAt = new Date(Date.now());
      await toRemove.save();
    }
    return toRemove;
  }

  /*------------------------ checkin/checkout sourceCode ------------------------- */

  async checkoutSourceCode(checkoutSourceCodeDto: CheckoutSourceCodeDto) {
    if (
      await this.sourceCodeToUserModel.findOne({
        sourceCode: { _id: checkoutSourceCodeDto.sourceCodeId },
        user: { _id: checkoutSourceCodeDto.userId },
      })
    )
      throw new HttpException(
        'This user is already checkout',
        HttpStatus.BAD_REQUEST,
      );
    const sourceCode = await this.sourceCodeModel.findOne({
      _id: checkoutSourceCodeDto.sourceCodeId,
      deletedAt: null,
    });
    const user = await this.userService.getUserById(
      checkoutSourceCodeDto.userId,
    );
    const sourceCodeToUser = new this.sourceCodeToUserModel();
    sourceCodeToUser.user = user;
    sourceCodeToUser.sourceCode = sourceCode;
    sourceCodeToUser.start_date = checkoutSourceCodeDto.start_date;
    sourceCodeToUser.start_note = checkoutSourceCodeDto.start_note;
    await sourceCodeToUser.save();
    return sourceCodeToUser;
  }

  async checkinSourceCode(checkinSourceCodeDto: CheckinSourceCodeDto) {
    const sourceCodeToUser = await this.sourceCodeToUserModel.findOne({
      _id: checkinSourceCodeDto.sourceCodeToUserId,
      deletedAt: null,
    });
    sourceCodeToUser.end_date = checkinSourceCodeDto.end_date;
    sourceCodeToUser.end_note = checkinSourceCodeDto.end_note;
    sourceCodeToUser.deletedAt = new Date(Date.now());
    await sourceCodeToUser.save();
    return sourceCodeToUser;
  }
}

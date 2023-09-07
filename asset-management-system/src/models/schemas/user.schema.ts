import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from 'src/modules/admin/admin.constants';
import { Department } from './department.schema';
import { AssetToUser } from './assetToUser.schema';
import { RequestAsset } from './requestAsset..schema';
import { SourceCodeToUser } from './sourceCodeToUser.schema';

@Schema()
export class User extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ unique: true })
  username: string;

  @Prop({})
  @Exclude()
  password: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  email: string;

  @Prop({ default: null })
  birthday: Date;

  @Prop({ default: DEFAULT_AVATAR })
  avatar: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: null })
  deletedAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AssetToUser' }],
  })
  assetToUsers: AssetToUser[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'SourceCodeToUser' }],
  })
  sourceCodeToUsers: SourceCodeToUser[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'RequestAsset' }],
  })
  requestAssets: RequestAsset[];
}

export const UserSchema = SchemaFactory.createForClass(User);

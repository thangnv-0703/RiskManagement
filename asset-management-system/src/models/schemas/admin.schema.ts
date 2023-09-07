import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';
import { DEFAULT_AVATAR } from '../../modules/users/user.constants';

@Schema()
export class Admin extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ default: null })
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: DEFAULT_AVATAR })
  avatar: string;

  @Prop({ default: 'admin' })
  role: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

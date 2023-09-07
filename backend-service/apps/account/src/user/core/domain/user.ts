import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
}

@Schema()
export class User extends BaseDocument {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
  })
  role: string;

  @Prop({ type: Boolean })
  active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User).add(
  sharedSchema()
);

import { Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class BaseDocument extends Document {
  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ type: String })
  createdBy: string;

  @Prop({ type: String })
  updatedBy: string;
}

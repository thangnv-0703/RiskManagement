import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop({ default: null })
  itemId: string;

  @Prop({ default: null })
  expiration_date: Date;

  @Prop({ default: 'Asset' })
  type: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

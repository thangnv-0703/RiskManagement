import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Department } from './department.schema';

@Schema()
export class Location extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null })
  address: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Department' }],
  })
  departments: Department[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);

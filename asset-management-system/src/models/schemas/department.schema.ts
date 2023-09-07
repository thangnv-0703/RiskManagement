import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Location } from './location.schema';
import { Asset } from './asset.schema';
import { Inventory } from './inventory.schema';
import { User } from './user.schema';

@Schema()
export class Department extends Document {
  @Prop({ default: null })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  location: Location;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Asset' }],
  })
  assets: Asset[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Inventory' }],
  })
  inventories: Inventory[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
  })
  users: User[];
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);

import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { CIALevel } from '../enums';

@Schema()
export class SecurityGoal {
  @Prop({ type: Number })
  id: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  assetId: string;

  @Prop({
    type: String,
    enum: CIALevel,
  })
  confidentiality: string;

  @Prop({
    type: String,
    enum: CIALevel,
  })
  integrity: string;

  @Prop({
    type: String,
    enum: CIALevel,
  })
  availability: string;
}

export const SecurityGoalSchema = SchemaFactory.createForClass(SecurityGoal);

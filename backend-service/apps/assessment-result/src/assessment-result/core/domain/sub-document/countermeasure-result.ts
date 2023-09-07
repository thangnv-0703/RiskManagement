import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema()
export class CountermeasureResult {
  @Prop({ type: Number })
  id: number;

  @Prop({ type: Number })
  cost: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String, default: 'NODE_DECISION' })
  type: string;

  @Prop(raw({ True: { type: Number }, False: { type: Number } }))
  outcomes: Record<string, number>;
}
export const CountermeasureResultSchema =
  SchemaFactory.createForClass(CountermeasureResult);

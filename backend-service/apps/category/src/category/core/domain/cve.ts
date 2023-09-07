import { BaseDocument } from '@libs/common/base';
import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Cve extends BaseDocument {
  @Prop({ type: String, index: true })
  cve_id: string;

  @Prop({ type: String })
  cwe_id: string;

  @Prop({ type: Array })
  configurations: any[];

  @Prop({ type: String })
  description: string;

  @Prop({ type: Object })
  impact: object;

  @Prop({ type: String })
  publishedDate: string;

  @Prop({ type: String })
  lastModifiedDate: string;

  @Prop({ type: String })
  attackVector: string;

  @Prop({ type: Object })
  condition: object;

  @Prop({ type: Array, index: true })
  cpe: any[];
}

export const CveSchema = SchemaFactory.createForClass(Cve).add(sharedSchema());

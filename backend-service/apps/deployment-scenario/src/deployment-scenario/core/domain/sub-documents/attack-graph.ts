import { sharedSchema } from '@libs/common/mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Node {
  @Prop({ type: String })
  id: string;

  @Prop({ type: Number })
  x?: number;

  @Prop({ type: Number })
  y?: number;

  @Prop({ type: String })
  label: string;

  @Prop({ type: String })
  type?: string;

  @Prop({ type: String })
  shape: string;

  @Prop({ type: Boolean })
  isAttacker?: boolean;

  @Prop({ type: Boolean })
  isAsset?: boolean;

  @Prop({ type: String })
  attackerId?: string;

  @Prop({ type: String })
  assetId?: string;

  @Prop({ type: String })
  cveId?: string;

  @Prop({ type: String })
  color: string;

  @Prop({ type: Number })
  index?: number;

  @Prop({ type: [Number] })
  phase: number[];
}

export const NodeSchema = SchemaFactory.createForClass(Node);

@Schema()
export class Edge {
  @Prop({ type: String })
  id: string;

  @Prop({ type: String })
  source: string;

  @Prop({ type: String })
  target: string;

  @Prop({ type: Number })
  index?: number;

  @Prop({ type: [Number] })
  phase: number[];
}
export const EdgeSchema = SchemaFactory.createForClass(Edge);

@Schema()
export class AttackGraph {
  @Prop({ type: [NodeSchema], _id: false })
  nodes: Node[];

  @Prop({ type: [EdgeSchema], _id: false })
  edges: Edge[];
}
export const AttackGraphSchema = SchemaFactory.createForClass(AttackGraph).add(
  sharedSchema(false)
);

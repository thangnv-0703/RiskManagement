import { Expose, Type } from 'class-transformer';

export class NodeDto {
  @Expose()
  id: string;

  @Expose()
  x?: number;

  @Expose()
  y?: number;

  @Expose()
  label: string;

  @Expose()
  type?: string;

  @Expose()
  shape: string;

  @Expose()
  isAttacker?: boolean;

  @Expose()
  isAsset?: boolean;

  @Expose()
  attackerId?: string;

  @Expose()
  assetId?: string;

  @Expose()
  cveId?: string;

  @Expose()
  color: string;

  @Expose()
  index?: number;

  @Expose()
  phase: number[];
}

export class EdgeDto {
  @Expose()
  id: string;

  @Expose()
  source: string;

  @Expose()
  target: string;

  @Expose()
  index?: number;

  @Expose()
  phase: number[];
}

export class AttackGraphDto {
  @Expose()
  @Type(() => NodeDto)
  nodes: NodeDto[];

  @Expose()
  @Type(() => EdgeDto)
  edges: EdgeDto[];
}

import { AttackGraph } from '../../core/domain/sub-documents';

export class GenerateCoordinatesDto {
  graph: AttackGraph;
  nodesep?: number;
  ranksep?: number;
}

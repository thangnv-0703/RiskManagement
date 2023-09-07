export class Edge {
  id?: string;

  source: string;

  target: string;

  index?: number;

  phase?: number[];

  constructor(source: string, target: string, phaseNumber: number) {
    this.source = source;
    this.target = target;
    this.phase = [phaseNumber];
  }

  isEqual(edge: Edge): boolean {
    return this.source === edge.source && this.target === edge.target;
  }
}

export class Node {
  name?: string;

  phase?: number[];

  constructor(name: string, phaseNumber: number) {
    this.name = name;
    this.phase = [phaseNumber];
  }

  isEqual(node: Node): boolean {
    return this.name === node.name;
  }
}

export class Graph {
  nodes: Node[];

  edges: Edge[];
}

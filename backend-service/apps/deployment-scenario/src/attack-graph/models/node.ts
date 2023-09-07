import { AttackVector } from './attack-vector';
import { Privilege } from './privilege';
import { Vulnerability } from './vulnerability';

class AGNode {
  name: string;
  id: string;
  reachableNodes: {
    node: AGNode;
    privilege: Privilege;
    attackVector: AttackVector;
  }[];

  constructor(name: string) {
    this.name = name;
    this.reachableNodes = [];
  }

  addReachableNode(
    node: AGNode,
    privilege: Privilege,
    attackVector: AttackVector
  ) {
    this.reachableNodes.push({
      node: node,
      privilege: privilege,
      attackVector: attackVector,
    });
  }
}

export class AssetNode extends AGNode {
  vulnerabilities: Vulnerability[];

  constructor(name: string) {
    super(name);
    this.vulnerabilities = [];
  }

  addVulnerability(vulnerability: Vulnerability) {
    this.vulnerabilities.push(vulnerability);
  }

  setVulnerabilities(vulnerabilities: Vulnerability[]) {
    this.vulnerabilities = vulnerabilities;
    this.vulnerabilities.sort((a, b) => {
      return (
        a.attackVector - b.attackVector ||
        a.preCondition - b.preCondition ||
        a.postCondition - b.postCondition
      );
    });
  }
}

export class AttackerNode extends AGNode {
  privilege: Privilege;
  attackVector: AttackVector;

  constructor(name: string) {
    super(name);
  }
}

import { DeploymentScenario } from '../deployment-scenario/core/domain/documents';
import { AttackGraph } from '../deployment-scenario/core/domain/sub-documents';
import { Edge, Graph, Node } from './models/graph';
import { AttackVector, ConvertAttackVectors } from './models/attack-vector';
import { AssetNode, AttackerNode } from './models/node';
import { ConvertPrivileges, Privilege } from './models/privilege';
import { Vulnerability } from './models/vulnerability';
import { graphlib, layout } from 'dagre';
import * as lodash from 'lodash';

const APT_PHASE_NUMBER = 4;

export class GraphService {
  private static probeAsset(
    graph: Graph,
    attacker: AttackerNode,
    asset: AssetNode,
    vuls: Vulnerability[],
    phase: number
  ): [AssetNode | null, Privilege | null, AttackVector | null] {
    const tmpVuls = [...vuls];
    let isNewAttacker = false;
    let attackerPrivilege: Privilege | null = attacker.privilege;

    while (tmpVuls.length !== 0) {
      const vul = tmpVuls.shift();
      const isCheckPrivilege =
        phase === 2 && !attacker.name.startsWith('Asset_');
      if (
        !this.checkPrivilege(phase, isCheckPrivilege) ||
        (attacker.attackVector >= vul.attackVector &&
          (vul.preCondition === Privilege.NONE ||
            attacker.privilege >= vul.preCondition))
      ) {
        isNewAttacker = true;
        const source = attacker.name;
        const target = `Asset_${asset.name}_${asset.id}`;
        const exploitedVul = `Vul_${vul.name}_${asset.id}`;

        let expolitedVulEdge = graph.edges.find(
          (edge) => edge.source === source && edge.target === exploitedVul
        );
        if (expolitedVulEdge) {
          if (!expolitedVulEdge.phase.includes(phase)) {
            expolitedVulEdge.phase.push(phase);
          }
        } else {
          expolitedVulEdge = new Edge(source, exploitedVul, phase);
          graph.edges.push(expolitedVulEdge);
        }

        let achieveGoalEdge = graph.edges.find(
          (edge) => edge.source === exploitedVul && edge.target === target
        );
        if (achieveGoalEdge) {
          if (!achieveGoalEdge.phase.includes(phase)) {
            achieveGoalEdge.phase.push(phase);
          }
        } else {
          achieveGoalEdge = new Edge(exploitedVul, target, phase);
          graph.edges.push(achieveGoalEdge);
        }

        let sourceNode = graph.nodes.find((node) => node.name === source);
        if (sourceNode) {
          if (!sourceNode.phase.includes(phase)) {
            sourceNode.phase.push(phase);
          }
        } else {
          sourceNode = new Node(source, phase);
          graph.nodes.push(sourceNode);
        }

        let targeNode = graph.nodes.find((node) => node.name === target);
        if (targeNode) {
          if (!targeNode.phase.includes(phase)) {
            targeNode.phase.push(phase);
          }
        } else {
          targeNode = new Node(target, phase);
          graph.nodes.push(targeNode);
        }

        let vulNode = graph.nodes.find((node) => node.name === exploitedVul);
        if (vulNode) {
          if (!vulNode.phase.includes(phase)) {
            vulNode.phase.push(phase);
          }
        } else {
          vulNode = new Node(exploitedVul, phase);
          graph.nodes.push(vulNode);
        }

        if (
          attackerPrivilege === null ||
          vul.postCondition > attackerPrivilege
        ) {
          attackerPrivilege = vul.postCondition;
        }
      }
    }

    if (isNewAttacker) {
      return [asset, attackerPrivilege, attacker.attackVector];
    }

    return [null, null, null];
  }

  public static generateAttackGraph(
    deploymentScenario: DeploymentScenario
  ): Graph {
    function findAssetName(
      deploymentScenario: DeploymentScenario,
      assetId: string
    ): string | null {
      for (const asset of deploymentScenario.assets) {
        if (asset.id === assetId) {
          return asset.name;
        }
      }
      return null;
    }

    const graph: Graph = {
      edges: [],
      nodes: [],
    };

    const assets: Record<string, AssetNode> = {};
    const attackers: AttackerNode[] = [];
    const attackerPhaseOne: AttackerNode[] = [];

    for (const asset of deploymentScenario.cves) {
      const assetName = findAssetName(deploymentScenario, asset.assetId);
      const tmpAsset = new AssetNode(assetName);
      tmpAsset.id = asset.assetId;
      const vuls: Vulnerability[] = [];

      for (const cve of asset.cves) {
        if (asset.active.includes(cve.cve_id)) {
          const vul = new Vulnerability(
            cve.cve_id,
            ConvertPrivileges[cve.condition['preCondition']] || Privilege.NONE,
            ConvertPrivileges[cve.condition['postCondition']] || Privilege.NONE,
            ConvertAttackVectors[cve['attackVector']] || AttackVector.NONE
          );
          vuls.push(vul);
        }
      }

      tmpAsset.setVulnerabilities(vuls);
      assets[asset.assetId] = tmpAsset;
    }

    for (const relationship of deploymentScenario.assetRelationships) {
      const source = assets[relationship.source];
      const target = assets[relationship.target];
      const accessVector =
        ConvertAttackVectors[relationship.accessVector] || AttackVector.NONE;
      const privilege =
        ConvertPrivileges[relationship.privilege] || Privilege.NONE;

      source.addReachableNode(target, privilege, accessVector);
    }

    for (const attacker of deploymentScenario.attackers) {
      const tmpAttacker = new AttackerNode(attacker.name);

      for (const target of attacker.targets) {
        const targetAsset = assets[target.assetId];
        const privilege = ConvertPrivileges[target.privilege] || Privilege.NONE;
        const attackVector =
          ConvertAttackVectors[target.attackVector] || AttackVector.NONE;

        tmpAttacker.addReachableNode(targetAsset, privilege, attackVector);
      }

      attackers.push(tmpAttacker);

      const tmpAttackerPhaseOne = new AttackerNode(attacker.name);
      for (const asset in assets) {
        const targetAsset = assets[asset];
        const privilege = Privilege.NONE;
        const attackVector = AttackVector.NONE;
        tmpAttackerPhaseOne.addReachableNode(
          targetAsset,
          privilege,
          attackVector
        );
      }

      attackerPhaseOne.push(tmpAttackerPhaseOne);
    }

    // return this.generateFullGraph(graph, assets, attackers);
    for (let phaseNumber = 1; phaseNumber < APT_PHASE_NUMBER; phaseNumber++) {
      let attackersTmp: AttackerNode[] = [];
      if (phaseNumber === 1) {
        attackersTmp = lodash.cloneDeep(attackerPhaseOne);
      } else {
        attackersTmp = lodash.cloneDeep(attackers);
      }

      while (attackersTmp.length !== 0) {
        const attacker = attackersTmp.shift()!;
        for (const tmpNode of attacker.reachableNodes) {
          const asset = tmpNode.node as AssetNode;
          if (!attacker.privilege || isNaN(attacker.privilege)) {
            attacker.privilege = tmpNode.privilege;
          }
          if (!attacker.attackVector || isNaN(attacker.attackVector)) {
            attacker.attackVector = tmpNode.attackVector;
          }

          const [newAssetAttack, newPriv, newAV] = GraphService.probeAsset(
            graph,
            attacker,
            asset,
            asset.vulnerabilities,
            phaseNumber
          );

          if (newPriv) {
            const newAttacker = new AttackerNode(
              `Asset_${newAssetAttack.name}_${newAssetAttack.id}`
            );
            newAttacker.privilege = newPriv;
            newAttacker.attackVector = newAV;
            newAttacker.reachableNodes = [];

            for (const tmpReachableNode of newAssetAttack.reachableNodes) {
              if (
                (tmpReachableNode.privilege <= newPriv &&
                  tmpReachableNode.attackVector <= newAV) ||
                !this.checkPrivilege(phaseNumber)
              ) {
                newAttacker.reachableNodes.push(tmpReachableNode);
              }
            }

            attackersTmp.push(newAttacker);
          }
        }
      }
    }

    return graph;
  }

  static formatAttackGraph(
    graph: Graph,
    deploymentScenario: DeploymentScenario
  ): AttackGraph {
    const attackers = deploymentScenario.attackers.map(
      (attacker) => attacker.name
    );
    const results: AttackGraph = {
      nodes: [],
      edges: [],
    };
    let index = 0;

    for (const node of graph.nodes) {
      if (attackers.includes(node.name)) {
        let attackerId = '';
        for (const attacker of deploymentScenario.attackers) {
          if (attacker.name === node.name) {
            attackerId = attacker.id;
            break;
          }
        }
        const label = node.name;
        const style = {
          type: 'node',
          shape: 'flow-circle',
          isAttacker: true,
          color: '#FA8C16',
          attackerId: attackerId,
          isAsset: false,
          isCve: false,
        };

        results.nodes.push({
          id: `${index}`,
          label: label,
          phase: node.phase,
          ...style,
        });
      } else {
        const tmp = node.name.split('_');
        const typeNode = tmp[0];
        const label = tmp[1];
        let style: any = {
          type: 'node',
          isAttacker: false,
          assetId: tmp[2],
        };

        if (typeNode === 'Vul') {
          style = {
            ...style,
            shape: 'flow-capsule',
            color: '#722ED1',
            isAsset: false,
            isCve: true,
            cveId: label,
          };
        } else {
          style = {
            ...style,
            shape: 'flow-rect',
            color: '#1890FF',
            isAsset: true,
            isCve: false,
            assetName: label,
          };
        }

        results.nodes.push({
          id: `${index}`,
          label: label,
          phase: node.phase,
          ...style,
        });
      }

      index++;
    }

    for (const edge of graph.edges) {
      results.edges.push({
        id: `${index}`,
        phase: edge.phase,
        source: `${graph.nodes.findIndex((node) => node.name === edge.source)}`,
        target: `${graph.nodes.findIndex((node) => node.name === edge.target)}`,
      });

      index++;
    }

    return results;
  }

  private static checkPrivilege(
    phaseNumber: number,
    isCheckPrivilege: boolean = false
  ): boolean {
    let result = true;
    switch (phaseNumber) {
      case 1:
        result = false;
        break;
      case 2:
        result = isCheckPrivilege;
        break;
      case 3:
        result = true;
        break;
      default:
        result = true;
    }
    return result;
  }

  static generateCoordinates(
    gph: AttackGraph,
    nodesep = 120,
    ranksep = 120
  ): AttackGraph {
    const g = new graphlib.Graph();
    const rankdir = 'LR';
    g.setGraph({ rankdir, nodesep, ranksep });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    for (const node of gph.nodes) {
      const width = Math.max(node.label.length, 20);
      g.setNode(node.id.toString(), {
        label: node.label,
        ...node,
        width: width,
        height: 10,
      });
    }

    // Add edges
    for (const edge of gph.edges) {
      g.setEdge(edge.source, edge.target);
    }

    // Perform layout
    layout(g);

    // Retrieve node positions
    const nodes = [];
    g.nodes().forEach((nodeId) => {
      const node = g.node(nodeId);
      nodes.push({ x: node.x, y: node.y, ...node });
    });

    return {
      nodes,
      edges: gph.edges,
    };
  }
}

//   private static check_access_asset_to_asset(
//     graph: { nodes: string[]; edges: { source: string; target: string }[] },
//     asset: AssetNode,
//     reachableNode: AssetNode
//   ): [Vulnerability | null, Privilege | null, AttackVector | null] {
//     let accessVector: AttackVector | null = null;
//     let privilege: Privilege | null = null;

//     for (const node of asset.reachableNodes) {
//       if (reachableNode.name === node.node.name) {
//         accessVector = node.attackVector;
//         privilege = node.privilege;
//         break;
//       }
//     }

//     function findVul(target: string, asset: AssetNode): Vulnerability | null {
//       for (const vul of asset.vulnerabilities) {
//         if (target === vul.name) {
//           return vul;
//         }
//       }
//       return null;
//     }

//     for (const graphNode of graph.nodes) {
//       if (graphNode.includes('Asset_') && graphNode.includes(asset.name)) {
//         for (const vul of reachableNode.vulnerabilities) {
//           if (vul.postCondition >= privilege) {
//             return [vul, privilege, accessVector];
//           }
//         }
//       }
//     }

//     return [null, null, null];
//   }

// private static generateFullGraph(
//   graph: Graph,
//   assets: Record<string, AssetNode>,
//   attackers: AttackerNode[]
// ): Graph {
//   // append all node and edge
//   for (const attacker of attackers) {
//     for (const assetId in assets) {
//       const asset = assets[assetId];
//       const source = attacker.name;
//       const target = `Asset_${asset.name}_${assetId}`;
//       const sourceNode = new Node(source, 1);
//       const targetNode = new Node(target, 1);
//       if (!graph.nodes.find((node) => node.isEqual(sourceNode))) {
//         graph.nodes.push(sourceNode);
//       }
//       if (!graph.nodes.find((node) => node.isEqual(targetNode))) {
//         graph.nodes.push(targetNode);
//       }
//       for (const vul of asset.vulnerabilities) {
//         this.propagateVulnerability(graph, vul, source, target, assetId);
//       }

//       for (const targetAssetNode of asset.reachableNodes) {
//         const targetAsset = targetAssetNode.node as AssetNode;
//         const target = `Asset_${targetAsset.name}_${targetAsset.id}`;
//         const targetNode = new Node(target, 1);
//         if (!graph.nodes.find((node) => node.isEqual(targetNode))) {
//           graph.nodes.push(targetNode);
//         }
//         for (const vul of targetAsset.vulnerabilities) {
//           // this.propagateVulnerability(graph, vul, source, target, assetId);
//           const exploitedVul = `Vul_${vul.name}_${targetAsset.id}`;
//           const expolitedVulEdge = new Edge(source, exploitedVul);
//           const achieveGoalEdge = new Edge(exploitedVul, target);
//           const vulNode = new Node(exploitedVul, 1);
//           if (!graph.edges.find((edge) => edge.isEqual(expolitedVulEdge))) {
//             graph.edges.push(expolitedVulEdge);
//           }
//           if (!graph.edges.find((edge) => edge.isEqual(achieveGoalEdge))) {
//             graph.edges.push(achieveGoalEdge);
//           }
//           if (!graph.nodes.find((node) => node.isEqual(vulNode))) {
//             graph.nodes.push(vulNode);
//           }
//         }
//       }
//     }
//   }
//   return graph;
// }

// private static propagateVulnerability(
//   graph: Graph,
//   vul: Vulnerability,
//   sourceName: string,
//   targetName: string,
//   targetAssetId: string
// ) {
//   const exploitedVul = `Vul_${vul.name}_${targetAssetId}`;
//   const expolitedVulEdge = new Edge(sourceName, exploitedVul);
//   const achieveGoalEdge = new Edge(exploitedVul, targetName);
//   const vulNode = new Node(exploitedVul, 1);
//   if (!graph.edges.find((edge) => edge.isEqual(expolitedVulEdge))) {
//     graph.edges.push(expolitedVulEdge);
//   }
//   if (!graph.edges.find((edge) => edge.isEqual(achieveGoalEdge))) {
//     graph.edges.push(achieveGoalEdge);
//   }
//   if (!graph.nodes.find((node) => node.isEqual(vulNode))) {
//     graph.nodes.push(vulNode);
//   }
// }

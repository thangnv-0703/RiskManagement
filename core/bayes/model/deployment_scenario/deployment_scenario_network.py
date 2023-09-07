import pysmile
from typing import List
import math
from bayes.helper.hepler import generate_all_binary, get_attribute
from bayes.model.constant import (NODE_CPT, NODE_DECISION, NODE_DECISION_FALSE,
    NODE_DECISION_TRUE, NODE_CPT_TRUE, NODE_CPT_FALSE, TYPE_ATTACKER, TYPE_CVE,
    exploitability_cvss, remediation_level_cvss, report_confidence_cvss, outcomes_factor)

from bayes.model.base_network.node import (Node, NodeCPT, NodeDecision, NodeUtility, NodeCPTInterval, NodeEquation)

from bayes.model.base_network.network import Network

from bayes.model.deployment_scenario.deployment_scenario_node import *

class DeploymentScenarioNetwork(Network):
    DECIMAL = 4
    DEFAULT_TIME_STEP = 2
    DEFAULT_TIME_LAYER = 2

    base_impact: float
    base_benefit: float

    countermeasures: list
    attack_graph: dict
    vulnerabilities: list
    node_temporal: list
    assets: dict
    system_assets: list
    security_goals: list
    attacker_capability: dict
    effectiveness_defender: dict
    system_likelihood: float
    supplement_config: dict

    target: dict
    phase: int

    attacker_capability_likelihood: list
    effectiveness_defender_likelihood: list = []

    cia_metric: dict = {
        'confidentiality': {
            'NONE': 1,
            'PARTIAL': 2,
            'COMPLETE': 3,
            'LOW ': 2,
            'LOW-MEDIUM': 2,
            'HIGH': 2,
            'CRITICAL': 3
        },
        'integrity': {
            'NONE': 1,
            'PARTIAL': 2,
            'COMPLETE': 3,
            'LOW ': 2,
            'LOW-MEDIUM': 2,
            'HIGH': 2,
            'CRITICAL': 3

        },
        'availability': {
            'NONE': 1,
            'PARTIAL': 2,
            'COMPLETE': 3,
            'LOW ': 2,
            'LOW-MEDIUM': 2,
            'HIGH': 2,
            'CRITICAL': 3
        }
    }

    exploitability: float
    remediation_level: float
    report_confidence: float

    # DBN
    time_step: int
    time_layer: int

    def __init__(self):
        self.attacker_capability = dict()
        self.effectiveness_defender = dict()
        pass

    def get_utility(self, node_handle: int, layer: int = 0):
        node = self.nodes[node_handle]
        if isinstance(node, NodeDeploymentScenarioCPT):
            if not node.is_attacker:
                result = {
                    'node': {},
                    'countermeasures': [],
                    'utility_table': [],
                    'utility_values': [],
                }
                countermeasures = self._get_countermeasure_cover_cve(node.name.split('_')[1])
                result['node'] = self.get_node_posteriors(node_handle)
                result['countermeasures'] = countermeasures
                if not self.network.get_node_temporal_type(node_handle) == pysmile.NodeTemporalType.PLATE:
                    __utility = self._get_utility(node, result['node']['outcomes'][NODE_CPT_TRUE], countermeasures)
                    return {
                        **result,
                        'utility_table': __utility[0],
                        'utility_values': __utility[1],
                    }
                else:
                    outcome = result['node']['outcomes'][layer]
                    __utility = self._get_utility(node, outcome[NODE_CPT_TRUE], countermeasures)
                    return {
                        **result,
                        'utility_table': __utility[0],
                        'utility_values': __utility[1],
                    }
        return {}

    def _get_utility(self, node, prob, countermeasures):
        attack_damage = self.base_impact * node.impact
        utility_table = []
        utility_values = []

        number_countermeasures = len(countermeasures)
        if number_countermeasures > 0:
            arr = [None] * number_countermeasures
            l = []
            generate_all_binary(number_countermeasures, arr, 0, l)
            l.reverse()
            # CVE khong bi khai thac
            for item in l:
                if item == [0] * number_countermeasures:
                    utility_table.append(-attack_damage)
                else:
                    utility_value = attack_damage

                    for index, value in enumerate(item):
                        if value:  # = 1
                            cost_benefit = self.base_benefit * countermeasures[index]['coverage']
                            cost = countermeasures[index]['cost']
                            utility_value = utility_value + cost_benefit - cost
                    utility_table.append(utility_value)
            # CVE bi khai thac
            for item in l:
                utility_value = 0
                for index, value in enumerate(item):
                    if value:  # = 1
                        cost = countermeasures[index]['cost']
                        utility_value = utility_value - cost
                utility_table.append(utility_value)
            utility_values = self.get_utility_value(utility_table, prob)
        return [utility_table, utility_values]

    def get_utility_value(self, utility_table: list, prob: float):
        middle_index = len(utility_table) // 2
        vul_exploited = utility_table[:middle_index]
        vul_not_exploied = utility_table[middle_index:]
        utility_value = []
        for index in range(len(vul_exploited)):
            utility_value.append(vul_exploited[index] * prob + (1 - prob) * vul_not_exploied[index])
        return utility_value

    def get_decisions(self):
        decisions = []
        for i in range(self.time_layer):
            decisions_layer = []
            decisions_cost = self.get_decision_cost(i)
            for index, countermeasure in enumerate(self.countermeasures):
                decisions_layer += [{
                    'id': index,
                    'name': countermeasure['name'],
                    'type': NODE_DECISION,
                    'outcomes': {
                        NODE_DECISION_TRUE: decisions_cost[countermeasure['name']][NODE_DECISION_TRUE],
                        NODE_DECISION_FALSE: decisions_cost[countermeasure['name']][NODE_DECISION_FALSE],
                    },
                    'cost': countermeasure['cost'],
                }]
            decisions.append(decisions_layer)
        if self.time_layer == 1:
            return decisions[0]

        result = []
        for k in decisions[0]:
            result.append({
                **k,
                'outcomes': [k['outcomes']]
            })
        for i in range(1, self.time_layer):
            d = decisions[i]
            for index in range(len(d)):
                result[index] = {
                    **result[index],
                    'outcomes': result[index]['outcomes'] + [d[index]['outcomes']]
                }

        return result

    def _get_countermeasure_cover_cve(self, cve_name: str):
        counter = []
        for countermeasure in self.countermeasures:
            if cve_name in countermeasure['cover_cves']:
                counter.append(countermeasure)
        return counter

    def _init_coverage(self):
        result = {}
        for tmp in self.attack_graph['nodes']:
            if not tmp['is_attacker'] and not tmp['is_asset']:
                countermeasures = self._get_countermeasure_cover_cve(tmp['cve_id'])
                if len(countermeasures) != 0:
                    if tmp['cve_id'] not in result:
                        result[tmp['cve_id']] = [c['coverage'] for c in countermeasures]
        return result

    def calculator_decision(self, utility_values: List[float], decisions: List[str]):
        result = {}
        middle_index = len(utility_values) // 2
        exploited = utility_values[:middle_index]
        not_exploited = utility_values[middle_index:]
        for decision in decisions:
            result[decision] = [max(exploited), max(not_exploited)]
            middle_index = len(exploited) // 2
            exploited = exploited[:middle_index]
            not_exploited = not_exploited[:middle_index]

        return result

    def get_decision_cost(self, layer: int = 0):
        all_node_cves = []
        countermeasures_cost = {}
        for node_handle in self.nodes:
            tmp = self.get_utility(node_handle, layer)
            if len(tmp):
                all_node_cves.append(tmp)
        for node in all_node_cves:
            countermeasures_names = [target['name'] for target in node['countermeasures']]
            costs = self.calculator_decision(node['utility_values'], countermeasures_names)
            for target in costs:
                if target in countermeasures_cost:
                    countermeasures_cost[target] = {
                        NODE_DECISION_TRUE: round(countermeasures_cost[target][NODE_DECISION_TRUE] + costs[target][0],
                                                  DeploymentScenarioNetwork.DECIMAL),
                        NODE_DECISION_FALSE: round(countermeasures_cost[target][NODE_DECISION_FALSE] + costs[target][1],
                                                   DeploymentScenarioNetwork.DECIMAL),
                    }
                else:
                    countermeasures_cost[target] = {
                        NODE_DECISION_TRUE: round(costs[target][0], DeploymentScenarioNetwork.DECIMAL),
                        NODE_DECISION_FALSE: round(costs[target][1], DeploymentScenarioNetwork.DECIMAL),
                    }
        for countermeasure in self.countermeasures:
            if countermeasure['name'] not in countermeasures_cost:
                countermeasures_cost[countermeasure['name']] = {
                    NODE_DECISION_TRUE: - countermeasure['cost'],
                    NODE_DECISION_FALSE: 0,
                }
        return countermeasures_cost

    def _parser_vulnerabilities(self, vulnerabilities):
        tmp = {}
        for asset in vulnerabilities:
            cves = []
            for vul in asset['cves']:
                # print(str(vul["cve_id"]) + " " + str(get_attribute(vul, 'impact.baseMetricV2.exploitabilityScore', 0)))
                cves.append({
                    **vul,
                    'exploitabilityScore': float(get_attribute(vul, 'impact.baseMetricV2.exploitabilityScore', 0)) / 10.0,
                    'impactScore': float(get_attribute(vul, 'impact.baseMetricV2.impactScore', 0)) / 10.0,
                    'confidentialityImpact': get_attribute(vul, 'impact.baseMetricV2.cvssV2.confidentialityImpact', 0) or get_attribute(vul, 'impact.baseMetricV3.cvssV3.confidentialityImpact', 0),
                    'integrityImpact': get_attribute(vul, 'impact.baseMetricV2.cvssV2.integrityImpact', 0) or get_attribute(vul, 'impact.baseMetricV3.cvssV3.integrityImpact', 0),
                    'availabilityImpact': get_attribute(vul, 'impact.baseMetricV2.cvssV2.availabilityImpact', 0) or get_attribute(vul, 'impact.baseMetricV3.cvssV3.availabilityImpact', 0)
                })
            tmp[asset['asset_id']] = cves
        self.vulnerabilities = tmp

    def _parser_assets(self, assets):
        self.assets = {}
        for asset in assets:
            self.assets[asset['id']] = {
                **asset,
                'cve_nodes': []
            }

    def get_cia_assets(self):
        results = []
        for asset_id in self.assets:
            results.append(self._get_cia_asset(asset_id))
        return results

    def get_cia_system_asset(self): 
        results = []
        for asset_id in self.system_assets:
            results.append(self._get_cia_asset(asset_id))
        return results

    def get_likelihood(self):
        for handle in self.nodes:
            node = self.nodes[handle]
            if node.is_system:
                return self.get_node_posteriors(handle)
        return None

    def get_apt_risk_likelihood(self):
        for handle in self.nodes:
            node = self.nodes[handle]
            if node.name == 'APT_risk_cpt':
                return self.get_node_posteriors(handle)
        return None

    def _get_cia_asset(self, asset_id):
        results = {
            'id': asset_id,
            'name': self.assets[asset_id]['name'],
            'confidentiality': [],
            'integrity': [],
            'availability': [],
            'cia': [],
        }
        cve_nodes = self.assets[asset_id]['cve_nodes']
        asset_confidentiality = 0
        asset_integrity = 0
        asset_availability = 0

        if self.time_layer == 1:
            for node in cve_nodes:
                probability = self.get_node_posteriors(node.handle)['outcomes'][NODE_CPT_TRUE]
                cve = next((x for x in self.vulnerabilities[asset_id] if x['cve_id'] == node.cve_id), None)
                asset_confidentiality += self.cia_metric['confidentiality'][cve['confidentialityImpact']] * probability
                asset_integrity += self.cia_metric['integrity'][cve['integrityImpact']] * probability
                asset_availability += self.cia_metric['availability'][cve['availabilityImpact']] * probability
            c = 3
            i = 3
            a = 3

            if len(cve_nodes) != 0:
                c = round(3 - asset_confidentiality / len(cve_nodes), DeploymentScenarioNetwork.DECIMAL)
                i = round(3 - asset_integrity / len(cve_nodes), DeploymentScenarioNetwork.DECIMAL)
                a = round(3 - asset_availability / len(cve_nodes), DeploymentScenarioNetwork.DECIMAL)
                
            return {
                **results,
                'confidentiality': c,
                'integrity': i,
                'availability': a,
                'cia': round(c + i + a, DeploymentScenarioNetwork.DECIMAL),
            }

        for k in range(self.time_layer):
            asset_confidentiality = 0
            asset_integrity = 0
            asset_availability = 0
            for node in cve_nodes:
                if self.network.get_node_temporal_type(node.handle) == pysmile.NodeTemporalType.PLATE:
                    probability = self.get_node_posteriors(node.handle)['outcomes'][k][NODE_CPT_TRUE]
                else:
                    probability = self.get_node_posteriors(node.handle)['outcomes'][NODE_CPT_TRUE]
                cve = next((x for x in self.vulnerabilities[asset_id] if x['cve_id'] == node.cve_id), None)
                asset_confidentiality += self.cia_metric['confidentiality'][cve['confidentialityImpact']] * probability
                asset_integrity += self.cia_metric['integrity'][cve['integrityImpact']] * probability
                asset_availability += self.cia_metric['availability'][cve['availabilityImpact']] * probability
            c = 3
            i = 3
            a = 3

            if len(cve_nodes) != 0:
                c = round(3 - asset_confidentiality / len(cve_nodes), DeploymentScenarioNetwork.DECIMAL)
                i = round(3 - asset_integrity / len(cve_nodes), DeploymentScenarioNetwork.DECIMAL)
                a = round(3 - asset_availability / len(cve_nodes), DeploymentScenarioNetwork.DECIMAL)

            results = {
                **results,
                'confidentiality': results['confidentiality'] + [c],
                'integrity': results['integrity'] + [i],
                'availability': results['availability'] + [a],
                'cia': results['cia'] + [round(c + i + a, DeploymentScenarioNetwork.DECIMAL)],
            }
        return results

    def get_system_cpt_temporal(self, system_cpt):
        result = []
        for i in range(0, len(system_cpt), 2):
            result.extend(system_cpt[i:i+2] + [0,1])
        return result

    def set_attacker_capability(self):
        attacker_capability = self.supplement_config['attacker_capability']
        mean_parents_node = []
        opportunity_parents_node = []
        for item in attacker_capability:
            intervalNode = NodeCPTInterval(name = item['name'], score=item['score'], intervals=[0,0.2,0.4,0.6,0.8,1], weight=item["weight"], outcomes=outcomes_factor)
            handle = self.add_node(intervalNode)
            if item['type'] == 'mean':
                mean_parents_node.append(intervalNode)
            if item['type'] == 'opportunity':
                opportunity_parents_node.append(intervalNode)
            index_outcome = math.ceil(item['score']/2) - 1
            self.attacker_capability[handle] = intervalNode
            self.network.set_evidence(handle, outcomes_factor[index_outcome])

        mean_node = NodeEquation(name ="Mean")
        mean_node_equation = self.get_equation(self.supplement_config['attacker_aggregate_function'], mean_parents_node, mean_node)
        mean_node.set_equation(mean_node_equation)
        self.add_node(mean_node)
        self.set_uniform_intervals(mean_node.id, 5)

        opportunity_node = NodeEquation(name ="Opportunity")
        opportunity_node_equation = self.get_equation(self.supplement_config['attacker_aggregate_function'], opportunity_parents_node, opportunity_node)
        opportunity_node.set_equation(opportunity_node_equation)
        self.add_node(opportunity_node)
        self.set_uniform_intervals(opportunity_node.id, 5)
        
        attacker_capability_node = NodeEquation(name ="attacker_capability")
        attacker_capability_node_equation = self.get_equation(self.supplement_config['attacker_aggregate_function'], [mean_node, opportunity_node],   attacker_capability_node  )
        attacker_capability_node.set_equation(attacker_capability_node_equation)
        self.add_node(attacker_capability_node)
        self.set_uniform_intervals(attacker_capability_node.id, 2)

        attacker_capability_node_cpt = NodeCPT(name="attacker_capability_cpt", outcomes=["not_enough", "enough"], probability=1)
        self.add_node(attacker_capability_node_cpt)
        self.add_link(attacker_capability_node, attacker_capability_node_cpt)
        return attacker_capability_node_cpt

    def set_effectiveness_defender(self):
        effectiveness_defender = self.supplement_config['effectiveness_defender']
        organizational_parents_node = []
        technical_parents_node = []
        for item in effectiveness_defender:
            intervalNode = NodeCPTInterval(name = item['name'], score=item['score'], intervals=[0,0.2,0.4,0.6,0.8,1], weight=item["weight"], outcomes=outcomes_factor)
            handle = self.add_node(intervalNode)
            if item['type'] == 'organizational':
                organizational_parents_node.append(intervalNode)
            if item['type'] == 'technical':
                technical_parents_node.append(intervalNode)
            index_outcome = math.ceil(item['score']/2) - 1
            self.effectiveness_defender[handle] = intervalNode
            self.network.set_evidence(handle, outcomes_factor[index_outcome])

        organizational_node = NodeEquation(name ="Organizational")
        organizational_node_equation = self.get_equation(self.supplement_config['defender_aggregate_function'], organizational_parents_node, organizational_node)
        organizational_node.set_equation(organizational_node_equation)
        self.add_node(organizational_node)
        self.set_uniform_intervals(organizational_node.id, 5)

        technical_node = NodeEquation(name ="Technical")
        technical_node_equation = self.get_equation(self.supplement_config['defender_aggregate_function'], technical_parents_node, technical_node)
        technical_node.set_equation(technical_node_equation)
        self.add_node(technical_node)
        self.set_uniform_intervals(technical_node.id, 5)
        
        effectiveness_defender_node = NodeEquation(name ="effectiveness_defender")
        effectiveness_defender_node_equation = self.get_equation(self.supplement_config['defender_aggregate_function'], [organizational_node, technical_node], effectiveness_defender_node)
        effectiveness_defender_node.set_equation(effectiveness_defender_node_equation)
        self.add_node(effectiveness_defender_node)
        self.set_uniform_intervals(effectiveness_defender_node.id, 2)

        effectiveness_defender_node_cpt = NodeCPT(name="effectiveness_defender_cpt", outcomes=["not_effective", "effective"], probability=1)
        self.add_node(effectiveness_defender_node_cpt)
        self.add_link(effectiveness_defender_node, effectiveness_defender_node_cpt)
        return effectiveness_defender_node_cpt

    def set_apt_risk(self, node_system: NodeCPT, node_attacker_capability: NodeCPT, node_effectiveness_defend: NodeCPT):
        # apt_risk_node = NodeEquation(name="APT_risk")
        # risk_equation = "{}=Max(Min(Abs({}=\"True\")+(Abs({}=\"enough\")-Abs({}=\"effective\")),1),0)".format(apt_risk_node.id, node_system.id, node_attacker_capability.id, node_effectiveness_defend.id)
        # apt_risk_node.set_equation(risk_equation)
        # self.add_node(apt_risk_node)

        apt_risk_node_cpt = NodeCPT(name="APT_risk_cpt", outcomes=["True", "False"], probability=1)
        self.add_node(apt_risk_node_cpt)
        self.add_link(node_system, apt_risk_node_cpt)
        self.add_link(node_attacker_capability, apt_risk_node_cpt)
        self.add_link(node_effectiveness_defend, apt_risk_node_cpt)
        self.network.set_node_definition(apt_risk_node_cpt.id, [1,0,0,1,1,0,1,0,0,1,0,1,0,1,0,1])
        return apt_risk_node_cpt

    # def get_risk_equation

    def get_mean_equation(self, parent_interval_node: [], equation_node: NodeEquation):
        weight_arr = ["{}*{}".format(item.weight, item.id) for item in parent_interval_node]
        weight_sum_func = "+".join(weight_arr)
        total_weight = 0
        for interval_node in parent_interval_node:
            total_weight += interval_node.weight
        return "{}=TruncNormal(({})/{}, 0.001, 0, 1)".format(equation_node.id, weight_sum_func, total_weight)

    def get_min_equation(self, parent_interval_node: [], equation_node: NodeEquation):
        min_arr = []
        for index, node in enumerate(parent_interval_node):
            min_element = ["{}*{}".format(item.weight if index == index_item else 1 , item.id) for index_item, item in enumerate(parent_interval_node)]
            min_element_func = "({})/{}".format("+".join(min_element), node.weight + len(parent_interval_node) - 1)  
            min_arr.append(min_element_func)
        return "{}=TruncNormal(Min({}), 0.001, 0, 1)".format(equation_node.id, ",".join(min_arr))

    def get_max_equation(self, parent_interval_node: [], equation_node: NodeEquation):
        max_arr = []
        for index, node in enumerate(parent_interval_node):
            max_element = ["{}*{}".format(item.weight if index == index_item else 1 , item.id) for index_item, item in enumerate(parent_interval_node)]
            max_element_func = "({})/{}".format("+".join(max_element), node.weight + len(parent_interval_node) - 1)  
            max_arr.append(max_element_func)
            print(max_element_func)
        return "{}=TruncNormal(Max({}), 0.001, 0, 1)".format(equation_node.id, ",".join(max_arr))


    def get_equation(self, aggregate_func: str, parent_interval_node: [], equation_node: NodeEquation):
        # switch case aggregate_func = "mean", "min", "max" to call function get_mean_equation, get_min_equation, get_max_equation
        match aggregate_func:
            case "mean":
                return self.get_mean_equation(parent_interval_node, equation_node)
            case "min":
                return self.get_min_equation(parent_interval_node, equation_node)
            case "max":
                return self.get_max_equation(parent_interval_node, equation_node)

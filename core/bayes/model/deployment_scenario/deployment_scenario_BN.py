from bayes.model.deployment_scenario.deployment_scenario_network import *
from bayes.model.deployment_scenario.deployment_scenario_node import *
from bayes.helper.hepler import generate_all_binary, get_attribute
from bayes.model.constant import *

class DeploymentScenarioBN(DeploymentScenarioNetwork):

    def __init__(
        self, 
        deployment_scenario: dict, 
        supplement_config: dict,
        phase: int = 1,
        system_likelihood: float = None,
        exploitability: str = 'High', 
        remediation_level: str = 'Unavailable', 
        report_confidence: str = 'Confirmed',
        attack_graph=None, 
        base_impact: float = 100,
        base_benefit: float = 100, 
        time_step: int = 1,
        time_layer: int = 1, 
        script=None, 
        is_use_countermeasure=True,
    ) -> None:
        super().__init__()

        if attack_graph is None:
            attack_graph = {}

        self.network = pysmile.Network()

        if script:
            load_script = self.load(script)
            self.nodes = {}
            self.countermeasures = load_script['countermeasures']
            self._parser_vulnerabilities(load_script['vulnerabilities'])
            self.attack_graph = load_script['attack_graph']
            self.base_impact = load_script['base_impact']
            self.base_benefit = load_script['base_benefit']
            self.time_step = load_script['time_step']
            self.time_layer = load_script['time_layer']
            self.system_likelihood = load_script['system_likelihood']
        else:
            self.nodes = {}
            if is_use_countermeasure:
                self.countermeasures = deployment_scenario['countermeasures']
            else:
                self.countermeasures = []
            self._parser_assets(deployment_scenario['assets'])
            self.security_goals = deployment_scenario['security_goals']
            self._parser_vulnerabilities(deployment_scenario['cves'])
            self.attack_graph = attack_graph
            self.base_impact = base_impact
            self.base_benefit = base_benefit
            self.time_step = time_step
            self.time_layer = time_layer
            self.system_likelihood = system_likelihood
            self.supplement_config = supplement_config

        Node.reset_id()

        # init value
        list_node_vul = {}
        list_node_countermeasures = {}

        # Init coverage : dict {'Name CVE': [coverage1, coverage2]}
        init_coverage = self._init_coverage()

        # temporal
        self.exploitability = exploitability_cvss.get(exploitability, 1.00)
        self.remediation_level = remediation_level_cvss.get(remediation_level, 1.00)
        self.report_confidence = report_confidence_cvss.get(report_confidence, 1.00)

        # self.set_apt_risk(system_node)

        asset_nodes = []
        asset_system = []
        for security_goal in self.security_goals:
            asset_system += security_goal['asset_id']
        # Attack_graph to BDN
        for tmp in self.attack_graph['nodes']:
            if phase not in tmp['phase']:
                continue
            if tmp['is_attacker']:
                node = NodeDeploymentScenarioCPT(name="Attacker_{}_{}".format(
                    tmp['label'], tmp['id']))
                node.set_attacker()
                list_node_vul[tmp['id']] = node
                self.add_node(node)
            elif tmp['is_asset']:
                node = NodeDeploymentScenarioCPT(name="Asset_{}_{}".format(
                    tmp['label'], tmp['id']), asset_id=tmp['asset_id'])
                list_node_vul[tmp['id']] = node
                self.add_node(node)
                if tmp['asset_id'] in asset_system:
                    asset_nodes.append(node)
            elif not tmp['is_attacker'] and not tmp['is_asset']:
                vul = [x for x in self.vulnerabilities[tmp['asset_id']]
                       if x['cve_id'] == tmp['cve_id']][0]
                if 'relation' in tmp:
                    node = NodeDeploymentScenarioCPT(
                        name="Vul_{}_{}".format(
                            tmp['cve_id'], tmp['asset_id']),  
                        probability=vul['exploitabilityScore']*self.exploitability*self.report_confidence*self.remediation_level,
                        impact=vul['impactScore'],
                        relation=tmp['relation'],
                        asset_id=tmp['asset_id'],
                        cve_id=tmp['cve_id'],
                    )
                else:
                    node = NodeDeploymentScenarioCPT(
                        name="Vul_{}_{}".format(
                            tmp['cve_id'], tmp['asset_id']),
                        probability=vul['exploitabilityScore']*self.exploitability*self.report_confidence*self.remediation_level,
                        impact=vul['impactScore'],
                        asset_id=tmp['asset_id'],
                        cve_id=tmp['cve_id'],
                    )
                list_node_vul[tmp['id']] = node
                self.add_node(node)
                self.assets[tmp['asset_id']]['cve_nodes'].append(node)
                counter_cover_cves = self._get_countermeasure_cover_cve(tmp['cve_id'])
                # for counter in counter_cover_cves:
                #     self.add_link(list_node_countermeasures[counter["id"]], node)

        system_node = NodeDeploymentScenarioCPT(name="System_current_phase({})".format(phase))
        system_node.set_system_node()
        self.add_node(system_node)
        

        # Set Arc
        for link in self.attack_graph['edges']:
            if phase not in link['phase']:
                continue
            self.add_link(list_node_vul[link['source']],
                          list_node_vul[link['target']])
            
        for node in asset_nodes:
            self.add_link(node, system_node)

        system_cpt = self.get_node_definition_auto(system_node.handle)

        if system_likelihood:
            system_previous_node = NodeDeploymentScenarioCPT(name="System_previous_phase({})".format(phase - 1), probability=system_likelihood['outcomes'][NODE_DECISION_TRUE])
            self.add_node(system_previous_node)
            self.add_link(system_previous_node, system_node)
            system_cpt = self.get_system_cpt_temporal(system_cpt)
        self.network.set_node_definition(system_node.handle, system_cpt)

        # auto set definition
        self._auto_set_node_definition(init_coverage) 
        
        if supplement_config:
            attacker_capability_node = self.set_attacker_capability()
            effectiveness_defender_node= self.set_effectiveness_defender()

            apt_risk_node = self.set_apt_risk(system_node, attacker_capability_node, effectiveness_defender_node)

        self._update_network()  

        self.write_file("test/BN_{}_phase_{}".format(is_use_countermeasure, phase))

    def get_attacker_capability(self):
        return self.supplement_config and self.network.get_node_value(self._get_node_by_name('attacker_capability_cpt')[0])[1] or NULL

    def get_effectiveness_defender(self):
        return self.supplement_config and self.network.get_node_value(self._get_node_by_name('effectiveness_defender_cpt')[0])[1] or NULL
        
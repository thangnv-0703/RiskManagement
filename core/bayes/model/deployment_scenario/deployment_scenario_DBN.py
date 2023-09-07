from bayes.model.deployment_scenario.deployment_scenario_network import *
from bayes.model.deployment_scenario.deployment_scenario_node import *
from bayes.model.constant import *
from datetime import datetime
def family_edges(edges: dict, key):
    if key not in edges:
        return set()
    return set(edges[key] + [b for a in edges[key] for b in family_edges(edges, a)])


class DeploymentScenarioDBN(DeploymentScenarioNetwork):
    node_temporal: list

    file_name: str = "test/DBN"
    system_temporal_node: NodeCPT
    system_node: NodeCPT
    init_coverage: dict
    edges: dict
    observer_data: list
    observer_factor: dict
    all_node_handle_temporal: list

    def __init__(
        self, 
        deployment_scenario=None, 
        supplement_config=None,
        attack_graph=None, 
        phase: int = 1,
        system_likelihood: float = None,
        exploitability: str = 'High', 
        remediation_level: str = 'Unavailable', 
        report_confidence: str = 'Confirmed',
        base_impact: float = 100, 
        base_benefit: float = 100,
        time_step: int = Network.DEFAULT_TIME_STEP, 
        time_layer: int = Network.DEFAULT_TIME_LAYER,
        node_temporal=None, 
        script=None, 
        is_use_countermeasure=True, 
        observer_data=None,
        observer_factor=None,
    ) -> None:
        super().__init__()
        if deployment_scenario is None:
            deployment_scenario = {}
        if node_temporal is None:
            node_temporal = []
        if attack_graph is None:
            attack_graph = {}
        if observer_data is None:
            observer_data = []
        if observer_factor is None:
            observer_factor = dict()

        self.network = pysmile.Network()
        self.node_temporal = ['All']
        self.edges = {}
        self.all_node_handle_temporal = []
        self.attacker_capability_likelihood = []
        self.effectiveness_defender_likelihood = []
        self.system_assets = []

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
            self.phase = load_script['phase']
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
            self.time_layer = time_step
            self.node_temporal = deployment_scenario['temporal_node']
            self.observer_data = observer_data
            self.system_likelihood = system_likelihood
            self.supplement_config = supplement_config
            self.observer_factor = observer_factor
            self.phase = phase
            self.file_name = "test/DBN_{}_phase_{}_time_step_{}".format(is_use_countermeasure, phase, time_step)

        Node.reset_id()

        # init value
        list_node_vul = {}

        # Init coverage : dict {'Name CVE': [coverage1, coverage2]}
        self.init_coverage = self._init_coverage()

        # Temporal
        self.exploitability = exploitability_cvss.get(exploitability, 1.00)
        self.remediation_level = remediation_level_cvss.get(remediation_level, 1.00)
        self.report_confidence = report_confidence_cvss.get(report_confidence, 1.00)

        
        asset_nodes = []

        for security_goal in self.security_goals:
            if security_goal['asset_id'] not in self.system_assets:
                self.system_assets.append(security_goal['asset_id'])

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
                
                if tmp['asset_id'] in self.system_assets:
                    asset_nodes.append(node)
                # self.add_link(node, system_node)
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

        self.system_temporal_node = NodeDeploymentScenarioCPT(name="System_plate")
        self.system_temporal_node.set_system_node()
        self.add_node(self.system_temporal_node)

        # apt_risk_node = NodeEquation(name="APT_risk")
        # apt_risk_node.set_equation("{}=1".format(apt_risk_node.id))
        # self.add_node(apt_risk_node)

        relations = []
        for link in self.attack_graph['edges']:
            if phase not in link['phase']:
                continue
            source = list_node_vul[link['source']]
            target = list_node_vul[link['target']]
            # self.add_link(source, target)
            relations.append([source.handle, target.handle])

        for p, c in relations:
            self.edges.setdefault(p, []).append(c)

        # # Set DBN
        self._auto_set_temporal_network()
        # #
        # # Set Arc
        for link in self.attack_graph['edges']:
            if phase not in link['phase']:
                continue
            self.add_link(list_node_vul[link['source']], list_node_vul[link['target']])

        for node in asset_nodes:
            self.add_link(node, self.system_temporal_node)

        if supplement_config:
            self.system_node = NodeDeploymentScenarioCPT(name="System_time_step")
            self.add_node(self.system_node)
            attacker_capability_node = self.set_attacker_capability()
            effectiveness_defender_node= self.set_effectiveness_defender()

        #
        # auto set definition
        system_node_parents = self.network.get_parents(self.system_temporal_node.handle)    
        if len(system_node_parents) == 0:
            self.system_temporal_node.new_probability = 0.0
        
        self._auto_set_node_definition(self.init_coverage)

        system_cpt = self.get_node_definition_auto(self.system_temporal_node.handle)


        if system_likelihood and len(system_node_parents) > 0:
            system_previous_node = NodeDeploymentScenarioCPT(name="System_previous_phase({})".format(phase - 1), probability=system_likelihood['outcomes'][NODE_DECISION_TRUE])
            self.add_node(system_previous_node)
            self.add_link(system_previous_node, self.system_temporal_node)
            system_cpt = self.get_system_cpt_temporal(system_cpt)
            
        self.network.set_node_definition(self.system_temporal_node.handle, system_cpt)


        # auto set definition temporal
        self._auto_node_temporal_definition()

        if supplement_config:

            apt_risk_node_cpt = self.set_apt_risk(self.system_node, attacker_capability_node, effectiveness_defender_node)
        

        # auto set evidence
        self._auto_set_evidence()

        self.write_file("DBN")

    def _auto_set_temporal_network(self):
        all_temporal_network = []
        for node_handle in self.nodes:
            node = self.nodes[node_handle]
            for temporal in self.node_temporal:
                if node.asset_id == temporal['asset_id'] and node.cve_id in temporal['cves']:
                    self.all_node_handle_temporal.append(node_handle)
                    all_temporal_network += [node_handle] + list(family_edges(self.edges, node.handle))
                if node.is_system:
                    all_temporal_network.append(node_handle)

        all_node_temporal = list(set(all_temporal_network))
        for node_handle in all_node_temporal:
            self.set_node_temporal_type(node_handle)
            if node_handle in self.all_node_handle_temporal:
                self.network.add_temporal_arc(node_handle, node_handle, 1)
        self.network.set_slice_count(self.time_step)
        self._update_network()

    def _auto_node_temporal_definition(self):
        for node_handle in self.nodes:
            node = self.nodes[node_handle]
            if self.network.get_node_temporal_type(node_handle) == pysmile.NodeTemporalType.PLATE and node_handle in self.all_node_handle_temporal:
                probability = round(
                    self.nodes[node_handle].new_probability, Network.DECIMAL)
                relation = self.nodes[node_handle].relation
                number_parents = len(self.network.get_parents(node_handle))
                arr = [None] * (number_parents + 1)
                l = []
                generate_all_binary(number_parents + 1, arr, 0, l)
                l.reverse()
                cpts = []
                for val in l:
                    n = len(val)
                    if val[n - 1] == 1:
                        if val == [0] * (n - 1) + [1]:
                            cpt = 0.0
                        else:
                            cpt = 1.0
                    else:
                        number_true = sum(val[:n - 1])
                        cpt = 1 - pow(1 - probability, number_true)
                    cpts += [round(cpt, Network.DECIMAL), round(1 - cpt, Network.DECIMAL)]

                # print(self.network.get_node_temporal_definition(node_handle, 1))
                self.network.set_node_temporal_definition(node_handle, 1, cpts)

        self._update_network()

    def get_apt_risk_likelihood_dynamic(self):
        system_likelihood = self.get_node_posteriors(self.system_temporal_node.handle)
        if len(system_likelihood) == 0:
            return None
        risk_outcomes = []

        now = datetime.now()
        file_name = str(now.strftime("%H-%M-%S-%d/%m/%Y")) + ".txt"
        file_name = "file" + ".txt"
        f = open(file_name, "w")
        content = ""

        for time_step, likelihood in enumerate(system_likelihood['outcomes']):
            self.system_node.new_probability = likelihood[NODE_CPT_TRUE]
            self.network.set_node_definition(self.system_node.handle, [likelihood[NODE_CPT_TRUE], likelihood[NODE_CPT_FALSE]])
            self._update_network()
            plate_likelihood = self.get_apt_risk_likelihood()
            risk_outcomes.append(plate_likelihood['outcomes'])
            content += self.get_observer_data_content(time_step, likelihood[NODE_CPT_TRUE])
            self.update_factor(self.attacker_capability, self.supplement_config['attacker_variation_rate'], time_step)
            self.update_factor(self.effectiveness_defender, self.supplement_config['defender_variation_rate'], time_step)
            # self._auto_set_node_definition(self.init_coverage) 

        f.write(content)
        f.close()
        return {
            **system_likelihood,
            'outcomes': risk_outcomes,
        }
            

    def update_factor(self, dict_factor, variatio_rate, time_step):
        for handle in dict_factor:
            node = dict_factor[handle]
            if self.observer_factor and len(self.observer_factor[node.name]) > time_step:
                node.score = self.observer_factor[node.name][time_step]
            else:
                node.score = min(node.score * (1+variatio_rate)/1, 10)
            index_outcome = math.ceil(node.score/2) - 1
            self.network.set_evidence(handle, outcomes_factor[index_outcome])


    def _auto_set_evidence(self):
        for observer in self.observer_data:
            for node_handle in self.nodes:
                node = self.nodes[node_handle]
                if isinstance(node, NodeDeploymentScenarioCPT) and node.cve_id == observer['cve_id'] and node.asset_id == observer['asset_id']:
                    for ob in observer['observer_data']:
                        evidence = 1
                        if not ob['value']:
                            evidence = False
                        else: 
                            evidence = True
                        # self.network.set_temporal_evidence(node.handle, ob['step'], evidence)
                        try:
                            self.network.set_temporal_evidence(node.handle, ob['step'], evidence)
                            print('Set node', node.cve_id, ob['step'], evidence)
                        except Exception as e:
                            print('Error message', str(e))

        self._update_network()
        self.write_file(self.file_name)

    def get_observer_data_content(self, time_step: int, system_likelihood: float):
        attacker_capability = self._get_node_by_name('attacker_capability_cpt')[0]
        effectiveness_defend = self._get_node_by_name('effectiveness_defender_cpt')[0]
        apt_risk = self._get_node_by_name('APT_risk_cpt')[0]

        attacker_likelihood = self.network.get_node_value(attacker_capability)[1]
        effectiveness_likelihood = self.network.get_node_value(effectiveness_defend)[1]
        self.attacker_capability_likelihood.append(attacker_likelihood)
        self.effectiveness_defender_likelihood.append(effectiveness_likelihood)

        content = "====================================\n"
        content += "Time step: {}\n".format(time_step + 1)
        content += "attacker capability: {}\n".format(attacker_likelihood)
        content += "effectiveness defend: {}\n".format(effectiveness_likelihood)
        content += "sytem likelihood: {}\n".format(system_likelihood)
        content += "apt risk: {}\n".format(self.network.get_node_value(apt_risk)[0])
        return content

    def get_attacker_capability(self, is_get_list=False):
        if is_get_list:
            return self.supplement_config and self.attacker_capability_likelihood or None
        return self.supplement_config and self.attacker_capability_likelihood[len(self.attacker_capability_likelihood) - 1] or None

    def get_effectiveness_defender(self, is_get_list=False):
        if is_get_list:
            return self.supplement_config and self.effectiveness_defender_likelihood or None
        return self.supplement_config and self.effectiveness_defender_likelihood[len(self.effectiveness_defender_likelihood) - 1] or None
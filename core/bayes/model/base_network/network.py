import pickle

import pysmile
from typing import List

import zope.interface 

from bayes.model.base_network.inetwork import INetwork


from bayes.helper.hepler import generate_all_binary, get_attribute
from bayes.model.constant import (NODE_CPT, NODE_DECISION, NODE_DECISION_FALSE,
    NODE_DECISION_TRUE, NODE_CPT_TRUE, NODE_CPT_FALSE, TYPE_ATTACKER, TYPE_CVE,
    exploitability_cvss, remediation_level_cvss, report_confidence_cvss)

from bayes.model.base_network.node import (Node, NodeCPT, NodeDecision, NodeUtility, NodeCPTInterval, NodeEquation)

pysmile.License((
	b"SMILE LICENSE 02d20e96 5c99d660 5a0d147a "
	b"THIS IS AN ACADEMIC LICENSE AND CAN BE USED "
	b"SOLELY FOR ACADEMIC RESEARCH AND TEACHING, "
	b"AS DEFINED IN THE BAYESFUSION ACADEMIC "
	b"SOFTWARE LICENSING AGREEMENT. "
	b"Serial #: 8oh8h97vbg00hh2vz08iopmfd "
	b"Issued for: Th\341\272\257ng Nguy\341\273\205n Vi\341\273\207t (thangnguyenviet00@gmail.com) "
	b"Academic institution: Hanoi University of Science and Technology "
	b"Valid until: 2024-01-07 "
	b"Issued by BayesFusion activation server"
	),[
	0x70,0xd3,0x17,0x5c,0x53,0x53,0x1b,0x5b,0x2b,0x33,0x50,0xdd,0xfe,0x98,0x34,0x15,
	0xf4,0x0b,0x06,0x6e,0x54,0x03,0xa0,0x3f,0xdf,0xed,0x47,0x6f,0xde,0x7d,0xc8,0x18,
	0x59,0xd8,0xa7,0x07,0x59,0x89,0x31,0x0a,0xcb,0x4e,0xa7,0x13,0xd4,0xfd,0xff,0x81,
	0x69,0x12,0x59,0xfe,0xaf,0xfb,0xd8,0x1e,0xd9,0xd8,0xad,0xde,0x8e,0xf5,0x64,0xa2])

@zope.interface.implementer(INetwork)
class Network:
    DECIMAL = 4
    DEFAULT_TIME_STEP = 2
    DEFAULT_TIME_LAYER = 2

    network: pysmile.Network
    nodes: dict

    def __init__(self):
        pass

    def get_outcome_id(self, node_handle: int, outcome_index: int):
        self.network.get_outcome_id(node_handle, outcome_index)

    def add_link(self, parent_node: Node, child_node: Node):
        self.network.add_arc(parent_node.id, child_node.id)

    def delete_link(self, parent_node: Node, child_node: Node):
        self.network.delete_arc(parent_node.id, child_node.id)

    def set_node_definition(self, node_handle: int, definition: list):
        self.network.set_node_definition(node_handle, definition)

    def set_node_temporal_definition(self, node_handle, def_temporal):
        self.network.set_node_temporal_definition(node_handle, self.time_layer, def_temporal)

    def _get_node_by_name(self, name):
        result = []
        for node_handle in self.nodes:
            if name in self.nodes[node_handle].name:
                result.append(node_handle)
        if len(result) != 0:
            return result
        return None

    def _update_network(self):
        self.network.update_beliefs()

    def write_file(self, filename):
        if '.xdsl' not in filename:
            filename = filename + '.xdsl'
        self.network.write_file(filename)

    def load(self, script):
        return pickle.loads(script)

    def add_node(self, target: Node):
        if isinstance(target, NodeCPT):
            node = self.network.add_node(pysmile.NodeType.CPT, target.id)
            self.network.set_node_name(node, target.name)
            initial_outcome_count = self.network.get_outcome_count(node)
            for i in range(0, initial_outcome_count):
                self.network.set_outcome_id(node, i, target.outcomes[i])
            for i in range(initial_outcome_count, len(target.outcomes)):
                self.network.add_outcome(node, target.outcomes[i])
        elif isinstance(target, NodeCPTInterval):
            node = self.network.add_node(pysmile.NodeType.CPT, target.id)
            self.network.set_node_name(node, target.name)
            initial_outcome_count = self.network.get_outcome_count(node)
            for i in range(0, initial_outcome_count):
                self.network.set_outcome_id(node, i, target.outcomes[i])
            for i in range(initial_outcome_count, len(target.outcomes)):
                self.network.add_outcome(node, target.outcomes[i])
            self.network.set_intervals(node, target.intervals, False)
            self.set_node_definition(node, [target.probability] * (len(target.intervals) -1))
        elif isinstance(target, NodeEquation):
            node = self.network.add_node(pysmile.NodeType.EQUATION, target.id)
            self.network.set_node_name(node, target.name)
            self.network.set_node_equation(node, target.equation)
            self.network.set_node_equation_bounds(node, target.lo_bound, target.hi_bound)
        elif isinstance(target, NodeDecision):
            node = self.network.add_node(pysmile.NodeType.DECISION, target.id)
            self.network.set_node_name(node, target.name)
            initial_outcome_count = self.network.get_outcome_count(node)
            for i in range(0, initial_outcome_count):
                self.network.set_outcome_id(node, i, target.outcomes[i])
            for i in range(initial_outcome_count, len(target.outcomes)):
                self.network.add_outcome(node, target.outcomes[i])
        elif isinstance(target, NodeUtility):
            node = self.network.add_node(pysmile.NodeType.UTILITY, target.id)
            self.network.set_node_name(node, target.name)
        else:
            raise Exception('add_node failed')
        target.handle = node
        self.nodes[node] = target
        return node

    def delete_node(self, target: Node):
        self.network.delete_node(target.handle)
        del self.nodes[target.handle]

    def set_node_temporal_type(self, node_handle: int):
        if isinstance(self.nodes[node_handle], NodeCPT):
            if self.nodes[node_handle].cve_id or self.nodes[node_handle].asset_id or self.nodes[node_handle].is_system:
                self.network.set_node_temporal_type(node_handle, pysmile.NodeTemporalType.PLATE)

    def _set_new_probability(self, node_handle: int, init_coverage: dict):
        target = self.nodes[node_handle]
        coverage_all = 0
        if isinstance(target, NodeCPT):
            name = target.name
            index = False
            for init_coverage_name in init_coverage:
                if init_coverage_name in name:
                    index = init_coverage_name
                    break
            if index:
                coverage = init_coverage[index]
                if len(coverage) == 1:
                    coverage_all = coverage[0]
                elif len(coverage) > 1:
                    _coverage = 1
                    for tmp in coverage:
                        _coverage *= (1 - tmp)
                    coverage_all = 1 - _coverage
                target.new_probability = round(target.probability * (1 - coverage_all), Network.DECIMAL)
        else:
            raise Exception('Not cpt node')

    def get_node_posteriors(self, node_handle: int):
        target = self.nodes[node_handle]
        name = self.nodes[node_handle].name
        if isinstance(target, NodeCPT):
            result = {}
            if self.network.get_node_temporal_type(node_handle) == pysmile.NodeTemporalType.PLATE:
                outcome_count = self.network.get_outcome_count(node_handle)
                v = self.network.get_node_value(node_handle)
                outcomes = []
                for step in range(0, self.time_step):
                    outcome_step = {}
                    outcome_step[NODE_CPT_TRUE] = round(v[step * outcome_count], Network.DECIMAL)
                    outcome_step[NODE_CPT_FALSE] = round(1 - outcome_step[NODE_CPT_TRUE], Network.DECIMAL)
                    outcomes.append(outcome_step)
                return {
                    'name': name,
                    'type': NODE_CPT,
                    'outcomes': outcomes,
                    'time_step': self.time_step,
                }
            else:
                posteriors = self.network.get_node_value(node_handle)

                outcome = {}
                for i in range(0, len(posteriors)):
                    outcome[self.network.get_outcome_id(node_handle, i)] = round((posteriors[i]), Network.DECIMAL)
                return {
                    'name': name,
                    'type': NODE_CPT,
                    'outcomes': outcome,
                    'time_step': 1,
                }

    def _auto_set_node_definition(self, init_coverage: dict):
        for node_handle in self.nodes:
            if isinstance(self.nodes[node_handle], NodeCPT) and not self.nodes[node_handle].self_update:
                self._set_new_probability(node_handle, init_coverage)
                node = self.nodes[node_handle]
                parents = self.network.get_parents(node_handle)
                cpt = self._cpt(node_handle, parents)
                self.set_node_definition(node_handle, cpt)
            if isinstance(self.nodes[node_handle], NodeCPTInterval):
                node = self.nodes[node_handle]
                self.set_node_definition(node_handle, [node.probability] * (len(node.intervals) -1))
        self._update_network()

    def get_node_definition_auto(self, node_handle: int):
        parents = self.network.get_parents(node_handle)
        cpt = self._cpt(node_handle, parents)
        return cpt

    def _cpt(self, node_handle, parents):
        n = len(parents)
        # for parent in parents:
        #     print(isinstance(self.nodes[parent], NodeDecision))
        probability = round(self.nodes[node_handle].new_probability, Network.DECIMAL)
        relation = self.nodes[node_handle].relation
        if n == 0:
            result = [probability, round(1 - probability, Network.DECIMAL)]
        else:
            if relation == NodeCPT.OR:
                arr = [None] * (n)
                l = []
                generate_all_binary(n, arr, 0, l)
                l.reverse()
                cpts = []
                for val in l:
                    number_true = 0
                    for i in val:
                        if i == 1:
                            number_true += 1
                    if number_true == 0:
                        cpt = 0
                    else:
                        cpt = 1 - pow(1 - probability, number_true)
                    cpts += [round(cpt, Network.DECIMAL), round(1 - cpt, Network.DECIMAL)]
                result = cpts
            else:
                # TODO: Change AND
                result = [probability, round(1 - probability, Network.DECIMAL)] + [0, 1] * (pow(2, n) - 1)
        return result

    def set_uniform_intervals(self, node_handle, count):
        bounds = self.network.get_node_equation_bounds(node_handle)
        lo = bounds[0]
        hi = bounds[1]
 
        iv = [None] * count
        for i in range(0, count):
            iv[i] = pysmile.DiscretizationInterval("",lo + (i + 1) * (hi - lo) 
                                                      / count)
 
        self.network.set_node_equation_discretization(node_handle, iv)

    

    def print_posteriors(self, net, node_handle):
        node_id = net.get_node_id(node_handle)
        if not isinstance(self.nodes[node_handle], NodeCPT) or not isinstance(self.nodes[node_handle], NodeCPTInterval):
            return 
        if net.is_evidence(node_handle):
            print(node_id + " has evidence set (" +
                  net.get_outcome_id(node_handle, 
                                     net.get_evidence(node_handle)) + ")")
        else :
            posteriors = net.get_node_value(node_handle)
            for i in range(0, len(posteriors)):
                print("P(" + node_id + "=" + 
                      net.get_outcome_id(node_handle, i) +
                      ")=" + str(posteriors[i]))
 
    def print_all_posteriors(self, net):
        for handle in net.get_all_nodes():
            self.print_posteriors(net, handle)

    def print_node_info(self, net, node_handle):
        print("Node id/name: " + net.get_node_id(node_handle) + "/" +
              net.get_node_name(node_handle))
        print("  Outcomes: " + " ".join(net.get_outcome_ids(node_handle)))
       
        parent_ids = net.get_parent_ids(node_handle)
        if len(parent_ids) > 0:
            print("  Parents: " + " ".join(parent_ids))
        child_ids = net.get_child_ids(node_handle)
        if len(child_ids) > 0:
            print("  Children: " + " ".join(child_ids))
        
        self.print_cpt_matrix(net, node_handle)
 
 
    def print_cpt_matrix(self, net, node_handle):
        if isinstance(self.nodes[node_handle], NodeDecision):
            return 
        cpt = net.get_node_definition(node_handle)
        parents = net.get_parents(node_handle)
        dim_count = 1 + len(parents)
        
        dim_sizes = [0] * dim_count
        for i in range(0, dim_count - 1):
            dim_sizes[i] = net.get_outcome_count(parents[i])
        dim_sizes[len(dim_sizes) - 1] = net.get_outcome_count(node_handle)
        
        coords = [0] * dim_count
        for elem_idx in range(0, len(cpt)):
            self.index_to_coords(elem_idx, dim_sizes, coords)
            
            outcome = net.get_outcome_id(node_handle, coords[dim_count - 1])
            out_str = "    P(" + outcome
            
            if dim_count > 1:
                out_str += " | "
                for parent_idx in range(0, len(parents)):
                    if parent_idx > 0: 
                        out_str += ","
                    parent_handle = parents[parent_idx]
                    out_str += net.get_node_id(parent_handle) + "=" + \
                    net.get_outcome_id(parent_handle, coords[parent_idx])
            
            prob = cpt[elem_idx]
            out_str += ")=" + str(prob)
            print(out_str)
 
 
    def index_to_coords(self, index, dim_sizes, coords):
        prod = 1
        for i in range(len(dim_sizes) - 1, -1, -1):
            coords[i] = int(index / prod) % dim_sizes[i]
            prod *= dim_sizes[i]
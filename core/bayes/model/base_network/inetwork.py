import zope.interface
import pysmile
from typing import List
from bayes.model.base_network.node import Node
    
class INetwork(zope.interface.Interface):
    def get_outcome_id(self, node_handle: int, outcome_index: int):
        pass

    def add_link(self, parent_node: Node, child_node: Node):
        pass

    def set_node_definition(self, node_handle: int, definition: list):
        pass

    def set_node_temporal_definition(self, node_handle, def_temporal):
        pass

    def _get_node_by_name(self, name):
        pass

    def _update_network(self):
        pass

    def write_file(self, filename):
        pass

    def load(self, script):
        pass

    def add_node(self, target: Node):
        pass

    def set_node_temporal_type(self, node_handle: int):
        pass

    def _set_new_probability(self, node_handle: int, init_coverage: dict):
        pass

    def get_posteriors(self, node_handle: int):
        pass

    def _auto_set_node_definition(self, init_coverage: dict):
        pass

    def _cpt(self, node_handle, parents):
        pass
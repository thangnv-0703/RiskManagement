from bayes.model.base_network.node import (NodeCPT,NodeDecision)

class NodeDeploymentScenarioCPT(NodeCPT):
    impact: float = 1.0
    is_attacker: bool = False
    is_system: bool = False
    asset_id: str
    cve_id: str

    def __init__(self, name: str, probability: float = 1.0, impact: float = 1.0,
                 relation: str = 'OR', outcomes=None, asset_id=None, cve_id=None):
        super().__init__(name, probability, relation, outcomes)
        self.impact = impact
        self.is_attacker = False
        self.asset_id = asset_id
        self.cve_id = cve_id
    

    def set_attacker(self):
        self.is_attacker = True
        self.is_system = False
        self.cve_id = None
        self.asset_id = None

    def set_system_node(self):
        self.is_attacker = False
        self.is_system = True
        self.cve_id = None
        self.asset_id = None
        self.self_update = True

class NodeDeploymentScenarioDecision(NodeDecision):
    cost: float 
    coverage: float

    def __init__(self, name, cost: float = 0, coverage: float = 0.5, outcomes=None) -> None:
        super().__init__(name)
        self.cost = cost
        self.coverage = coverage
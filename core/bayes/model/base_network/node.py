from bayes.model.constant import (NODE_DECISION_FALSE,
    NODE_DECISION_TRUE, NODE_CPT_TRUE, NODE_CPT_FALSE)
from typing import List

class Node:
    __id = 0
    handle: int
    id: str
    name: str
    outcomes: list = None

    def __init__(self, name) -> None:
        self.id = "Node_{}".format(Node.__id)
        self.name = name
        Node.__id += 1

    @classmethod
    def reset_id(cls):
        cls.__id = 0


class NodeDecision(Node):
    def __init__(self, name, cost: float = 0, coverage: float = 0.5, outcomes=None) -> None:
        super().__init__(name)
        if outcomes is None:
            outcomes = [NODE_DECISION_TRUE, NODE_DECISION_FALSE]
        self.outcomes = outcomes

class NodeCPT(Node):
    OR = 'OR'
    AND = 'AND'
    probability: float
    relation: str = OR
    new_probability: float
    is_attacker: bool = False
    self_update: bool = False

    def __init__(self, name: str, probability: float = 1.0,relation: str = 'OR', outcomes=None):
        if outcomes is None:
            outcomes = [NODE_CPT_TRUE, NODE_CPT_FALSE]
        if relation not in [NodeCPT.OR, NodeCPT.AND]:
            raise Exception('Relation invalid')
        if 0 <= probability <= 1:
            super().__init__(name)
            self.probability = probability
            self.new_probability = probability
            self.relation = relation
            self.outcomes = outcomes
        else:
            raise Exception('Probability invalid')


class NodeUtility(Node):
    value: list

    def __init__(self, name) -> None:
        super().__init__(name)
        self.value = []

class NodeCPTInterval(Node):
    OR = 'OR'
    AND = 'AND'
    probability: float
    relation: str = OR    
    intervals: List[float]
    weight: float

    def __init__(self, name: str, score: float, weight: float, intervals: List[float] = [], outcomes=None, relation: str = 'OR'):
        if outcomes is None:
            outcomes = [NODE_CPT_TRUE, NODE_CPT_FALSE]
        if relation not in [NodeCPT.OR, NodeCPT.AND]:
            raise Exception('Relation invalid')
        super().__init__(name)
        self.probability = 1/ (len(intervals) -1)
        self.weight = weight
        self.score = score
        self.relation = relation
        self.outcomes = outcomes
        self.intervals = intervals

class NodeEquation(Node):
    lo_bound: float
    hi_bound: float
    equation: str
    weight: float

    def __init__(self, name: str, weight:float = 1, hi_bound: float = 1, lo_bound: float = 0):
        super().__init__(name)
        self.hi_bound = hi_bound
        self.lo_bound = lo_bound
        self.weight = weight

    def set_equation(self, equation):
        self.equation = equation

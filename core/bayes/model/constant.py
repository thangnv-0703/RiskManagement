NODE_CPT = 'NODE_CPT'
NODE_DECISION = 'NODE_DECISION'
NODE_UTILITY = 'NODE_UTILITY'
NODE_TEMPORAL = 'NODE_TEMPORAL'

NODE_DECISION_TRUE = 'True'
NODE_DECISION_FALSE = 'False'

NODE_CPT_TRUE = 'True'
NODE_CPT_FALSE = 'False'

NODE_TEMPORAL_TRUE = 'True'
NODE_TEMPORAL_FALSE = 'False'

TYPE_ATTACKER = True
TYPE_CVE = False

outcomes_factor = ["Very_low", "Low", "Medium", "High", "Very_High"]

exploitability_cvss  = {
    'Unproven': 0.85,
    'Proof-of-Concept': 0.9,
    'Functional': 0.95,
    'High': 1.00,
    'Not Defined': 1.00,
}

remediation_level_cvss = {
    'Official Fix': 0.87,
    'Temporary Fix': 0.9,
    'Workaround': 0.95,
    'Unavailable': 1.00,
    'Not Defined': 1.00,
}

report_confidence_cvss = {
    'Unconfirmed': 0.90,
    'Uncorroborated': 0.95,
    'Confirmed': 1.00,
    'Not Defined': 1.00,
}
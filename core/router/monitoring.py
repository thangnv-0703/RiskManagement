from fastapi import Depends, APIRouter, Body, Request
# from router.model.deployment_scenario import DeploymentScenario
from bayes.model.main import DeploymentScenarioBN, DeploymentScenarioDBN

router = APIRouter(tags=['monitoring'])

# Filling param monitoring - use
@router.post('/monitoring')
async def monitoring(request: dict):
    target = request["deployment_scenario"]
    attack_graph = target['attack_graph']
    base_impact = target['base_impact']
    base_benefit = target['base_benefit']
    supplement_config = request["supplement_config"]
    if request['monitor_param']['node_temporals'] == ['All']:
        tmp = []
        for asset_cve in target['cves']:
            tmp.append({
                'asset_id': asset_cve['asset_id'],
                'cves': asset_cve['active'],
            })
        target['temporal_node'] = tmp
    else:
        target['temporal_node'] = request['monitor_param']['node_temporals']
    
    exploitability =  target['exploitability']
    remediation_level = target['remediation_level']
    report_confidence = target['report_confidence']

    observer_factor = dict()
    for observer in request['monitor_param']['observer_factor']:
        observer_factor[observer['factor_id']] = [stepValue['value'] for stepValue in observer['observer_factor']]


    networkPhaseOne = DeploymentScenarioBN(deployment_scenario=target, attack_graph=attack_graph, phase=1,
                                base_impact=base_impact, base_benefit=base_benefit, supplement_config=supplement_config,
                                exploitability=exploitability, remediation_level=remediation_level,report_confidence=report_confidence,)

    networkPhaseTwo = DeploymentScenarioBN(deployment_scenario=target, attack_graph=attack_graph, phase=2,
                                system_likelihood=networkPhaseOne.get_likelihood(),
                                base_impact=base_impact, base_benefit=base_benefit, supplement_config=supplement_config,
                                exploitability=exploitability, remediation_level=remediation_level,report_confidence=report_confidence,)

    network = DeploymentScenarioDBN(
        deployment_scenario=target,
        attack_graph=attack_graph,
        base_impact=base_impact,
        base_benefit=base_benefit,
        system_likelihood=networkPhaseTwo.get_likelihood(),
        phase=3,
        time_step=request['monitor_param']['time_step'],
        observer_data=request['monitor_param']['observer_data'],
        observer_factor=observer_factor,
        exploitability=exploitability, 
        remediation_level=remediation_level,
        report_confidence=report_confidence,
        supplement_config=supplement_config,
    )

    return {
        'status': True,
        'data': {
            'countermeasures': network.get_decisions(),
            'cia': network.get_cia_assets(),
            'severity': network.get_cia_system_asset(),
            'likelihood': network.get_apt_risk_likelihood_dynamic(),
            'security_goals': target['security_goals'],
            'supplement_likelihood': {
                'attacker_capability': network.get_attacker_capability(True),
                'effectiveness_defender': network.get_effectiveness_defender(True),
            },
        }
    }

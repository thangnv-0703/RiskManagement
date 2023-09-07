from fastapi import Depends, APIRouter, Body, Request
# from router.model.deployment_scenario import DeploymentScenario
from bayes.model.main import DeploymentScenarioBN, DeploymentScenarioDBN
import collections.abc

router = APIRouter(tags=['assessment'])

@router.post('/assessment')
async def assessment(request: dict):
    target = request["deployment_scenario"]
    supplement_config = request["supplement_config"]
    attack_graph = target['attack_graph']
    base_impact = target['base_impact']
    base_benefit = target['base_benefit']
    exploitability =  target['exploitability']
    remediation_level = target['remediation_level']
    report_confidence = target['report_confidence']
    networkPhaseOne1 = DeploymentScenarioBN(deployment_scenario=target, attack_graph=attack_graph, phase=1,
                                base_impact=base_impact, base_benefit=base_benefit, supplement_config=supplement_config,
                                exploitability=exploitability, remediation_level=remediation_level,report_confidence=report_confidence,)
    networkPhaseOne2 = DeploymentScenarioBN(deployment_scenario=target, attack_graph=attack_graph, phase=1, is_use_countermeasure=False, 
                                base_impact=base_impact, base_benefit=base_benefit, supplement_config=supplement_config,
                                exploitability=exploitability, remediation_level=remediation_level,report_confidence=report_confidence,)
    
    networkPhaseTwo1 = DeploymentScenarioBN(deployment_scenario=target, attack_graph=attack_graph, phase=2, 
                                system_likelihood=networkPhaseOne1.get_likelihood(),
                                base_impact=base_impact, base_benefit=base_benefit, supplement_config=supplement_config,
                                exploitability=exploitability, remediation_level=remediation_level,report_confidence=report_confidence,)
    networkPhaseTwo2 = DeploymentScenarioBN(deployment_scenario=target, attack_graph=attack_graph, phase=2, is_use_countermeasure=False, 
                                system_likelihood=networkPhaseOne2.get_likelihood(),
                                base_impact=base_impact, base_benefit=base_benefit, supplement_config=supplement_config,
                                exploitability=exploitability, remediation_level=remediation_level,report_confidence=report_confidence,)
    tmp = []
    for asset_cve in target['cves']:
        tmp.append({
            'asset_id': asset_cve['asset_id'],
            'cves': asset_cve['active'],
        })
        target['temporal_node'] = tmp    

    networkPhaseThree1 = DeploymentScenarioDBN(
        deployment_scenario=target,
        attack_graph=attack_graph,
        base_impact=base_impact,
        base_benefit=base_benefit,
        system_likelihood=networkPhaseTwo1.get_likelihood(),
        phase=3,
        time_step=2,
        observer_data=[],
        exploitability=exploitability, 
        remediation_level=remediation_level,
        report_confidence=report_confidence,
        supplement_config=supplement_config,
    )

    networkPhaseThree2 = DeploymentScenarioDBN(
        deployment_scenario=target,
        attack_graph=attack_graph,
        base_impact=base_impact,
        base_benefit=base_benefit,
        system_likelihood=networkPhaseTwo2.get_likelihood(),
        phase=3,
        time_step=2,
        observer_data=[],
        exploitability=exploitability, 
        remediation_level=remediation_level,
        report_confidence=report_confidence,
        supplement_config=supplement_config,
        is_use_countermeasure=False
    )

    countermeasure = networkPhaseThree1.get_decisions()
    not_countermeasure = networkPhaseThree2.get_decisions()

    likelihood_countermeasures = get_likelihood(networkPhaseThree1.get_apt_risk_likelihood_dynamic())
    likelihood_not_countermeasures = get_likelihood(networkPhaseThree2.get_apt_risk_likelihood_dynamic())

    cia_countermeasures = [
        {
            **cia,
            'confidentiality': cia['confidentiality'][len(cia['confidentiality']) - 1],
            'availability': cia['availability'][len(cia['availability']) - 1],
            'integrity': cia['integrity'][len(cia['integrity']) - 1],
            'cia': cia['cia'][len(cia['cia']) - 1],
        } for cia in networkPhaseThree1.get_cia_assets()]

    cia_not_countermeasures = [
        {
            **cia,
            'confidentiality': cia['confidentiality'][len(cia['confidentiality']) - 1],
            'availability': cia['availability'][len(cia['availability']) - 1],
            'integrity': cia['integrity'][len(cia['integrity']) - 1],
            'cia': cia['cia'][len(cia['cia']) - 1],
        } for cia in networkPhaseThree2.get_cia_assets()]

    cia_system_countermeasures = [
        {
            **cia,
            'confidentiality': cia['confidentiality'][len(cia['confidentiality']) - 1],
            'availability': cia['availability'][len(cia['availability']) - 1],
            'integrity': cia['integrity'][len(cia['integrity']) - 1],
            'cia': cia['cia'][len(cia['cia']) - 1],
        } for cia in networkPhaseThree1.get_cia_system_asset()]

    cia_system_not_countermeasures = [
        {
            **cia,
            'confidentiality': cia['confidentiality'][len(cia['confidentiality']) - 1],
            'availability': cia['availability'][len(cia['availability']) - 1],
            'integrity': cia['integrity'][len(cia['integrity']) - 1],
            'cia': cia['cia'][len(cia['cia']) - 1],
        } for cia in networkPhaseThree2.get_cia_system_asset()]

    severity_countermeasures = get_severity(cia_system_countermeasures)
    severity_not_countermeasures = get_severity(cia_system_not_countermeasures)

    suppliment_likelihood = supplement_config and {
        'attacker_capability': networkPhaseThree1.get_attacker_capability(),
        'effectiveness_defender': networkPhaseThree1.get_effectiveness_defender(),
    } or NULL

    return {
        'status': True,
        'data': {
            'countermeasures': [{
                **item,
                'outcomes': item['outcomes'][len(item['outcomes']) - 1]
            } for item in countermeasure],
            'not_countermeasures': [{
                **item,
                'outcomes': item['outcomes'][len(item['outcomes']) - 1]
            } for item in not_countermeasure],
            'cia': {
                'countermeasures':  cia_countermeasures,
                'not_countermeasures': cia_not_countermeasures,
            },
            'risk': {
                'severity': {
                    'countermeasures': severity_countermeasures,
                    'not_countermeasures': severity_not_countermeasures,
                },
                'likelihood': {
                    'countermeasures': likelihood_countermeasures,
                    'not_countermeasures': likelihood_not_countermeasures,
                },
                'risk_level': {
                    'countermeasures': get_risk_level(severity_countermeasures[1], likelihood_countermeasures[1]),
                    'not_countermeasures': get_risk_level(severity_not_countermeasures[1], likelihood_not_countermeasures[1]),
                },
            },
            'suppliment_likelihood': suppliment_likelihood,
            'assets': target['assets'],
            'security_goals': target['security_goals'],
        }
    }


def get_severity(cia: list):
    severity = 0
    for i in range(len(cia)):
        severity += cia[i]['cia']
    severity /= len(cia)
    severity = 9 - severity
    
    if severity <= 1.8:
        return ['Negligible', 1]
    if severity <= 3.6:
        return ['Low', 2]
    if severity <= 5.4:
        return ['Moderate', 3]
    if severity <= 7.2:
        return ['Significant', 4]
    return ['Catastrophic', 5]

def get_likelihood(likelihood: dict):
    if isinstance(likelihood['outcomes'], collections.abc.Sequence):
        lh = likelihood['outcomes'][len(likelihood['outcomes']) - 1]['True']
    else:
        lh = likelihood['outcomes']['True']
    if lh <= 0.2:
        return ['Improbable', 1]
    if lh <= 0.4:
        return ['Remote', 2]
    if lh <= 0.6:
        return ['Occasional', 3]
    if lh <= 0.8:
        return ['Probale', 4]
    return ['Frequent', 5]

def get_risk_level(severity: int, likelihood: int):
    le = severity * likelihood
    if le > 12:
        return ['Critical', 4]  
    if le > 7:
        return ['High', 3]
    if le > 3:
        return ['Medium', 2]
    return ['Low', 1]
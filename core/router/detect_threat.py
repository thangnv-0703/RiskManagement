from fastapi import Depends, APIRouter, Body, Request
from bayes.model.main import DeploymentScenarioBN, DeploymentScenarioDBN
from bayes.model.constant import *
from service_proxy.category_proxy_service import CategoryProxyService
from model.base import BaseResponse
from .handle.exception import CustomHTTPException
from enum import Enum
from typing import List


router = APIRouter(tags=['detect_threat'])
class ThreatType(Enum):
    SPOOFING_IDENTITY = 'Spoofing Identity'
    TAMPERING_WITH_DATA = 'Tampering With Data'
    REPUDIATION_THREATS = 'Repudiation Threats'
    INFORMATION_DISCLOSURE = 'Information Disclosure'
    DENIAL_OF_SERVICE = 'Denial of Service'
    ELEVATION_OF_PRIVILEGES = 'Elevation of Privileges'

def reverse_reasoning(parent_real: float, obs: float, cpts: List[float], decimal: int = 4):
    # cpts = [P(C|A,B), P(C|A,not(B)), P(C|not(A),B), P(C|not(A),not(B))]
    # parent_real = A
    tu = obs - (cpts[1] * parent_real + cpts[3] * (1 - parent_real))
    mau = (cpts[0] * parent_real + cpts[2] * (1 - parent_real)) - (cpts[1] * parent_real + cpts[3] * (1 - parent_real))
    return round(tu / mau, decimal)

@router.post('/detect_threat')
async def detect_threat(request: dict):
    target = request["deployment_scenario"]

    # request = jsonable_encoder(request)
    request['time_step'] = 2
    request['observer_data'] = []
    request['node_temporals'] = ['All']

    flag = False
    for node in target['attack_graph']['nodes']:
        if not node['is_attacker'] and not node['is_asset']:
            if node['cve_id'] == request['cve_id'] and node['asset_id'] == request['asset_id']:
                flag = True
                break
    
    if not flag:
        raise CustomHTTPException(STATUS_404_NOT_FOUND)

    attack_graph = target['attack_graph']
    base_impact = target['base_impact']
    base_benefit = target['base_benefit']
    if request['node_temporals'] == ['All']:
        tmp = []
        for asset_cve in target['cves']:
            tmp.append({
                'asset_id': asset_cve['asset_id'],
                'cves': asset_cve['active'],
            })
        target['temporal_node'] = tmp
    else:
        target['temporal_node'] = request['node_temporals']

    exploitability = exploitability_cvss.get(target['exploitability'], 1.00)
    remediation_level = remediation_level_cvss.get(target['remediation_level'], 1.00)
    report_confidence = report_confidence_cvss.get(target['report_confidence'], 1.00)

    network1 = DeploymentScenarioDBN(
        deployment_scenario=target,
        attack_graph=attack_graph,
        base_impact=base_impact,
        base_benefit=base_benefit,
        time_step=request['time_step'],
        observer_data=request['observer_data'],
        exploitability=target['exploitability'],
        remediation_level=target['remediation_level'],
        report_confidence=target['report_confidence'],
    )

    network = DeploymentScenarioDBN(
        deployment_scenario=target,
        attack_graph=attack_graph,
        base_impact=base_impact,
        base_benefit=base_benefit,
        phase=3,
        time_step=request['time_step'],
        observer_data=request['observer_data'],
        exploitability=target['exploitability'],
        remediation_level=target['remediation_level'],
        report_confidence=target['report_confidence'],
    )

    node_handle = -1
    for handle in network1.nodes:
        if not network1.nodes[handle].is_attacker:
            if network1.nodes[handle].cve_id == request['cve_id'] and network1.nodes[handle].asset_id == request['asset_id']:
                node_handle = handle
                break
    if node_handle == -1:
        raise CustomHTTPException(STATUS_404_NOT_FOUND)
    
    output = network1.get_node_posteriors(node_handle)
    number_parents = len(network1.network.get_parents(node_handle))
    cve = False
    for a_i in target['cves']:
        if a_i['asset_id'] == request['asset_id']:
            for c in a_i['cves']:
                if c['cve_id'] == request['cve_id']:
                    cve = c
                    break
        if cve:
            break

    exploitability_score = cve['impact']['baseMetricV2']['exploitabilityScore'] * exploitability * remediation_level * report_confidence
    prob = exploitability_score / 10

    mer_pob = 1 - pow(1 - prob, number_parents)
    all_pro = 1 - pow(1 - prob, number_parents + 1)
    cpts_merge = [all_pro, prob, mer_pob, 0]

    k = reverse_reasoning(
        parent_real=0,
        obs=output['outcomes'][1][NODE_CPT_TRUE],
        cpts=cpts_merge
    )
    m = reverse_reasoning(
        parent_real=k,
        obs=request['observer_probability'],
        cpts=[all_pro, mer_pob, prob, 0]
    )

    res_data = await CategoryProxyService.get_cves_by_cve_id(request['cve_id'])
    cwe_id = res_data["data"]['cwe_id']


    return BaseResponse(
        data={
            "est": m,
            "outcomes": output['outcomes'],
            "cwe_id": cwe_id,
            "threat_types": MAPPING_CWE_STRIDE.get(cwe_id, [ThreatType.SPOOFING_IDENTITY, ThreatType.TAMPERING_WITH_DATA, ThreatType.REPUDIATION_THREATS, ThreatType.INFORMATION_DISCLOSURE, ThreatType.DENIAL_OF_SERVICE, ThreatType.ELEVATION_OF_PRIVILEGES])
        }
    )



MAPPING_CWE_STRIDE = {
    'CWE-79': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.DENIAL_OF_SERVICE],
    'CWE-787': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.DENIAL_OF_SERVICE],
    'CWE-20': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.DENIAL_OF_SERVICE],
    'CWE-125': [ThreatType.INFORMATION_DISCLOSURE, ThreatType.DENIAL_OF_SERVICE],
    'CWE-119': [ThreatType.INFORMATION_DISCLOSURE, ThreatType.DENIAL_OF_SERVICE],
    'CWE-89': [ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES],
    'CWE-200': [ThreatType.INFORMATION_DISCLOSURE],
    'CWE-416': [ThreatType.DENIAL_OF_SERVICE, ThreatType.TAMPERING_WITH_DATA, ThreatType.INFORMATION_DISCLOSURE],
    'CWE-352': [ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE, ThreatType.DENIAL_OF_SERVICE],
    'CWE-78': [ThreatType.DENIAL_OF_SERVICE, ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.REPUDIATION_THREATS],
    'CWE-190': [ThreatType.DENIAL_OF_SERVICE, ThreatType.TAMPERING_WITH_DATA, ThreatType.ELEVATION_OF_PRIVILEGES],
    'CWE-22': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.TAMPERING_WITH_DATA, ThreatType.INFORMATION_DISCLOSURE, ThreatType.DENIAL_OF_SERVICE],
    'CWE-476': [ThreatType.DENIAL_OF_SERVICE, ThreatType.TAMPERING_WITH_DATA, ThreatType.INFORMATION_DISCLOSURE],
    'CWE-287': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.SPOOFING_IDENTITY],
    'CWE-434': [ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA],
    'CWE-732': [ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.DENIAL_OF_SERVICE],
    'CWE-94': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.SPOOFING_IDENTITY, ThreatType.REPUDIATION_THREATS],
    'CWE-522': [ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES],
    'CWE-611': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.SPOOFING_IDENTITY, ThreatType.DENIAL_OF_SERVICE],
    'CWE-798': [ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE],
    'CWE-502': [ThreatType.TAMPERING_WITH_DATA, ThreatType.DENIAL_OF_SERVICE],
    'CWE-269': [ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES],
    'CWE-400': [ThreatType.DENIAL_OF_SERVICE, ThreatType.ELEVATION_OF_PRIVILEGES],
    'CWE-306': [ThreatType.SPOOFING_IDENTITY, ThreatType.ELEVATION_OF_PRIVILEGES],
    'CWE-862': [ThreatType.ELEVATION_OF_PRIVILEGES, ThreatType.INFORMATION_DISCLOSURE, ThreatType.TAMPERING_WITH_DATA, ThreatType.REPUDIATION_THREATS],
}
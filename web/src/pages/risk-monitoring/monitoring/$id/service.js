// @ts-ignore

import api from '@/services/api';

/* eslint-disable */
export async function postRiskMonitoring(deployment_scenario_id, body, options) {
  return api(`/api/deployment_scenarios/monitoring/${deployment_scenario_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getNodeAttackGraph(deployment_scenario_id, params, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/monitoring/attack_graph_cve`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getAttackGraphDeploymentScenario(id, params, options) {
  return api(`/api/deployment_scenarios/${id}/attack_graph`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export const detectThreat = async (deployment_scenario_id, body, options) => {
  return api(`/api/deployment_scenarios/detect_threat/${deployment_scenario_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
};

export const getCVEonAttackGraph = async (id, params, options) => {
  return api(`/api/deployment_scenarios/${id}/attack_graph`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
};

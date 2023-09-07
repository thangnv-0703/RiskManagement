// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getAssetsInDeploymentScenario(id, params, options) {
  return api(`/api/deployment_scenarios/${id}/assets`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getCountermeasuresInDeploymentScenario(id, params, options) {
  return api(`/api/deployment_scenarios/${id}/countermeasures`, {
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

export async function getVulsInAssetOnAttackGraph(
  deployment_scenario_id,
  asset_id,
  params,
  options,
) {
  return api(
    `/api/deployment_scenarios/${deployment_scenario_id}/attack_graph/assets/${asset_id}/cves`,
    {
      method: 'GET',
      params: { ...params },
      ...(options || {}),
    },
  );
}

export async function updateVulInAssetOnAttackGraph(
  deployment_scenario_id,
  asset_id,
  body,
  options,
) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/assets/${asset_id}/cves`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

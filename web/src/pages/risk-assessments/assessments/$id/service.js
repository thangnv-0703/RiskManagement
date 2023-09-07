// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function postStatisAssessments(deployment_scenario_id, body, options) {
  return api(`/api/deployment_scenarios/assessment/${deployment_scenario_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

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

export async function getVulsInAssetInDeploymentScenario(
  deployment_scenario_id,
  asset_id,
  params,
  options,
) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/assets/${asset_id}/cves`, {
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

export async function selectVulInAssetOnAttackGraph(
  deployment_scenario_id,
  asset_id,
  body,
  options,
) {
  return api(
    `/api/deployment_scenarios/${deployment_scenario_id}/attack_graph/assets/${asset_id}/cves`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

export async function saveRiskAssessment(deployment_scenario_id, body, options) {
  return api(`/api/assessment_result/deployment_scenarios/${deployment_scenario_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getAptRiskSetting(deployment_scenario_id, params, options) {
  return api(`/api/supplement_apt_risk/factor/${deployment_scenario_id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function saveAptRiskSetting(deployment_scenario_id, body, options) {
  return api(`/api/supplement_apt_risk/factor/${deployment_scenario_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

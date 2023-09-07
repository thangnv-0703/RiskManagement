// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getDeploymentScenarioBySystemProfile(system_profile_id, params, options) {
  return api(`/api/system_profiles/${system_profile_id}/deployment_scenarios`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function postScanVulnerability(deployment_scenario_id, body, options) {
  return api(`/api/deployment_scenarios/scan_vulnerability/${deployment_scenario_id}`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

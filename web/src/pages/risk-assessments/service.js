// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getSystemProfilesWithDeploymentScenarios(params, options) {
  return api('/api/system_profiles/deployment_scenarios', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getHistoryAssessmentDeploymentScenario(
  deployment_scenario_id,
  params,
  options,
) {
  return api(`/api/assessment_result/deployment_scenarios/${deployment_scenario_id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getDeploymentScenarioBySystemProfile(system_profile_id, params, options) {
  return api(`/api/system_profiles/${system_profile_id}/deployment_scenarios`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

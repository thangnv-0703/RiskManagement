// @ts-ignore

import api from "@/services/api";

/* eslint-disable */

export async function getCountermeasures(deployment_scenario_id, params, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/countermeasures`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getCountermeasure(deployment_scenario_id, id, params, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/countermeasures/${id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createCountermeasure(deployment_scenario_id, data, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/countermeasures`, {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateCountermeasure(deployment_scenario_id, id, data, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/countermeasures/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteCountermeasure(deployment_scenario_id, id, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/countermeasures/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
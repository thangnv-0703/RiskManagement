// @ts-ignore

import api from "@/services/api";

/* eslint-disable */

export async function getAttackers(deployment_scenario_id, params, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/attackers`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getAttacker(deployment_scenario_id, id, params, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/attackers/${id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createAttacker(deployment_scenario_id, data, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/attackers`, {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateAttacker(deployment_scenario_id, id, data, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/attackers/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteAttacker(deployment_scenario_id, id, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/attackers/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
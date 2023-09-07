// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getDeploymentScenarios(params, options) {
  return api('/api/deployment_scenarios', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getDeploymentScenario(id, params, options) {
  return api(`/api/deployment_scenarios/${id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createDeploymentScenario(data, options) {
  return api('/api/deployment_scenarios', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateDeploymentScenario(id, data, options) {
  return api(`/api/deployment_scenarios/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteDeploymentScenario(id, options) {
  return api(`/api/deployment_scenarios/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function updateDeploymentScenarioOneAsset(id, asset_id, data, options) {
  return api(`/api/deployment_scenarios/${id}/assets/${asset_id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function generateCoordinates(body, options) {
  return api(`/api/deployment_scenarios/generate_coordinates`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function mappingCPE(params, options) {
  return api('/api/deployment_scenarios/mapping_cpe', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function getCVEonAsset(id, asset_id, params, options) {
  return api(`/api/deployment_scenarios/${id}/assets/${asset_id}/cves`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

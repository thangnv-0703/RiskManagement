// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getAssets(params, options) {
  return api('/api/asset/all-asset', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createAsset(data, options) {
  return api('/api/assets', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateAsset(id, data, options) {
  return api(`/api/assets/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteAsset(id, options) {
  return api(`/api/assets/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

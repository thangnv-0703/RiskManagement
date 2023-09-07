// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getHardwareModels(params, options) {
  const response = await api('/api/asset/hardware-model', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createHardwareModel(data, options) {
  try {
    return api('/api/asset/hardware-model', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateHardwareModel(data, options) {
  return api('/api/asset/hardware-model', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteHardwareModel(data, options) {
  return api('/api/asset/hardware-model', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getHardwares(params, options) {
  const response = await api('/api/asset/hardware', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createHardware(data, options) {
  try {
    return api('/api/asset/hardware', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateHardware(data, options) {
  return api('/api/asset/hardware', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteHardware(data, options) {
  return api('/api/asset/hardware', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getOSes(params, options) {
  const response = await api('/api/asset/os', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createOS(data, options) {
  try {
    return api('/api/asset/os', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateOS(data, options) {
  return api('/api/asset/os', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteOS(data, options) {
  return api('/api/asset/os/', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

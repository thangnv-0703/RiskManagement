// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getStatuses(params, options) {
  const response = await api('/api/asset/status', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createStatus(data, options) {
  try {
    return api('/api/asset/status', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateStatus(data, options) {
  return api('/api/asset/status', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteStatus(data, options) {
  return api('/api/asset/status', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getDeprecations(params, options) {
  const response = await api('/api/asset/deprecation', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createDeprecation(data, options) {
  try {
    return api('/api/asset/deprecation', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateDeprecation(data, options) {
  return api('/api/asset/deprecation', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteDeprecation(data, options) {
  return api('/api/asset/deprecation', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

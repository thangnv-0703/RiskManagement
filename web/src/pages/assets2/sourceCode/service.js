// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getSourceCodes(params, options) {
  const response = await api('/api/asset/source-code', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createSourceCode(data, options) {
  try {
    return api('/api/asset/source-code', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateSourceCode(data, options) {
  return api('/api/asset/source-code', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteSourceCode(data, options) {
  return api('/api/asset/source-code', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getDigitalContents(params, options) {
  const response = await api('/api/asset/digital-content', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createDigitalContent(data, options) {
  try {
    return api('/api/asset/digital-content', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateDigitalContent(data, options) {
  return api('/api/asset/digital-content', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteDigitalContent(data, options) {
  return api('/api/asset/digital-content', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getLicenses(params, options) {
  const response = await api('/api/asset/license', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createLicense(data, options) {
  try {
    return api('/api/asset/license', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateLicense(data, options) {
  return api('/api/asset/license', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteLicense(data, options) {
  return api('/api/asset/license', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

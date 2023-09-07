// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getApplications(params, options) {
  const response = await api('/api/asset/application', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  return response;
}

export async function createApplication(data, options) {
  try {
    return api('/api/asset/application', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateApplication(data, options) {
  return api('/api/asset/application', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteApplication(data, options) {
  return api('/api/asset/application/', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

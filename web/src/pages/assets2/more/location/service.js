// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getLocations(params, options) {
  const response = await api('/api/asset/location', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createLocation(data, options) {
  try {
    return api('/api/asset/location', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateLocation(data, options) {
  return api('/api/asset/location', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteLocation(data, options) {
  return api('/api/asset/location/', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

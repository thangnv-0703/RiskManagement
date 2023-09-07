// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getManufacturers(params, options) {
  const response = await api('/api/asset/manufacturer', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createManufacturer(data, options) {
  try {
    return api('/api/asset/manufacturer', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateManufacturer(data, options) {
  return api('/api/asset/manufacturer', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteManufacturer(data, options) {
  return api('/api/asset/manufacturer', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

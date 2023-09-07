// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getSuppliers(params, options) {
  const response = await api('/api/asset/supplier', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createSupplier(data, options) {
  try {
    return api('/api/asset/supplier', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateSupplier(data, options) {
  return api('/api/asset/supplier', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteSupplier(data, options) {
  return api('/api/asset/supplier', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

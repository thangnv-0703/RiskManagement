// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getCategories(params, options) {
  const response = await api('/api/asset/category', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
  // console.log(response);
  return response;
}

export async function createCategory(data, options) {
  try {
    return api('/api/asset/category', {
      data,
      method: 'POST',
      ...(options || {}),
    });
  } catch (err) {
    console.log(err);
  }
}

export async function updateCategory(data, options) {
  return api('/api/asset/category', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteCategory(data, options) {
  return api('/api/asset/category', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

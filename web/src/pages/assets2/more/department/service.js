// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getDepartments(params, options) {
  return api('/api/asset/department', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createDepartment(data, options) {
  return api('/api/asset/department', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateDepartment(data, options) {
  return api('/api/asset/department', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteDepartment(data, options) {
  return api('/api/asset/department/', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

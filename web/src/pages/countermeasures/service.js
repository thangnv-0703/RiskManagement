// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getCountermeasures(params, options) {
  return api('/api/countermeasures', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createCountermeasure(data, options) {
  return api('/api/countermeasures', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateCountermeasure(id, data, options) {
  return api(`/api/countermeasures/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteCountermeasure(id, options) {
  return api(`/api/countermeasures/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getSystemProfiles(params, options) {
  return api('/api/system_profiles', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createSystemProfile(data, options) {
  return api('/api/system_profiles', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateSystemProfile(id, data, options) {
  return api(`/api/system_profiles/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteSystemProfile(id, options) {
  return api(`/api/system_profiles/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}

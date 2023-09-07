// @ts-ignore

import api from '@/services/api';

export async function getSystemProfile(id, params, options) {
  return api(`/api/system_profiles/${id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

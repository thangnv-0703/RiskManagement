// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function cve(params, options) {
  return api('/api/cves', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

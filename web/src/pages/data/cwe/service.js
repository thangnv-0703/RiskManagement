// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function cwe(params, options) {
  return api('/api/cwes', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

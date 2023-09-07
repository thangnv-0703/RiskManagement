// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getCVE(cve_id, params, options) {
  return api(`/api/cves/${cve_id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

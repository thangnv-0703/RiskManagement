// @ts-ignore

import api from "@/services/api";

/* eslint-disable */

export async function getCWE(cwe_id, params, options) {
  return api(`/api/cwes/${cwe_id}`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

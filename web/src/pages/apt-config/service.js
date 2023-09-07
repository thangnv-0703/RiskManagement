// @ts-ignore

import api from '@/services/api';

/* eslint-disable */

export async function getAptConfig(params, options) {
  return api(`/api/supplement_apt_risk/config`, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function saveAptConfig(body, options) {
  return api(`/api/supplement_apt_risk/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

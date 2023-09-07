// @ts-ignore

import api from "@/services/api";

/* eslint-disable */

export async function getUsers(params, options) {
  return api('/api/admin/users', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

export async function createUser(data, options) {
  return api('/api/admin/users', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function updateUser(id, data, options) {
  return api(`/api/admin/users/${id}`, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function deleteUser(id, options) {
  return api(`/api/admin/users/${id}`, {
    method: 'DELETE',
    ...(options || {}),
  });
}
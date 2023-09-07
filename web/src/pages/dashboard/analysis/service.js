import api from '@/services/api';

export async function getDashboardData(params, options) {
  return await api('/api/dashboard', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}

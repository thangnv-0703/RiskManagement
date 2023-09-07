import api from '@/services/api';

export async function getDeploymentScenarioByAssetId(id, options) {
  return api(`/api/asset/asset-deployment/${id}`, {
    method: 'GET',
    ...(options || {}),
  });
}

// @ts-ignore

import api from "@/services/api";

/* eslint-disable */

export async function updateAttackGraph(deployment_scenario_id, body, options) {
  return api(`/api/deployment_scenarios/${deployment_scenario_id}/attack_graph`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
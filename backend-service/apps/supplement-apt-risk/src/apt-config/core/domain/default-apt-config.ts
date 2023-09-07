import {
  AggregateFunction,
  AptConfig,
  AttackerCapabilityType,
  EffectivenessDefenderType,
} from './apt-config';

export const defaultAptConfig: Partial<AptConfig> = {
  attackerAggregateFunction: AggregateFunction.Mean,
  defenderAggregateFunction: AggregateFunction.Mean,
  attackerVariationRate: 0.3,
  defenderVariationRate: 0.3,
  userId: null,
  attackerCapabilityDefault: [
    {
      name: 'Specialist_Expertise',
      type: AttackerCapabilityType.Mean,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Knowledge_Of_The_System',
      type: AttackerCapabilityType.Mean,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Equipment_And_Tools',
      type: AttackerCapabilityType.Mean,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Elapsed_Time',
      type: AttackerCapabilityType.Opportunity,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Window_Of_Opportunity',
      type: AttackerCapabilityType.Opportunity,
      weight: 1.0,
      score: 5.0,
    },
  ],
  effectivenessDefenderDefault: [
    {
      name: 'Security_Awareness_Training',
      type: EffectivenessDefenderType.Organizational,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Security_Monitoring',
      type: EffectivenessDefenderType.Technical,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Vulnerability_Management',
      type: EffectivenessDefenderType.Technical,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Incident_Response_Plan',
      type: EffectivenessDefenderType.Organizational,
      weight: 1.0,
      score: 5.0,
    },
    {
      name: 'Log_Management',
      type: EffectivenessDefenderType.Technical,
      weight: 1.0,
      score: 5.0,
    },
  ],
};

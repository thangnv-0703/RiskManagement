class Factor<T> {
  type: T;
  name: string;
  weight: number;
  score: number;
}

export enum AttackerCapabilityType {
  Opportunity = 'opportunity',
  Mean = 'mean',
}

export enum EffectivenessDefenderType {
  Technical = 'technical',
  Organizational = 'organizational',
}

export class AttackerCapabilityFactor extends Factor<AttackerCapabilityType> {}

export class EffectivenessDefenderFactor extends Factor<EffectivenessDefenderType> {}

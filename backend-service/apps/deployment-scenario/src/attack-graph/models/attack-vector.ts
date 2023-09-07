export enum AttackVector {
  PHYSICAL = 5,
  LOCAL = 4,
  ADJACENT_NETWORK = 3,
  NETWORK = 2,
  NONE = 1,
}

export const ConvertAttackVectors = {
  NETWORK: AttackVector.NETWORK,
  ADJACENT_NETWORK: AttackVector.ADJACENT_NETWORK,
  LOCAL: AttackVector.LOCAL,
  PHYSICAL: AttackVector.PHYSICAL,
};

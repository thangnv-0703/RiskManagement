export enum ExploitabilityCVSS {
  Unproven = 'Unproven',
  ProofOfConcept = 'Proof-of-Concept',
  Functional = 'Functional',
  High = 'High',
  NotDefined = 'Not Defined',
}

export enum RemediationLevelCVSS {
  OfficialFix = 'Official Fix',
  TemporaryFix = 'Temporary Fix',
  Workaround = 'Workaround',
  Unavailable = 'Unavailable',
  NotDefined = 'Not Defined',
}

export enum ReportConfidenceCVSS {
  Unconfirmed = 'Unconfirmed',
  Uncorroborated = 'Uncorroborated',
  Confirmed = 'Confirmed',
  NotDefined = 'Not Defined',
}

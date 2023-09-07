export const KEY_DATA_GRAPH = 'dataGraph';
export const KEY_AUTH_TOKEN = 'AUTH_TOKEN';

export const NODE_UTILITY = 'NODE_UTILITY';
export const NODE_CPT = 'NODE_CPT';
export const NODE_DECISION = 'NODE_DECISION';

export const NODE_DECISION_TRUE = 'True';
export const NODE_DECISION_FALSE = 'False';
export const MAX_INT = Number.MAX_SAFE_INTEGER;

export const DEPLOYMENT_SCENARIO_REQUIREMENTS_ANALYSIS = 'Requirements Analysis';
export const DEPLOYMENT_SCENARIO_DEPLOYMENTS = 'Deployments';
export const DEPLOYMENT_SCENARIO_OPERATIONS = 'Operations';
export const DEPLOYMENT_SCENARIO_STAGE = ['Requirements Analysis', 'Deployments', 'Operations'];

export const CRITICAL_COLOR = '#D01117';
export const HIGH_COLOR = '#EA6913 ';
export const MEDIUM_COLOR = '#EC9D15';
export const LOW_COLOR = '#41C545';
export const UNDER_LOW_COLOR = '#2E8EAE';

export const AV_LOCAL = 'LOCAL';
export const AV_PHYSICAL = 'PHYSICAL';
export const AV_ADJACENT_NETWORK = 'ADJACENT_NETWORK';
export const AV_NETWORK = 'NETWORK';

export const PR_NONE = 'NONE';
export const PR_OS_USER = 'OS_USER';
export const PR_OS_ADMIN = 'OS_ADMIN';
export const PR_APP_USER = 'APP_USER';
export const PR_APP_ADMIN = 'APP_ADMIN';

export const ASSET_OS = 'OS';
export const ASSET_APPLICATION = 'APPLICATION';
export const ASSET_HARDWARE = 'HARDWARE';

export const AV_ALL = [AV_NETWORK, AV_ADJACENT_NETWORK, AV_LOCAL, AV_PHYSICAL];
export const PR_ALL = [PR_NONE, PR_APP_USER, PR_APP_ADMIN, PR_OS_USER, PR_OS_ADMIN];

export const ROLE_ADMIN = 'ADMIN';
export const ROLE_USER = 'USER';

export const SEVERITY_LIST = [
  {
    type: 'Negligible',
    value: 1,
  },
  {
    type: 'Low',
    value: 2,
  },
  {
    type: 'Moderate',
    value: 3,
  },
  {
    type: 'Significant',
    value: 4,
  },
  {
    type: 'Catastrophic',
    value: 5,
  },
];

export const LIKELIHOOD_LIST = [
  {
    type: 'Improbable',
    value: 1,
  },
  {
    type: 'Remote',
    value: 2,
  },
  {
    type: 'Occasional',
    value: 3,
  },
  {
    type: 'Probale',
    value: 4,
  },
  {
    type: 'Frequent',
    value: 5,
  },
];

export const RISK_LEVEL_LIST = [
  {
    type: 'Low',
    value: 1,
    min: -1,
    max: 3,
  },
  {
    type: 'Medium',
    value: 2,
    min: 4,
    max: 6,
  },
  {
    type: 'High',
    value: 3,
    min: 8,
    max: 12,
  },
  {
    type: 'Critical',
    value: 4,
    min: 15,
    max: 100,
  },
];

export const RISK_MATRIX = [
  {
    'Risk level': 'Low',
    Likelihood: 'Improbable',
    Severity: 'Negligible',
    value: 1,
  },
  {
    'Risk level': 'Low',
    Likelihood: 'Improbable',
    Severity: 'Low',
    value: 2,
  },
  {
    'Risk level': 'Low',
    Likelihood: 'Improbable',
    Severity: 'Moderate',
    value: 3,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Improbable',
    Severity: 'Significant',
    value: 4,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Improbable',
    Severity: 'Catastrophic',
    value: 5,
  },
  {
    'Risk level': 'Low',
    Likelihood: 'Remote',
    Severity: 'Negligible',
    value: 2,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Remote',
    Severity: 'Low',
    value: 4,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Remote',
    Severity: 'Moderate',
    value: 6,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Remote',
    Severity: 'Significant',
    value: 8,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Remote',
    Severity: 'Catastrophic',
    value: 10,
  },
  {
    'Risk level': 'Low',
    Likelihood: 'Occasional',
    Severity: 'Negligible',
    value: 3,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Occasional',
    Severity: 'Low',
    value: 6,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Occasional',
    Severity: 'Moderate',
    value: 9,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Occasional',
    Severity: 'Significant',
    value: 12,
  },
  {
    'Risk level': 'Critical',
    Likelihood: 'Occasional',
    Severity: 'Catastrophic',
    value: 15,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Probale',
    Severity: 'Negligible',
    value: 4,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Probale',
    Severity: 'Low',
    value: 8,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Probale',
    Severity: 'Moderate',
    value: 12,
  },
  {
    'Risk level': 'Critical',
    Likelihood: 'Probale',
    Severity: 'Significant',
    value: 16,
  },
  {
    'Risk level': 'Critical',
    Likelihood: 'Probale',
    Severity: 'Catastrophic',
    value: 20,
  },
  {
    'Risk level': 'Medium',
    Likelihood: 'Frequent',
    Severity: 'Negligible',
    value: 5,
  },
  {
    'Risk level': 'High',
    Likelihood: 'Frequent',
    Severity: 'Low',
    value: 10,
  },
  {
    'Risk level': 'Critical',
    Likelihood: 'Frequent',
    Severity: 'Moderate',
    value: 15,
  },
  {
    'Risk level': 'Critical',
    Likelihood: 'Frequent',
    Severity: 'Significant',
    value: 20,
  },
  {
    'Risk level': 'Critical',
    Likelihood: 'Frequent',
    Severity: 'Catastrophic',
    value: 25,
  },
];

export const VULNERABILITY_LIST = [
  {
    type: 'None',
    value: 1,
    color: UNDER_LOW_COLOR,
  },
  {
    type: 'Low',
    value: 2,
    color: LOW_COLOR,
  },
  {
    type: 'Medium',
    value: 3,
    color: MEDIUM_COLOR,
  },
  {
    type: 'High',
    value: 4,
    color: HIGH_COLOR,
  },
  {
    type: 'Critical',
    value: 5,
    color: CRITICAL_COLOR,
  },
];

export const STRIDE_S = 'Spoofing Identity';
export const STRIDE_T = 'Tampering With Data';
export const STRIDE_R = 'Repudiation Threats';
export const STRIDE_I = 'Information Disclosure';
export const STRIDE_D = 'Denial of Service';
export const STRIDE_E = 'Elevation of Privileges';

export const ATTACKER_TYPE = [
  'Spoofing Identity',
  'Tampering With Data',
  'Repudiation Threats',
  'Information Disclosure',
  'Denial of Service',
  'Elevation of Privileges',
];

export const EXPLOITABILITY = [
  {
    type: 'Unproven',
    value: 0.85,
  },
  {
    type: 'Proof-of-Concept',
    value: 0.9,
  },
  {
    type: 'Functional',
    value: 0.95,
  },
  {
    type: 'High',
    value: 1.0,
  },
  {
    type: 'Not Defined',
    value: 1.0,
  },
];
export const REMEDIATION_LEVEL = [
  {
    type: 'Official Fix',
    value: 0.87,
  },
  {
    type: 'Temporary Fix',
    value: 0.9,
  },
  {
    type: 'Workaround',
    value: 0.95,
  },
  {
    type: 'Unavailable',
    value: 1.0,
  },
  {
    type: 'Not Defined',
    value: 1.0,
  },
];
export const REPORT_CONFIDENCE = [
  {
    type: 'Unconfirmed',
    value: 0.9,
  },
  {
    type: 'Uncorroborated',
    value: 0.95,
  },
  {
    type: 'Confirmed',
    value: 1.0,
  },
  {
    type: 'Not Defined',
    value: 1.0,
  },
];

export const AGGREGATE_FUNCTION = [
  {
    display: 'Mean',
    value: 'mean',
  },
  {
    display: 'Min',
    value: 'min',
  },
  {
    display: 'Max',
    value: 'max',
  },
];

export const FACTOR_DESCRIPTION = {
  Security_Monitoring: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Ineffective or absent monitoring measures.',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Basic monitoring with limited updates.',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Continuously reviewed and updated security protocols.',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Advanced monitoring with real-time alerting and response capabilities.',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description: 'Cutting-edge program with advanced analytic',
    },
  ],

  Vulnerability_Management: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Ineffective or absent vulnerability assessment practices.',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Foundational vulnerability management, infrequently updates.',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Regularly reviewed and updated vulnerability mitigation strategies.',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Automated scanning and prioritization.',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description:
        'Exceptional program with continuous monitoring and real-time mitigation strategies.',
    },
  ],

  Log_Management: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Lack of centralized log storage',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Basic log management, intermittent review and analysis.',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Consistently reviewed, analyzed logs for security purposes.',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Log management with real-time monitoring, proactive alerting.',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description:
        'Cutting-edge program with automated analysis and correlation across systems/devices.',
    },
  ],

  Security_Awareness_Training: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Inadequate or absent training measures.',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Foundational training with limited updates.',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Consistently effective and updated training practices.',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Tailored and progressive training for specific roles.',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description:
        'Comprehensive program with ongoing reinforcement and robust performance metrics',
    },
  ],

  Incident_Response_Plan: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Nonexistent or outdated incident handling procedures.',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Basic incident response plan with occasional updates.',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Continuously reviewed, updated incident resolution strategies.',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Incident response plan with clear roles and communication',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description: 'Exemplary program: regular testing, continuous improvement',
    },
  ],
  Specialist_Expertise: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Layman - no particular expertise',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Professional - familiar with security behavior',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description:
        'Expert - can define new attack and tools, possess knowledge of the system similar to the developer',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Multiple expert',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description:
        'Highest level of expertise, possesses unparalleled knowledge and skillsets in the domain',
    },
  ],

  Knowledge_Of_The_System: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Public - information in public domain',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Restricted - asset which are available during the various phase of development',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Sensitive - high level design and low level design information',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      descriptionq: 'Critical - implementation representation(design and source code)',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description:
        'Very critical - access requires enormous and time consuming effort which would make detection likely even with the support from an insider',
    },
  ],

  Equipment_And_Tools: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Cheap equipment or scrip available on the internet',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: 'Expensive equipment',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: 'Available only to experts',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'Not available',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description: 'Top-tier tools and equipment, highly sophisticated and rare',
    },
  ],

  Elapsed_Time: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'few minutes to an hour',
    },
    {
      scoreRange: '2.1 - 4 ',
      state: 'Low',
      description: '1 day',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: '1 month',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: 'half year',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description: '1 year',
    },
  ],

  Window_Of_Opportunity: [
    {
      scoreRange: '0 - 2',
      state: 'Very Low',
      description: 'Unlimited',
    },
    {
      scoreRange: '2.1 - 4',
      state: 'Low',
      description: '1 year',
    },
    {
      scoreRange: '4.1 - 6',
      state: 'Medium',
      description: '1 month',
    },
    {
      scoreRange: '6.1 - 8',
      state: 'High',
      description: '1 day',
    },
    {
      scoreRange: '8.1 - 10',
      state: 'Very High',
      description: 'few minutes',
    },
  ],
};

export const ATTACKER_CAPABILITY_FACTOR = [
  {
    name: 'Specialist_Expertise',
    description: 'Generic technical knowledge required for the attack',
  },
  {
    name: 'Knowledge_Of_The_System',
    description:
      'Specific knowledge the understanding of the target system’s architecture, vulnerabilities, and weaknesses',
  },
  {
    name: 'Equipment_And_Tools',
    description: 'Software or hardware required for the attack',
  },
  {
    name: 'Elapsed_Time',
    description: 'Estimated time required by the attacker to mount the attack',
  },
  {
    name: 'Window_Of_Opportunity',
    description:
      'Number of samples that the attacker can obtain or number of attacks without identification',
  },
];

export const EFFECTIVENESS_OF_DEFENDER_FACTOR = [
  {
    name: 'Security_Monitoring',
    description:
      'The effectiveness of monitoring systems to detect and respond to security incidents.',
  },
  {
    name: 'Log_Management',
    description:
      'The capability to collect, store, and analyze system logs for identifying potential security breaches.',
  },
  {
    name: 'Vulnerability_Management',
    description: 'The ability to identify, assess, and remediate vulnerabilities in the system.',
  },
  {
    name: 'Security_Awareness_Training',
    description:
      'The level of training and awareness among employees regarding security best practices and potential threats.',
  },
  {
    name: 'Incident_Response_Plan',
    description:
      'The existence and effectiveness of a documented plan for responding to and mitigating security incidents.',
  },
];

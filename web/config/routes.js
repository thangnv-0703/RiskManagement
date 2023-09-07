export default [
  // {
  //   path: '/404',
  //   component: '404',
  // },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/Login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: 'dashboard',
    component: './dashboard/analysis',
    access: 'user',
  },
  {
    icon: 'table',
    name: 'System profiles',
    path: '/system-profiles',
    component: './system-profiles/list',
    access: 'user',
  },
  // {
  //   name: 'Assets',
  //   icon: 'appstore',
  //   path: '/assets',
  //   component: './assets',
  //   access: 'user',
  // },
  {
    name: 'Assets',
    icon: 'appstore',
    path: '/assets',
    access: 'user',
    routes: [
      {
        path: '/assets',
        redirect: '/assets2/dashboard',
      },
      {
        name: 'Asset Dashboard',
        icon: 'smile',
        path: '/assets/dashboard',
        component: './assets2/dashboard',
      },
      {
        name: 'Hardware',
        icon: 'smile',
        path: '/assets/hardware',
        component: './assets2/hardware',
      },
      {
        name: 'Application',
        icon: 'smile',
        path: '/assets/application',
        component: './assets2/application',
      },
      {
        name: 'Operation System',
        icon: 'smile',
        path: '/assets/os',
        component: './assets2/os',
      },
      {
        name: 'Source Code',
        icon: 'smile',
        path: '/assets/source-code',
        component: './assets2/sourceCode',
      },
      {
        name: 'Digital Content',
        icon: 'smile',
        path: '/assets/digital-content',
        component: './assets2/digitalContent',
      },
      {
        name: 'License',
        icon: 'smile',
        path: '/assets/license',
        component: './assets2/license',
      },
      {
        name: 'More',
        icon: 'smile',
        path: '/assets/more',
        routes: [
          {
            path: '/assets/more',
            redirect: '/assets2/more/location',
          },
          {
            name: 'Location',
            path: '/assets/more/location',
            component: './assets2/more/location',
          },
          {
            name: 'Department',
            path: '/assets/more/department',
            component: './assets2/more/department',
          },
          {
            name: 'Supplier',
            path: '/assets/more/supplier',
            component: './assets2/more/supplier',
          },
          {
            name: 'Manufacturer',
            path: '/assets/more/manufacturer',
            component: './assets2/more/manufacturer',
          },
          {
            name: 'Category',
            path: '/assets/more/category',
            component: './assets2/more/category',
          },
          {
            name: 'Hardware Model',
            path: '/assets/more/hardware_model',
            component: './assets2/more/hardwareModel',
          },
          {
            name: 'Status',
            path: '/assets/more/status',
            component: './assets2/more/status',
          },
          {
            name: 'Deprecation',
            path: '/assets/more/deprecation',
            component: './assets2/more/deprecation',
          },
        ],
      },
    ],
  },
  {
    name: 'Countermeasures',
    icon: 'safety-certificate',
    path: '/countermeasures',
    component: './countermeasures',
    access: 'user',
  },
  {
    name: 'Deployment scenarios',
    icon: 'pushpin',
    path: '/deployment-scenarios',
    component: './deployment-scenarios',
    access: 'user',
  },
  {
    name: 'APT configuration',
    path: '/apt-configuration',
    icon: 'smile',
    component: './apt-config',
    access: 'user',
  },
  {
    name: 'Risk assessment',
    icon: 'security-scan',
    path: '/risk-assessments',
    component: './risk-assessments',
    access: 'user',
  },
  {
    name: 'Risk monitoring',
    icon: 'monitor',
    path: '/risk-monitoring',
    component: './risk-monitoring',
    access: 'user',
  },
  {
    path: '/data/cve/:id',
    component: './data/cve/$id',
  },
  {
    path: '/data/cwe/:id',
    component: './data/cwe/$id',
  },
  {
    name: 'User managerment',
    icon: 'team',
    path: '/admin/users',
    component: './admin/users',
    access: 'admin',
  },
  {
    path: '/data',
    name: 'data',
    icon: 'dashboard',
    routes: [
      {
        path: '/data',
        redirect: '/data/cwe',
      },
      {
        name: 'cve',
        icon: 'smile',
        path: '/data/cve',
        component: './data/cve',
      },
      {
        name: 'cwe',
        icon: 'smile',
        path: '/data/cwe',
        component: './data/cwe',
      },
    ],
  },
  {
    path: '/system-profiles/:id',
    component: './system-profiles/$id',
    access: 'user',
  },
  {
    path: '/deployment-scenarios/mapping/:id',
    component: './deployment-scenarios/mapping/$id',
    access: 'user',
  },
  {
    path: '/deployment-scenarios/:id',
    component: './deployment-scenarios/$id',
    access: 'user',
  },
  {
    path: '/risk-assessments/assessments/:id',
    component: './risk-assessments/assessments/$id',
    access: 'user',
  },
  {
    path: '/risk-assessments/:id',
    component: './risk-assessments/$id',
    access: 'user',
  },
  {
    path: '/risk-monitoring/monitoring/:id',
    component: './risk-monitoring/monitoring/$id',
    access: 'user',
  },
  // {
  //   path: '/deployment-scenarios/assessments/:id',
  //   component: './deployment-scenarios/assessments/$id',
  // },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: '404',
  },
];

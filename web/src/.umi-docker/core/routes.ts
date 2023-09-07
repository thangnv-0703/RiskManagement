// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/web/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: '.umi-docker__plugin-layout__Layout' */'/web/src/.umi-docker/plugin-layout/Layout.tsx'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/user",
        "layout": false,
        "routes": [
          {
            "path": "/user/login",
            "layout": false,
            "name": "login",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__Login' */'/web/src/pages/user/Login'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "path": "/user",
            "redirect": "/user/login",
            "exact": true
          },
          {
            "name": "register-result",
            "icon": "smile",
            "path": "/user/register-result",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__register-result' */'/web/src/pages/user/register-result'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "name": "register",
            "icon": "smile",
            "path": "/user/register",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__register' */'/web/src/pages/user/register'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/web/src/pages/404'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "path": "/dashboard",
        "name": "Dashboard",
        "icon": "dashboard",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__dashboard__analysis' */'/web/src/pages/dashboard/analysis'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "icon": "table",
        "name": "System profiles",
        "path": "/system-profiles",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__system-profiles__list' */'/web/src/pages/system-profiles/list'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "name": "Assets",
        "icon": "appstore",
        "path": "/assets",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__assets' */'/web/src/pages/assets'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "name": "Countermeasures",
        "icon": "safety-certificate",
        "path": "/countermeasures",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__countermeasures' */'/web/src/pages/countermeasures'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "name": "Deployment scenarios",
        "icon": "pushpin",
        "path": "/deployment-scenarios",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__deployment-scenarios' */'/web/src/pages/deployment-scenarios'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "name": "APT configuration",
        "path": "/apt-configuration",
        "icon": "smile",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__apt-config' */'/web/src/pages/apt-config'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "name": "Risk assessment",
        "icon": "security-scan",
        "path": "/risk-assessments",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk-assessments' */'/web/src/pages/risk-assessments'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "name": "Risk monitoring",
        "icon": "monitor",
        "path": "/risk-monitoring",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk-monitoring' */'/web/src/pages/risk-monitoring'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/data/cve/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__data__cve__$id' */'/web/src/pages/data/cve/$id'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/data/cwe/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__data__cwe__$id' */'/web/src/pages/data/cwe/$id'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "name": "User managerment",
        "icon": "team",
        "path": "/admin/users",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__admin__users' */'/web/src/pages/admin/users'), loading: LoadingComponent}),
        "access": "admin",
        "exact": true
      },
      {
        "path": "/data",
        "name": "data",
        "icon": "dashboard",
        "routes": [
          {
            "path": "/data",
            "redirect": "/data/cwe",
            "exact": true
          },
          {
            "name": "cve",
            "icon": "smile",
            "path": "/data/cve",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__data__cve' */'/web/src/pages/data/cve'), loading: LoadingComponent}),
            "exact": true
          },
          {
            "name": "cwe",
            "icon": "smile",
            "path": "/data/cwe",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__data__cwe' */'/web/src/pages/data/cwe'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "path": "/system-profiles/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__system-profiles__$id' */'/web/src/pages/system-profiles/$id'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/deployment-scenarios/mapping/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__deployment-scenarios__mapping__$id' */'/web/src/pages/deployment-scenarios/mapping/$id'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/deployment-scenarios/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__deployment-scenarios__$id' */'/web/src/pages/deployment-scenarios/$id'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/risk-assessments/assessments/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk-assessments__assessments__$id' */'/web/src/pages/risk-assessments/assessments/$id'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/risk-assessments/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk-assessments__$id' */'/web/src/pages/risk-assessments/$id'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/risk-monitoring/monitoring/:id",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk-monitoring__monitoring__$id' */'/web/src/pages/risk-monitoring/monitoring/$id'), loading: LoadingComponent}),
        "access": "user",
        "exact": true
      },
      {
        "path": "/index.html",
        "redirect": "/dashboard",
        "exact": true
      },
      {
        "path": "/",
        "redirect": "/dashboard",
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/web/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}

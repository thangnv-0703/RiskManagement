import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { DEPLOYMENT_SCENARIO_SERVICE_URL } from '../configs/config';

export class DeploymentScenarioServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: DEPLOYMENT_SCENARIO_SERVICE_URL,

    pathRewrite: {
      '/api/deployment_scenarios': '/deployment_scenarios',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}

import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { SUPPLEMENT_APT_RISK_SERVICE_URL } from '../configs/config';

export class SupplementAptRiskServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: SUPPLEMENT_APT_RISK_SERVICE_URL,

    pathRewrite: {
      '/api/supplement_apt_risk': '/supplement_apt_risk',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}

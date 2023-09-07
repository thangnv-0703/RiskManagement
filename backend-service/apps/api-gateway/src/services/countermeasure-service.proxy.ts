import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { COUNTERMEASURE_SERVICE_URL } from '../configs/config';

export class CountermeasureServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: COUNTERMEASURE_SERVICE_URL,

    pathRewrite: {
      '/api/countermeasures': '/countermeasures',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}

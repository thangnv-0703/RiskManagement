import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { CATEGORY_SERVICE_URL } from '../configs/config';

export class CategoryServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: CATEGORY_SERVICE_URL,

    pathRewrite: {
      '/api/cves': '/cves',
      '/api/cwes': '/cwes',
      '/api/cpes': '/cpes',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}

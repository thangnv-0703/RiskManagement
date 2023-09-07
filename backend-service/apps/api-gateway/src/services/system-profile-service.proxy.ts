import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { SYSTEM_PROFILE_SERVICE_URL } from '../configs/config';

export class SystemProfileServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: SYSTEM_PROFILE_SERVICE_URL,

    pathRewrite: {
      '/api/system_profiles': '/system_profiles',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}

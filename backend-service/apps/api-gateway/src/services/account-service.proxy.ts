import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { ACCOUNT_SERVICE_URL } from '../configs/config';

export class AccountServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: ACCOUNT_SERVICE_URL,

    pathRewrite: {
      '/api/admin/users': '/admin/users',
      '/api/login': '/login',
      '/api/logout': '/logout',
      '/api/current_user': '/current_user',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    this.proxy(req, res, next);
  }
}

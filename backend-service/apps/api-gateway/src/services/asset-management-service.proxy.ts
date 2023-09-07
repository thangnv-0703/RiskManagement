import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { ASSET_MANAGEMENT_SERVICE_URL } from '../configs/config';

export class AssetManagementServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: ASSET_MANAGEMENT_SERVICE_URL,

    pathRewrite: {
      '/api/asset/': '/',
    },
    secure: false,
    changeOrigin: true,
    onProxyReq: fixRequestBody,
  });
  use(req: Request, res: Response, next: () => void) {
    //console.log(res);
    this.proxy(req, res, next);
  }
}

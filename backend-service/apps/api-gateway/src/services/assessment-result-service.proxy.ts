import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { ASSESSMENT_RESULT_SERVICE_URL } from '../configs/config';

export class AssessmentResultServiceProxy implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: ASSESSMENT_RESULT_SERVICE_URL,

    pathRewrite: {
      '/api/assessment_result': '/assessment_result',
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

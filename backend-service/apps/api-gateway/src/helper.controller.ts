import { HttpAuthGuard } from '@libs/common/guard';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { DiToken } from './di-token';
import { ClientProxy } from '@nestjs/microservices';
import { IContextService } from '@libs/common/context';
import {
  AssessmentResultPattern,
  CountermeasurePattern,
  DeploymentScenarioPattern,
  PagingParam,
  ServiceParam,
  SystemProfilePattern,
} from '@libs/api-contract';
import { firstValueFrom } from 'rxjs';

@Controller('')
export class HelperController {
  constructor(
    @Inject(DiToken.SystemProfileClientProxy)
    readonly systemProfileClient: ClientProxy,
    @Inject(DiToken.CountermeasureClientProxy)
    readonly countermeasureClient: ClientProxy,
    @Inject(DiToken.DeploymentScenarioClientProxy)
    readonly deploymentScenarioClient: ClientProxy,
    @Inject(DiToken.AssetClientProxy) readonly assetClient: ClientProxy,
    @Inject(DiToken.AssessmentResultClientProxy)
    readonly assessmentResultClient: ClientProxy,
    @Inject(DiToken.ContextService) readonly contextService: IContextService
  ) {}

  @UseGuards(HttpAuthGuard)
  @Get('dashboard')
  async getDashboardData() {
    const context = this.contextService.getContext();
    const payload: ServiceParam<PagingParam> = {
      context: context,
      data: new PagingParam(),
    };
    const systemProfiles = await firstValueFrom(
      this.systemProfileClient.send(SystemProfilePattern.GetPaging, payload)
    );

    const countermeasures = await firstValueFrom(
      this.countermeasureClient.send(CountermeasurePattern.GetPaging, payload)
    );

    const param: ServiceParam<string> = {
      context: context,
      data: context.id,
    };

    const deploymentScenarios = await firstValueFrom(
      this.deploymentScenarioClient.send(
        DeploymentScenarioPattern.GetDeploymentScenarioDashboard,
        param
      )
    );

    const assessmentResults = await firstValueFrom(
      this.assessmentResultClient.send(
        AssessmentResultPattern.GetDashboard,
        param
      )
    );

    const assets = await firstValueFrom(
      this.assetClient.send('get-all-asset', {})
    );

    return {
      deploymentScenarios,
      assessmentResults,
      countermeasures,
      systemProfiles,
      assets,
    };
  }

  @Post('upload_file')
  async createUploadFile(@Body() file: any) {
    return file;
  }
}

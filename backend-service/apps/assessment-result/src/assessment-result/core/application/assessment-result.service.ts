import { REQUEST } from '@nestjs/core';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BaseService } from '@libs/common/base';
import { CustomRpcException } from '@libs/common/exception-filters';
import { IContextService } from '@libs/common/context';
import { AssessmentResult } from '../domain/assessment-result';
import { AssessmentResultRepositoryPort } from '../domain/assessment-result.repository.port';
import { AssessmentResultServicePort } from './assessment-result.service.port';
import { HttpStatus, Inject } from '@nestjs/common';
import { AssessmentResultDIToken } from '../../api/di-token';
import {
  DeploymentScenarioPattern,
  PagingParam,
  PagingResponse,
  ServiceParam,
  SupplementAptRiskPattern,
} from '@libs/api-contract';
import { ClientProxy } from '@nestjs/microservices';
import { CORE_SERVICE_URL } from 'apps/assessment-result/src/configs/rabbimq.config.service';
import { AssessmentInputDto, ConfigAssessmentDto } from '../../api/dtos';
import { DeploymentScenarioDto } from '../../api/dtos/deployment-scenario.dto';
import { convertKeysToSnakeCase } from '@libs/common/interceptors';

export class AssessmentResultService
  extends BaseService<AssessmentResult>
  implements AssessmentResultServicePort
{
  constructor(
    @Inject(AssessmentResultDIToken.AssessmentResultRepository)
    readonly repo: AssessmentResultRepositoryPort,
    @Inject(AssessmentResultDIToken.SupplementAptRiskClientProxy)
    readonly supplementAptRiskClient: ClientProxy,
    @Inject(AssessmentResultDIToken.DeploymentScenarioClientProxy)
    readonly deploymentScenerioClient: ClientProxy,
    @Inject(AssessmentResultDIToken.ContextService)
    readonly contextService: IContextService,
    private readonly httpService: HttpService
  ) {
    super(repo, contextService);
  }

  protected async beforeSave(data: AssessmentResult): Promise<void> {
    super.beforeSave(data);
    const invalidAssessmentResultName =
      (await this.repo.getAssessmentResultByName(data.name)).length > 0;
    if (invalidAssessmentResultName) {
      throw new CustomRpcException({
        message: 'Assessment Result name existed',
        status: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }
  }

  async getAssessmentResultDashboard(
    userId: string
  ): Promise<AssessmentResult[]> {
    return await this.repo.getAssessmentResultDashboard({
      createdBy: userId,
    });
  }

  protected async beforeCreate(
    assessmentResult: AssessmentResult
  ): Promise<void> {
    await super.beforeCreate(assessmentResult);

    const context = this.contextService.getContext();

    const deploymentScenarioParam: ServiceParam<string> = {
      context: context,
      data: assessmentResult.deploymentScenarioId,
    };
    const deploymentScenario = await firstValueFrom(
      this.deploymentScenerioClient.send<
        DeploymentScenarioDto,
        ServiceParam<string>
      >(
        DeploymentScenarioPattern.GetByIdDeploymentScenario,
        deploymentScenarioParam
      )
    );

    const supplementParam: ServiceParam<string> = {
      context: context,
      data: assessmentResult.deploymentScenarioId,
    };
    const supplementConfig = await firstValueFrom(
      this.supplementAptRiskClient.send<
        ConfigAssessmentDto,
        ServiceParam<string>
      >(SupplementAptRiskPattern.GetConfigAssessment, supplementParam)
    );

    const payload: AssessmentInputDto = {
      deploymentScenario: deploymentScenario,
      supplementConfig: supplementConfig,
    };
    const convertedPayload = convertKeysToSnakeCase(payload);
    const { data } = await firstValueFrom(
      this.httpService.post(`${CORE_SERVICE_URL}/assessment`, convertedPayload)
    );
    assessmentResult.result = data;
    assessmentResult.deploymentScenario = deploymentScenario;
    assessmentResult.supplementConfig = supplementConfig;
  }

  protected addCustomFilter(param: PagingParam): void {
    const deploymentScenarioId = param.dictionaryParam?.deploymentScenarioId;
    if (deploymentScenarioId) {
      param.filter = {
        ...param.filter,
        deploymentScenarioId: deploymentScenarioId,
      };
    }
  }
}

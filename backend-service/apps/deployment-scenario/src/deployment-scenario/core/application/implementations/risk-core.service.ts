import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import {
  DeploymentScenarioServicePort,
  RiskCoreServicePort,
} from '../interfaces';
import {
  AssessmentInputDto,
  ConfigAssessmentDto,
  DeploymentScenarioDto,
  DetectThreatDto,
  InitRiskMonitoringDto,
  MonitoringInputDto,
  StaticAssessment,
} from '../../../api/dtos';
import { DeploymentScenarioDIToken } from '../../../api/di-token';
import { ClientProxy } from '@nestjs/microservices';
import {
  convertKeysToSnakeCase,
  serializeObject,
} from '@libs/common/interceptors';
import { CONTEXT_SERVICE } from '@libs/common/constant';
import { IContextService } from '@libs/common/context';
import { ServiceParam, SupplementAptRiskPattern } from '@libs/api-contract';
import { CORE_SERVICE_URL } from 'apps/deployment-scenario/src/configs/config';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class RiskCoreService implements RiskCoreServicePort {
  constructor(
    @Inject(DeploymentScenarioDIToken.DeploymentScenarioService)
    readonly deploymentScenarioService: DeploymentScenarioServicePort,
    @Inject(CONTEXT_SERVICE)
    readonly contextService: IContextService,
    @Inject(DeploymentScenarioDIToken.SupplementAptRiskClientProxy)
    readonly supplementAptRiskClient: ClientProxy,
    @Inject(REQUEST) private request: Request,
    private readonly httpService: HttpService
  ) {}

  async assess(param: StaticAssessment): Promise<any> {
    let deploymentScenario = await this.deploymentScenarioService.getById(
      param.deploymentScenarioId
    );

    // deploymentScenario.baseBenefit = param.benefitCriterion;
    // deploymentScenario.baseImpact = param.damageCriterion;
    // deploymentScenario.exploitability = param.exploitability;
    // deploymentScenario.remediationLevel = param.remediationLevel;
    // deploymentScenario.reportConfidence = param.reportConfidence;
    await this.deploymentScenarioService.update({
      id: deploymentScenario.id,
      baseBenefit: param.benefitCriterion,
      baseImpact: param.damageCriterion,
      exploitability: param.exploitability,
      remediationLevel: param.remediationLevel,
      reportConfidence: param.reportConfidence,
    });

    const context = this.contextService.getContext();
    const supplementParam: ServiceParam<string> = {
      context: context,
      data: deploymentScenario.id,
    };
    const supplementConfig = await firstValueFrom(
      this.supplementAptRiskClient.send<
        ConfigAssessmentDto,
        ServiceParam<string>
      >(SupplementAptRiskPattern.GetConfigAssessment, supplementParam)
    );

    let deploymentScenarioPayload = serializeObject(
      DeploymentScenarioDto,
      deploymentScenario
    );
    const payload: AssessmentInputDto = {
      deploymentScenario: deploymentScenarioPayload as DeploymentScenarioDto,
      supplementConfig: supplementConfig,
    };

    const convertedPayload = convertKeysToSnakeCase(payload);
    const { data } = await firstValueFrom(
      this.httpService.post(`${CORE_SERVICE_URL}/assessment`, convertedPayload)
    );
    return data;
  }

  async assessForSave(id: string): Promise<any> {
    let deploymentScenario = await this.deploymentScenarioService.getById(id);

    const context = this.contextService.getContext();
    const supplementParam: ServiceParam<string> = {
      context: context,
      data: deploymentScenario.id,
    };
    const supplementConfig = await firstValueFrom(
      this.supplementAptRiskClient.send<
        ConfigAssessmentDto,
        ServiceParam<string>
      >(SupplementAptRiskPattern.GetConfigAssessment, supplementParam)
    );

    let deploymentScenarioPayload = serializeObject(
      DeploymentScenarioDto,
      deploymentScenario
    );
    const payload: AssessmentInputDto = {
      deploymentScenario: deploymentScenarioPayload as DeploymentScenarioDto,
      supplementConfig: supplementConfig,
    };

    const convertedPayload = convertKeysToSnakeCase(payload);
    const { data } = await firstValueFrom(
      this.httpService.post(`${CORE_SERVICE_URL}/assessment`, convertedPayload)
    );
    return {
      result: data,
      deploymentScenario,
      supplementConfig,
    };
  }

  async monitor(param: InitRiskMonitoringDto): Promise<any> {
    let deploymentScenario = await this.deploymentScenarioService.getById(
      param.deploymentScenarioId
    );

    const context = this.contextService.getContext();
    const supplementParam: ServiceParam<string> = {
      context: context,
      data: deploymentScenario.id,
    };
    const supplementConfig = await firstValueFrom(
      this.supplementAptRiskClient.send<
        ConfigAssessmentDto,
        ServiceParam<string>
      >(SupplementAptRiskPattern.GetConfigAssessment, supplementParam)
    );

    let deploymentScenarioPayload = serializeObject(
      DeploymentScenarioDto,
      deploymentScenario
    );
    const payload: MonitoringInputDto = {
      deploymentScenario: deploymentScenarioPayload as DeploymentScenarioDto,
      supplementConfig: supplementConfig,
      monitorParam: param,
    };

    const convertedPayload = convertKeysToSnakeCase(payload);
    const { data } = await firstValueFrom(
      this.httpService.post(`${CORE_SERVICE_URL}/monitoring`, convertedPayload)
    );
    return data;
  }

  async detectThreat(param: DetectThreatDto): Promise<any> {
    let deploymentScenario = await this.deploymentScenarioService.getById(
      param.deploymentScenarioId
    );

    let deploymentScenarioPayload = serializeObject(
      DeploymentScenarioDto,
      deploymentScenario
    );
    param.deploymentScenario =
      deploymentScenarioPayload as DeploymentScenarioDto;

    const convertedPayload = convertKeysToSnakeCase(param);

    const headersRequest = {
      'Content-Type': 'application/json', // afaik this one is not needed
      Authorization: ` ${this.request.headers['authorization']}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.post(
        `${CORE_SERVICE_URL}/detect_threat`,
        convertedPayload,
        { headers: headersRequest }
      )
    );
    return data;
  }

  async scanVulnerability(id: string): Promise<any> {
    let deploymentScenario = await this.deploymentScenarioService.getById(id);

    let deploymentScenarioPayload = serializeObject(
      DeploymentScenarioDto,
      deploymentScenario
    );
    const convertedPayload = convertKeysToSnakeCase(deploymentScenarioPayload);
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${CORE_SERVICE_URL}/scan_vulnerability`,
        convertedPayload
      )
    );
    return data;
  }
}

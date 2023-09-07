import { BaseService } from '@libs/common/base';
import { IContextService } from '@libs/common/context';
import { Inject } from '@nestjs/common';
import { FactorAssessment } from '../domain/factor-assessment';
import { FactorAssessmentDIToken } from '../../api/di-token';
import { FactorAssessmentRepositoryPort } from '../domain/factor-assessment.repository.port';
import { FactorAssessmentServicePort } from './factor-assessment.service.port';
import { AptConfigService } from 'apps/supplement-apt-risk/src/apt-config/core/application/apt-config.service';
import { AssessmentConfigDto } from '../../api/dtos/config-assessment.dto';

export class FactorAssessmentService
  extends BaseService<FactorAssessment>
  implements FactorAssessmentServicePort
{
  constructor(
    @Inject(FactorAssessmentDIToken.FactorAssessmentRepository)
    readonly repo: FactorAssessmentRepositoryPort,
    @Inject(FactorAssessmentDIToken.ContextService)
    readonly contextService: IContextService,
    @Inject(FactorAssessmentDIToken.AptConfigService)
    readonly aptConfigService: AptConfigService
  ) {
    super(repo, contextService);
  }

  async getFactorAssessment(
    deploymentScenarioId: string
  ): Promise<FactorAssessment> {
    const userId = this.contextService.getContext().id;
    const result = await this.repo.findByCondition({
      deploymentScenarioId: deploymentScenarioId,
      userId: userId,
    });
    if (result.length === 0) {
      const config = await this.aptConfigService.getConfig();
      const factorAssessment = {
        deploymentScenarioId: deploymentScenarioId,
        attackerCapability: config.attackerCapabilityDefault.map((factor) => {
          delete factor.weight;
          return factor;
        }),
        effectivenessDefender: config.effectivenessDefenderDefault.map(
          (factor) => {
            delete factor.weight;
            return factor;
          }
        ),
      } as unknown as FactorAssessment;
      return factorAssessment;
    }
    delete result[0].userId;
    return result[0];
  }

  async saveFactorAssessment(config: FactorAssessment): Promise<boolean> {
    const userId = this.contextService.getContext().id;
    config.userId = userId;
    const result = await this.repo.upsert({ userId: userId }, config);
    return result;
  }

  async getConfigAssessment(
    deploymentScenarioId: string
  ): Promise<AssessmentConfigDto> {
    const userId = this.contextService.getContext().id;
    const factorAssessment = await this.repo.findByCondition({
      deploymentScenarioId: deploymentScenarioId,
      userId: userId,
    });
    const config = await this.aptConfigService.getConfig();

    if (factorAssessment.length === 0) {
      return {
        deploymentScenarioId: deploymentScenarioId,
        attackerAggregateFunction: config.attackerAggregateFunction,
        defenderAggregateFunction: config.defenderAggregateFunction,
        attackerVariationRate: config.attackerVariationRate,
        defenderVariationRate: config.defenderVariationRate,
        effectivenessDefender: config.effectivenessDefenderDefault,
        attackerCapability: config.attackerCapabilityDefault,
      } as AssessmentConfigDto;
    } else {
      const attackerCapability = factorAssessment[0].attackerCapability.map(
        (factor) => {
          const factorConfig = config.attackerCapabilityDefault.find(
            (f) => f.name === factor.name
          );
          return {
            score: factor.score,
            name: factor.name,
            type: factor.type,
            weight: factorConfig.weight,
          };
        }
      );

      const effectivenessDefender =
        factorAssessment[0].effectivenessDefender.map((factor) => {
          const factorConfig = config.effectivenessDefenderDefault.find(
            (f) => f.name === factor.name
          );
          return {
            score: factor.score,
            name: factor.name,
            type: factor.type,
            weight: factorConfig.weight,
          };
        });

      return {
        deploymentScenarioId: deploymentScenarioId,
        attackerAggregateFunction: config.attackerAggregateFunction,
        defenderAggregateFunction: config.defenderAggregateFunction,
        attackerVariationRate: config.attackerVariationRate,
        defenderVariationRate: config.defenderVariationRate,
        effectivenessDefender: effectivenessDefender,
        attackerCapability: attackerCapability,
      } as AssessmentConfigDto;
    }
  }
}

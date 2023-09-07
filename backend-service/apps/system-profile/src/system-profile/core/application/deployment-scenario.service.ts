import { BaseService } from '@libs/common/base';
import { CustomRpcException } from '@libs/common/exception-filters';
import { IContextService } from '@libs/common/context';
import { DeploymentScenario } from '../domain/deployment-scenario';
import { HttpStatus, Inject } from '@nestjs/common';
import { SystemProfileDIToken } from '../../api/di-token';
import { DeploymentScenarioServicePort } from './deployment-scenario.service.port';
import { DeploymentScenarioRepositoryPort } from '../domain/deployment-scenario.repository.port';
import mongoose from 'mongoose';
import { DeploymentScenarioPagingDto } from '../../api/dtos';
import { PagingParam, PagingResponse } from '@libs/api-contract';

export class DeploymentScenarioService
  extends BaseService<DeploymentScenario>
  implements DeploymentScenarioServicePort
{
  constructor(
    @Inject(SystemProfileDIToken.DeploymentScenarioRepository)
    readonly repo: DeploymentScenarioRepositoryPort,
    @Inject(SystemProfileDIToken.SystemProfileRepository)
    readonly systemProfileRepo: DeploymentScenarioRepositoryPort,
    @Inject(SystemProfileDIToken.ContextService)
    readonly contextService: IContextService
  ) {
    super(repo, contextService);
  }

  protected override async beforeCreate(
    data: DeploymentScenario
  ): Promise<void> {
    await super.beforeCreate(data);
    data._id = new mongoose.Types.ObjectId(data.id);
  }

  // protected override async customValidateUpdate(
  //   data: DeploymentScenario,
  //   validatedEntity: DeploymentScenario
  // ): Promise<void> {
  //   if (data.__v !== validatedEntity.__v + 1) {
  //     throw new CustomRpcException({
  //       status: HttpStatus.BAD_REQUEST,
  //       message: 'Deployment scenario not found',
  //     });
  //   }
  // }

  // protected async customValidateDeleteData(
  //   data: DeploymentScenario,
  //   validatedEntity: DeploymentScenario
  // ): Promise<void> {
  //   if (data.__v !== validatedEntity.__v) {
  //     throw new CustomRpcException({
  //       status: HttpStatus.BAD_REQUEST,
  //       message: 'Deployment scenario not found',
  //     });
  //   }
  // }

  protected override async beforeSave(data: DeploymentScenario): Promise<void> {
    await super.beforeSave(data);
    const systemProfile = this.systemProfileRepo.findById(
      data.systemProfileId.toString()
    );
    if (!systemProfile) {
      throw new CustomRpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'System profile not found',
      });
    }
  }

  async getPagingBySystemProfileId(
    param: DeploymentScenarioPagingDto
  ): Promise<PagingResponse<DeploymentScenario>> {
    const filter: PagingParam = {
      filter: {
        systemProfileId: new mongoose.Types.ObjectId(param.systemProfileId),
        status: { $in: param.status.split(',') },
      },
      limit: param.paging?.pageSize,
      skip: (param.paging?.current - 1) * param.paging?.pageSize,
    };
    const result = await this.repo.findAllPaging(filter);
    return result;
  }
}

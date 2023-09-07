import { BaseDocument, BaseRepositoryPort } from '@libs/common/base';
import { ContextData, IContextService } from '@libs/common/context';
import { CustomRpcException } from '@libs/common/exception-filters';
import { BaseServicePort } from './base.service.port';
import { PagingParam, PagingResponse } from '@libs/api-contract';
import { HttpStatus } from '@nestjs/common';

export class BaseService<T extends BaseDocument> implements BaseServicePort<T> {
  protected checkCreatedBy: boolean = true;
  constructor(
    readonly repo: BaseRepositoryPort<T>,
    readonly contextService: IContextService
  ) {}

  async getPaging(param: PagingParam): Promise<PagingResponse<T>> {
    if (this.checkCreatedBy) {
      this.addCreatedByFilter(param);
    }
    this.addCustomFilter(param);
    return await this.repo.findAllPaging(param);
  }

  async getById(id: string): Promise<T> {
    const entity = await this.repo.findById(id);
    this.afterGetById(entity);
    return entity;
  }

  async create(data: T): Promise<string> {
    await this.beforeCreate(data);
    const result = await this.repo.insertOne(data);
    data.id = result;
    await this.afterCreate(data);
    return result;
  }

  async update(data: T): Promise<T> {
    await this.validateUpdate(data);
    const result = await this.repo.updateById(data.id, data);
    await this.afterUpdate(result);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.validateDelete(id);
    const result = await this.repo.deleteById(id);
    await this.afterDelete(data);
    return result;
  }

  async deleteData(data: T): Promise<boolean> {
    await this.validateDeleteData(data);
    const result = await this.repo.deleteById(data.id);
    await this.afterDelete(data);
    return result;
  }

  protected addCreatedByFilter(param: PagingParam): void {
    const context = this.contextService.getContext();
    param.filter = {
      ...param.filter,
      createdBy: context.id,
    };
  }

  protected addCustomFilter(param: PagingParam): void {}

  protected processHistoryInfor(data: T, context: ContextData): T {
    if (context?.id) {
      data.updatedBy = context.id;
      if (!data.id) {
        data.createdBy = context.id;
      }
    }
    return data;
  }

  protected afterGetById(data: T): void {
    if (!data) {
      throw new CustomRpcException({
        message: 'Entity not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    if (this.checkCreatedBy) {
      this.validateCreatedBy(data);
    }
  }

  protected async beforeSave(data: T): Promise<void> {
    const context = this.contextService.getContext();
    data = this.processHistoryInfor(data, context);
  }

  protected async beforeCreate(data: T): Promise<void> {
    await this.beforeSave(data);
  }

  protected async afterCreate(data: T): Promise<void> {}

  protected async afterUpdate(data: T): Promise<void> {}

  protected async afterDelete(data: T): Promise<void> {}

  private async validateUpdate(data: T): Promise<void> {
    const validatedEntity = await this.validateEntityExist(data.id);
    if (this.checkCreatedBy) {
      this.validateCreatedBy(validatedEntity);
    }
    await this.customValidateUpdate(data, validatedEntity);
    await this.beforeSave(data);
  }

  private async validateDelete(id: string): Promise<T> {
    const validatedEntity = await this.validateEntityExist(id);
    if (this.checkCreatedBy) {
      this.validateCreatedBy(validatedEntity);
    }
    await this.customValidateDelete(id, validatedEntity);
    return validatedEntity;
  }

  private async validateDeleteData(data: T): Promise<T> {
    const validatedEntity = await this.validateEntityExist(data.id);
    if (this.checkCreatedBy) {
      this.validateCreatedBy(validatedEntity);
    }
    await this.customValidateDeleteData(data, validatedEntity);
    return validatedEntity;
  }

  protected async customValidateUpdate(
    data: T,
    validatedEntity: T
  ): Promise<void> {}

  protected async customValidateDelete(
    id: string,
    validatedEntity: T
  ): Promise<void> {}

  protected async customValidateDeleteData(
    data: T,
    validatedEntity: T
  ): Promise<void> {}

  protected async validateEntityExist(id: string): Promise<T> {
    const entity = await this.repo.findById(id);
    if (!entity) {
      throw new CustomRpcException({
        message: 'Entity not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
    return entity;
  }

  protected validateCreatedBy(entity: T): void {
    const context = this.contextService.getContext();
    if (this.checkCreatedBy && context?.id !== entity.createdBy) {
      throw new CustomRpcException({
        message: 'Entity not found',
        status: HttpStatus.NOT_FOUND,
      });
    }
  }
}

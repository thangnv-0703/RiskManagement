import { BaseDocument } from './base.document';
import { PagingParam, PagingResponse } from '@libs/api-contract';

export interface BaseRepositoryPort<T extends BaseDocument> {
  findAll(filter: object): Promise<T[]>;
  findAllPaging(filter: PagingParam): Promise<PagingResponse<T>>;
  findByCondition(condition: object): Promise<T[]>;
  findById(id: string): Promise<T>;
  insertOne(data: T): Promise<string>;
  insertMany(data: T[]): Promise<string[]>;
  updateById(id: string, data: Partial<T>): Promise<T>;
  updateMany(condition: object, data: Partial<T>): Promise<boolean>;
  upsert(condition: object, data: Partial<T>): Promise<boolean>;
  deleteById(id: string): Promise<boolean>;
  deleteMany(condition: object): Promise<boolean>;
}

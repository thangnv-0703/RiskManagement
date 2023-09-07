import { PagingParam, PagingResponse } from '@libs/api-contract';

export interface BaseServicePort<T> {
  getPaging(filter: PagingParam): Promise<PagingResponse<T>>;
  getById(id: string): Promise<T>;
  create(data: Partial<T>): Promise<string>;
  update(data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  deleteData(data: T): Promise<boolean>;
}

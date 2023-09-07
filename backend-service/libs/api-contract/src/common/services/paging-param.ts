export type OrderBy = { field: string | true; param: 'asc' | 'desc' };

export class PagingParam {
  dictionaryParam?: Record<string, any>;

  filter?: object;

  limit?: number;

  skip?: number;

  orderBy?: OrderBy;
}

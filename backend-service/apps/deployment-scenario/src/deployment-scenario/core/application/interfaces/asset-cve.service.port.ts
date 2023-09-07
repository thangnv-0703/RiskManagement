import { BaseServicePort } from '@libs/common/base';
import { AssetCve } from '../../domain/documents';
import {
  UpdateCveOnAsset,
  CvesOnAssetPagingDto,
  UpdateActiveCveDto,
} from '../../../api/dtos';
import { CveOnAsset } from 'apps/deployment-scenario/src/deployment-scenario/core/domain/sub-documents';
import { PagingResponse } from '@libs/api-contract';

export interface AssetCveServicePort extends BaseServicePort<AssetCve> {
  updateCveOnAsset(
    data: UpdateCveOnAsset,
    udpateActive: boolean
  ): Promise<boolean>;
  updateActiveCve(data: UpdateActiveCveDto): Promise<boolean>;
  getCveOnAsset(
    data: CvesOnAssetPagingDto
  ): Promise<PagingResponse<CveOnAsset>>;
  getActiveCve(
    param: CvesOnAssetPagingDto
  ): Promise<PagingResponse<CveOnAsset>>;
}

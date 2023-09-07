import { Expose, Type } from 'class-transformer';
import { AssetCpeDto } from './asset-cpe.dto';
import { AssetCveDto } from './asset-cve.dto';
import { AttackGraphDto } from './attack-graph.dto';
import { AttackerDto } from './attacker.dto';

export class GetAttackGraphDto {
  @Expose()
  @Type(() => AttackGraphDto)
  attackGraph: AttackGraphDto;

  @Expose()
  @Type(() => AssetCpeDto)
  assets: AssetCpeDto[];

  @Expose()
  @Type(() => AttackerDto)
  attackers: AttackerDto[];

  @Expose()
  @Type(() => AssetCveDto)
  cves: AssetCveDto[];
}

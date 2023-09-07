import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { DepartmentSchema } from '../../models/schemas/department.schema';
import { AssetSchema } from '../../models/schemas/asset.schema';
import { UserSchema } from '../../models/schemas/user.schema';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
      { name: 'Asset', schema: AssetSchema },
      { name: 'User', schema: UserSchema },
    ]),
    LocationModule,
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports: [DepartmentService],
})
export class DepartmentModule {}

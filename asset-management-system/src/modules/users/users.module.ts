import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetToUserSchema } from '../../models/schemas/assetToUser.schema';
import { UserSchema } from '../../models/schemas/user.schema';
import { UsersService } from './users.service';
import { UserController } from './user.controller';
import { DepartmentModule } from '../department/department.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'AssetToUser', schema: AssetToUserSchema },
    ]),
    DepartmentModule,
    FirebaseModule,
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

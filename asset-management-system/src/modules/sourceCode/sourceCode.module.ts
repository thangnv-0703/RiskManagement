import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SourceCodeSchema } from '../../models/schemas/sourceCode.schema';
import { SourceCodeToUserSchema } from '../../models/schemas/sourceCodeToUser.schema';
import { UsersModule } from '../users/users.module';
import { SourceCodeController } from './sourceCode.controller';
import { SourceCodeService } from './sourceCode.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'SourceCode', schema: SourceCodeSchema },
      { name: 'SourceCodeToUser', schema: SourceCodeToUserSchema },
    ]),
    forwardRef(() => UsersModule),
  ],
  controllers: [SourceCodeController],
  providers: [SourceCodeService],
  exports: [SourceCodeService],
})
export class SourceCodeModule {}

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PersistanceModule } from 'src/persistance/persistance.module';
import { IsEmailUniqueConstraint } from './validators/is-email-unique.validator';

@Module({
  controllers: [],
  providers: [UserService, IsEmailUniqueConstraint],
  imports: [PersistanceModule],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PersistanceModule } from './persistance/persistance.module';
import { UserModule } from './user/user.module';
import { SafeTextModule } from './safe-text/safe-text.module';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    GlobalModule,
    AuthModule,
    PersistanceModule,
    UserModule,
    SafeTextModule,
  ],
})
export class AppModule {}

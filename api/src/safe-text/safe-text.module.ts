import { Module } from '@nestjs/common';
import { SafeTextService } from './safe-text.service';
import { PersistanceModule } from '../persistance/persistance.module';
import { SafeTextController } from './safe-text.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SafeTextController],
  providers: [SafeTextService],
  imports: [PersistanceModule, AuthModule],
})
export class SafeTextModule {}

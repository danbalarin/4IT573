import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { mainConfig } from '../main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  mainConfig(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

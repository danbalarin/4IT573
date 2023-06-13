import { INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './src/app.module';
import { exceptionFactory } from './src/utils/exception-factory';

export function mainConfig(app: INestApplication) {
  app.enableCors({
    credentials: true,
    origin: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}

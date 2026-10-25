import { NestFactory } from '@nestjs/core';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const nodeEnv = config.get<string>(
    'NODE_ENV',
    process.env.NODE_ENV ?? 'development',
  );
  const isProd = nodeEnv === 'production';

  const defaultLevels = isProd
    ? (['log', 'warn', 'error'] as const)
    : (['debug', 'log', 'warn', 'error', 'verbose'] as const);

  const logLevel = config.get<string>('LOG_LEVEL', process.env.LOG_LEVEL ?? '');
  const levels = logLevel
    ? logLevel
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean)
    : [...defaultLevels];

  const logger = new ConsoleLogger('Bootstrap', {
    logLevels: levels as any,
    json: isProd,
    colors: !isProd,
    compact: isProd,
  });

  app.useLogger(logger);

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

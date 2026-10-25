import { NestFactory } from '@nestjs/core';
import { ConsoleLogger, LogLevel, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const config = app.get(ConfigService);
  const nodeEnv =
    config.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? 'development';
  const isProd = nodeEnv === 'production';

  const defaultLevels: LogLevel[] = isProd
    ? ['log', 'warn', 'error']
    : ['debug', 'log', 'warn', 'error', 'verbose'];

  const logLevelConfig =
    config.get<string>('LOG_LEVEL') ?? process.env.LOG_LEVEL ?? '';
  const levels: LogLevel[] = logLevelConfig
    ? logLevelConfig
        .split(',')
        .map((l) => l.trim())
        .filter((l): l is LogLevel =>
          ['log', 'error', 'warn', 'debug', 'verbose'].includes(l),
        )
    : [...defaultLevels];

  const logger = new ConsoleLogger('Bootstrap', {
    logLevels: levels,
    json: isProd,
    colors: !isProd,
    compact: isProd,
  });

  app.useLogger(logger);

  const trustProxy =
    config.get<string>('TRUST_PROXY') ?? process.env.TRUST_PROXY ?? '';
  if (trustProxy && trustProxy.trim() !== '') {
    const trimmed = trustProxy.trim();
    const trustProxyConfig = trimmed === 'true' ? true : trimmed;
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter.getInstance() as unknown as {
      set: (key: string, value: unknown) => void;
    };
    instance.set('trust proxy', trustProxyConfig);
  }

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api', { exclude: ['/', '/api/health'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

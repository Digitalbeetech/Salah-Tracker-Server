import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './all-exceptions.filter';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: true, // dynamically reflect request origin
    credentials: true, // allow cookies
  });

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3005);
}
bootstrap();

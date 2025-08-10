import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { UsersService } from './modules/users/users.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const users = app.get(UsersService);
  await users.ensureSeedUser();
  await app.listen(process.env.PORT || 3001);
}
bootstrap();

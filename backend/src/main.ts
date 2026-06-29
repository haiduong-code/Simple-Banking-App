import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép frontend (Vite) gọi API
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Validate toàn bộ input theo DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // loại bỏ field không khai báo trong DTO
      forbidNonWhitelisted: true, // báo lỗi nếu gửi field lạ
      transform: true,            // tự ép kiểu theo type của DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
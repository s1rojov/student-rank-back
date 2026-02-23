import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'; // 1. Import qilish

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 2. ValidationPipe ni qo'shish
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTOda yo'q ortiqcha maydonlarni o'chirib tashlaydi
      transform: true, // Ma'lumotlarni kerakli tipga o'giradi (masalan, string -> number)
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.FRONTEND_URL ||
        'http://localhost:3000',
      'https://student-rank-back-api.onrender.com').split(',');

      // origin yo'q bo'lsa (masalan, Postman yoki server-to-server) — ruxsat
      if (!origin) return callback(null, true);

      // localhost yoki 127.0.0.1 dan kelgan barcha requestlarga ruxsat
      if (
        allowedOrigins.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: ruxsat yo'q origin: ${origin}`));
    },
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Student Rank')
    .setDescription('Student Rank Api')
    .setVersion('1.0')
    .addTag('studentrank')
    .addBearerAuth() // Bearer authni yoqib qo'yish foydali
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

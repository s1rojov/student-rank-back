import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS ni yoqish - frontend bilan ishlash uchun
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  });

  // Swagger konfiguratsiyasi
  const config = new DocumentBuilder()
    .setTitle('Student Rank') // Loyiha nomi
    .setDescription('Student Rank Api') // Tavsif
    .setVersion('1.0') // Versiya
    .addTag('studentrank') // Taglar (ixtiyoriy)
    .addBearerAuth() // JWT authentication uchun
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 4000}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${process.env.PORT ?? 4000}/api`,
  );
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🧠 Gestion des grandes requêtes (import/export)
  app.use(json({ limit: '300mb' }));
  app.use(urlencoded({ extended: true, limit: '300mb' }));

  // 🌍 CORS : autorise ton frontend local + ton futur domaine Vercel
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://192.168.100.9:3000',
      'https://gym-frontend-54t8.onrender.com', // 🔹 on le mettra après déploiement
    ],
    credentials: true,
  });

  // ⚙️ Render fournit automatiquement PORT dans les variables d'env
  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`✅ Backend NestJS en ligne sur le port ${port}`);
}

bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { TournamentModule } from '@/modules/tournament/tournament.module';
import { StatusModule } from '@/modules/status/status.module';
import { TournamentFieldModule } from '@/modules/tournament-field/tournament-field.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { TestModule } from '@/modules/Test/test/test.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    TournamentModule,
    StatusModule,
    TournamentFieldModule,
    AuthModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { TournamentModule } from './tournament/tournament.module';

@Module({
  imports: [PrismaModule, TournamentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

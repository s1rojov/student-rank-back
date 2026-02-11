import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TournamentService, PrismaService],
  controllers: [TournamentController],
})
export class TournamentModule {}

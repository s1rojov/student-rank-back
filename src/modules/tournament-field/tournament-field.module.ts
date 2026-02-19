import { Module } from '@nestjs/common';
import { TournamentFieldService } from './tournament-field.service';
import { TournamentFieldController } from './tournament-field.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [TournamentFieldService, PrismaService],
  controllers: [TournamentFieldController],
})
export class TournamentFieldModule {}

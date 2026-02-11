import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TournamentService {
  constructor(private prisma: PrismaService) {}

  create(data: { title: string; startAt: Date; endAt: Date }) {
    return this.prisma.tournament.create({ data });
  }

  findAll() {
    return this.prisma.tournament.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.tournament.findUnique({ where: { id } });
  }

  update(id: number, data: { title?: string; startAt?: Date; endAt?: Date }) {
    return this.prisma.tournament.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.tournament.delete({ where: { id } });
  }
}

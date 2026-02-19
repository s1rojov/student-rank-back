import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TournamentFieldService {
  constructor(private prisma: PrismaService) {}

  create(data: { title: string }) {
    return this.prisma.tournamentField.create({ data });
  }

  findAll() {
    return this.prisma.tournamentField.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.tournamentField.findUnique({ where: { id } });
  }

  update(id: number, data: { title?: string }) {
    return this.prisma.tournamentField.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.tournamentField.delete({ where: { id } });
  }
}

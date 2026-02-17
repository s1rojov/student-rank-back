import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private prisma: PrismaService) {}

  create(data: { title: string }) {
    return this.prisma.status.create({ data });
  }

  findAll() {
    return this.prisma.status.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.status.findUnique({ where: { id } });
  }

  update(id: number, data: { title?: string }) {
    return this.prisma.status.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.status.delete({ where: { id } });
  }
}

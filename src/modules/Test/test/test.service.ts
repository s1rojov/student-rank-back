import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SubmitTestDto } from './dto/submit-test.dto';

@Injectable()
export class TestService {
  constructor(private prisma: PrismaService) {}

  async startTest(testId: string, userId: number) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
      select: { id: true, duration: true, maxAttempts: true },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    const attemptsCount = await this.prisma.attempt.count({
      where: { testId, userId },
    });

    if (attemptsCount >= test.maxAttempts) {
      throw new ForbiddenException('Maximum attempts reached');
    }

    const attempt = await this.prisma.attempt.create({
      data: {
        testId,
        userId,
        attemptNo: attemptsCount + 1,
        status: 'started',
        startedAt: new Date(),
      },
      select: { id: true },
    });

    return {
      attemptId: attempt.id,
      duration: test.duration,
    };
  }

  async getAttemptQuestions(testId: string, attemptId: string, userId: number) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          select: { duration: true },
        },
      },
    });

    if (!attempt || attempt.testId !== testId) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('This attempt does not belong to the user');
    }

    if (attempt.status !== 'started') {
      throw new BadRequestException('Attempt is not active');
    }

    const expiresAt = new Date(
      attempt.startedAt.getTime() + attempt.test.duration * 60 * 1000,
    );

    if (new Date() > expiresAt) {
      await this.prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: 'expired', finishedAt: new Date() },
      });

      throw new ConflictException('Attempt expired');
    }

    return this.prisma.question.findMany({
      where: { testId },
      select: {
        id: true,
        text: true,
        options: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async submitTest(
    testId: string,
    attemptId: string,
    userId: number,
    dto: SubmitTestDto,
  ) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        test: {
          select: { duration: true },
        },
      },
    });

    if (!attempt || attempt.testId !== testId) {
      throw new NotFoundException('Attempt not found');
    }

    if (attempt.userId !== userId) {
      throw new ForbiddenException('This attempt does not belong to the user');
    }

    if (attempt.status === 'completed') {
      throw new BadRequestException('Attempt already submitted');
    }

    if (attempt.status === 'expired') {
      throw new BadRequestException('Attempt already expired');
    }

    if (attempt.status !== 'started') {
      throw new BadRequestException('Attempt is not active');
    }

    const now = new Date();
    const expiresAt = new Date(
      attempt.startedAt.getTime() + attempt.test.duration * 60 * 1000,
    );

    if (now > expiresAt) {
      await this.prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: 'expired', finishedAt: now },
      });

      throw new ConflictException('Attempt expired');
    }

    const questions = await this.prisma.question.findMany({
      where: { testId },
      select: { id: true, correctIndex: true },
    });

    const answersMap = new Map(
      dto.answers.map((answer) => [answer.questionId, answer.selectedIndex]),
    );

    let score = 0;
    for (const question of questions) {
      if (answersMap.get(question.id) === question.correctIndex) {
        score += 1;
      }
    }

    const updatedAttempt = await this.prisma.attempt.update({
      where: { id: attempt.id },
      data: {
        score,
        finishedAt: now,
        status: 'completed',
      },
      select: { attemptNo: true },
    });

    return {
      score,
      total: questions.length,
      attemptNo: updatedAttempt.attemptNo,
    };
  }
}

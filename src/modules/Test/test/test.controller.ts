import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from '@/common/guards/at.guard';
import { TestService } from './test.service';
import { SubmitTestDto } from './dto/submit-test.dto';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post(':testId/start')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  startTest(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.testService.startTest(testId, Number(user['sub']));
  }

  @Get(':testId/attempt/:attemptId/questions')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  getAttemptQuestions(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    return this.testService.getAttemptQuestions(
      testId,
      attemptId,
      Number(user['sub']),
    );
  }

  @Post(':testId/attempt/:attemptId/submit')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  submitTest(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Param('attemptId', ParseUUIDPipe) attemptId: string,
    @Req() req: Request,
    @Body() dto: SubmitTestDto,
  ) {
    const user = req.user as any;
    return this.testService.submitTest(
      testId,
      attemptId,
      Number(user['sub']),
      dto,
    );
  }
}

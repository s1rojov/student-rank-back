import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto'; // Bu yerda email va password bor
import { SignupDto } from './dto/signup.dto'; // Bu yerda fullName, phone, email, password bor
import { AtGuard } from '../../common/guards/at.guard';
import { RtGuard } from '../../common/guards/rt.guard';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'User registration' })
  signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AtGuard) // Faqat login qilganlar chiqishi mumkin
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth() // Swagger uchun token kerakligini bildiradi
  @ApiOperation({ summary: 'User logout' })
  logout(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.logout(user['sub']);
  }

  @UseGuards(RtGuard) // RtStrategy (jwt-refresh) ishlatiladi
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth() // Swagger uchun token kerakligini bildiradi
  @ApiOperation({ summary: 'Refresh tokens' })
  refreshTokens(@Req() req: Request) {
    const user = req.user as any;
    // RtStrategy'dan kelayotgan refreshToken va userId ni uzatamiz
    return this.authService.refreshTokens(user['sub'], user['refreshToken']);
  }
}

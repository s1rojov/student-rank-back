import { Controller, Get, Req, UseGuards, Res } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import type { Response } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google bilan authentication ni boshlash' })
  @ApiResponse({
    status: 200,
    description: "Google login page'ga redirect qiladi",
  })
  async googleAuth() {
    // Guard avtomatik ravishda Google'ga redirect qiladi
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({
    summary: 'Google OAuth callback - registratsiya yoki login',
  })
  @ApiResponse({
    status: 200,
    description:
      "Muvaffaqiyatli authentication. JWT token va user ma'lumotlari qaytariladi",
    type: AuthResponseDto,
  })
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    // Google'dan keyin user ma'lumotlari bilan login/registration qilish
    const authResponse = await this.authService.googleLogin(req.user);

    // Frontend'ga redirect qilish va token yuborish
    // Bu yerda frontend URL'ni .env'dan olish kerak
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';

    // Token'ni query parameter orqali yuborish (yoki cookie'da saqlash mumkin)
    return res.redirect(
      `${frontendUrl}/auth/callback?token=${authResponse.accessToken}`,
    );
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Joriy user profilini olish' })
  @ApiResponse({
    status: 200,
    description: "User profil ma'lumotlari",
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req): Promise<UserResponseDto> {
    return this.authService.getProfile(req.user.id);
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Token validligini tekshirish' })
  @ApiResponse({
    status: 200,
    description: 'Token valid',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        user: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: "Token invalid yoki muddati o'tgan",
  })
  async checkAuth(@Req() req) {
    return {
      valid: true,
      user: req.user,
    };
  }
}

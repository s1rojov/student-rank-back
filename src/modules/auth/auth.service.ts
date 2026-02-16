import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async googleLogin(googleUser: any): Promise<AuthResponseDto> {
    // Google'dan kelgan ma'lumotlarni tekshirish
    if (!googleUser) {
      throw new Error('Google authentication failed');
    }

    // User'ni database'da qidirish yoki yaratish
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    if (!user) {
      // Registratsiya - yangi user yaratish
      user = await this.prisma.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          accessToken: googleUser.accessToken,
          refreshToken: googleUser.refreshToken,
        },
      });
    } else {
      // Login - mavjud user ma'lumotlarini yangilash
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name: googleUser.name,
          picture: googleUser.picture,
          accessToken: googleUser.accessToken,
          refreshToken: googleUser.refreshToken,
        },
      });
    }

    // JWT token yaratish
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.formatUserResponse(user),
    };
  }

  async validateUserById(userId: number): Promise<UserResponseDto | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return this.formatUserResponse(user);
  }

  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.formatUserResponse(user);
  }

  private formatUserResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      createdAt: user.createdAt,
    };
  }
}

# Google OAuth Integration - O'rnatish va Ishlatish Qo'llanmasi

## Google Cloud Console'da Sozlash

### 1. Google Cloud Project Yaratish

1. [Google Cloud Console](https://console.cloud.google.com/)ga kiring
2. Yangi project yarating yoki mavjud projectni tanlang
3. Project nomini kiriting (masalan: "Student Rank")

### 2. OAuth Consent Screen Sozlash

1. Menyu → "APIs & Services" → "OAuth consent screen"
2. User Type: **External** tanlang (yoki Internal agar G Suite foydalansangiz)
3. **Create** tugmasini bosing
4. Quyidagi ma'lumotlarni to'ldiring:
   - App name: `Student Rank`
   - User support email: sizning emailingiz
   - Developer contact: sizning emailingiz
5. **Save and Continue**
6. Scopes bo'limida qo'shimcha scope kerak emas (default scopes yetarli)
7. **Save and Continue**
8. Test users bo'limida test uchun email manzillarni qo'shing
9. **Save and Continue**

### 3. OAuth Credentials Yaratish

1. Menyu → "APIs & Services" → "Credentials"
2. **+ CREATE CREDENTIALS** → "OAuth client ID"
3. Application type: **Web application**
4. Name: `Student Rank Web Client`
5. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:4200
   ```
6. **Authorized redirect URIs**:
   ```
   http://localhost:3000/auth/google/callback
   ```
7. **CREATE** tugmasini bosing
8. Ko'rsatilgan **Client ID** va **Client Secret**ni nusxalab oling

## Backend O'rnatish

### 1. Environment Variables Sozlash

`.env` fayl yarating va quyidagi ma'lumotlarni kiriting:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/student-rank?schema=public"

# Server
PORT=3000

# Google OAuth (yuqorida olingan ma'lumotlar)
GOOGLE_CLIENT_ID=sizning-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=sizning-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# JWT (o'zingizning secret keyingiz)
JWT_SECRET=your-very-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:4200
```

### 2. Dependencies O'rnatish

```bash
npm install
```

### 3. Database Migration

```bash
npx prisma migrate dev
```

### 4. Serverni Ishga Tushirish

```bash
npm run start:dev
```

Server ishga tushgandan keyin:

- API: http://localhost:3000
- Swagger Documentation: http://localhost:3000/api

## API Endpoints

### 1. Google Authentication Boshlash

**GET** `/auth/google`

Bu endpoint'ga brauzer orqali kirganingizda, Google login sahifasiga yo'naltirilasiz.

```
http://localhost:3000/auth/google
```

### 2. Google Callback (Avtomatik)

**GET** `/auth/google/callback`

Google authentication'dan keyin avtomatik chaqiriladi. Bu endpoint:

- Yangi user bo'lsa - **registratsiya** qiladi
- Mavjud user bo'lsa - **login** qiladi
- JWT token yaratadi
- Frontend'ga redirect qiladi

### 3. Profil Ma'lumotlarini Olish

**GET** `/auth/profile`

Headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Response:

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "createdAt": "2026-02-16T09:54:29.000Z"
}
```

### 4. Token Tekshirish

**GET** `/auth/check`

Headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Response:

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://lh3.googleusercontent.com/...",
    "createdAt": "2026-02-16T09:54:29.000Z"
  }
}
```

## Frontend Integration Namunasi

### HTML/JavaScript

```html
<!-- Login tugmasi -->
<button onclick="loginWithGoogle()">Login with Google</button>

<script>
  function loginWithGoogle() {
    // Backend Google auth endpoint'iga yo'naltirish
    window.location.href = 'http://localhost:3000/auth/google';
  }

  // Callback sahifasida token'ni olish
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    // Token'ni localStorage'ga saqlash
    localStorage.setItem('access_token', token);

    // Profile ma'lumotlarini olish
    fetch('http://localhost:3000/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        console.log('User:', user);
        // User ma'lumotlarini UI'da ko'rsatish
      });
  }

  // Himoyalangan API'larga so'rov yuborish
  function makeAuthenticatedRequest() {
    const token = localStorage.getItem('access_token');

    fetch('http://localhost:3000/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
</script>
```

### Angular Example

```typescript
// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/auth/profile`, { headers });
  }

  checkAuth(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/auth/check`, { headers });
  }

  logout() {
    localStorage.removeItem('access_token');
  }
}
```

### React Example

```javascript
// authService.js
const API_URL = 'http://localhost:3000';

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/auth/google`;
};

export const getProfile = async () => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const checkAuth = async () => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_URL}/auth/check`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
```

## Testing

### 1. Swagger UI orqali test qilish

1. http://localhost:3000/api sahifasiga kiring
2. "Auth" bo'limini oching
3. `GET /auth/google` endpoint'ini sinab ko'ring

### 2. Brauzerda Direct Test

1. Brauzerni oching
2. http://localhost:3000/auth/google manzilga kiring
3. Google account tanlang
4. Ruxsat bering
5. Frontend URL'ga redirect bo'lishini tekshiring

### 3. JWT Token bilan Protected Route Test

```bash
# Avval login qiling va token oling
# Keyin curl bilan test qiling:

curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Himoyalangan Route'larni Qo'llash

Boshqa controller'larda JWT authentication'ni qo'llash uchun:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('tournaments')
export class TournamentController {
  @Get()
  @UseGuards(JwtAuthGuard) // Faqat login qilgan userlar
  @ApiBearerAuth() // Swagger uchun
  async getAllTournaments() {
    // Bu endpoint himoyalangan
    return [];
  }
}
```

## Production'ga Deploy Qilish

1. `.env` faylini production server'ga ko'chiring
2. Production URL'larini yangilang:
   ```env
   GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback
   FRONTEND_URL=https://your-frontend-domain.com
   JWT_SECRET=very-long-random-secret-key-for-production
   ```
3. Google Cloud Console'da Authorized redirect URI'larga production URL'ni qo'shing:
   ```
   https://your-domain.com/auth/google/callback
   ```

## Xavfsizlik Maslahatlar

1. **JWT_SECRET** - juda kuchli va tasodifiy string ishlating (kamida 32 belgi)
2. **HTTPS** - production'da faqat HTTPS ishlating
3. **CORS** - faqat kerakli origin'larni ruxsat bering
4. **Environment Variables** - `.env` faylini git'ga commit qilmang
5. **Token Expiration** - JWT_EXPIRES_IN'ni o'zingizga qulay vaqtga sozlang

## Muammolarni Hal Qilish

### Error: "redirect_uri_mismatch"

- Google Cloud Console'dagi redirect URI to'g'ri kiritilganini tekshiring
- URL oxirida "/" bo'lmasligi kerak

### Error: "invalid_client"

- GOOGLE_CLIENT_ID va GOOGLE_CLIENT_SECRET to'g'ri nusxalanganini tekshiring

### Error: "Unauthorized"

- JWT token to'g'ri yuborilganini tekshiring
- Token muddati o'tmagan bo'lishi kerak
- Bearer prefix ishlatilganini tekshiring: `Authorization: Bearer TOKEN`

## Qo'shimcha Resurslar

- [NestJS Passport Documentation](https://docs.nestjs.com/security/authentication)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Prisma Documentation](https://www.prisma.io/docs)

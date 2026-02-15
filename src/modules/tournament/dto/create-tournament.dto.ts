import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentDto {
  @ApiProperty({ example: 'string' })
  title: string;

  @ApiProperty({ example: '2026-02-16' })
  startAt: string;

  @ApiProperty({ example: '2026-02-20' })
  endAt: string;
}

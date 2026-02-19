import { ApiProperty } from '@nestjs/swagger';

export class CreateTournamentFieldDto {
  @ApiProperty({ example: 'Football' })
  title: string;
}

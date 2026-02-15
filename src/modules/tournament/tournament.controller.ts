import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { CreateTournamentDto } from '@/modules/tournament/dto/create-tournament.dto';

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post('Create')
  create(@Body() createTournamentDto: CreateTournamentDto) {
    // Klassni ko'rsating
    return this.tournamentService.create({
      title: createTournamentDto.title,
      startAt: new Date(createTournamentDto.startAt),
      endAt: new Date(createTournamentDto.endAt),
    });
  }

  @Get('GetList')
  findAll() {
    // return 'GEtlist';
    return this.tournamentService.findAll();
  }

  @Get('Get/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.findOne(id);
  }

  @Patch('Update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    updateTournamentDto: {
      title?: string;
      startAt?: string;
      endAt?: string;
    },
  ) {
    const data: any = {};
    if (updateTournamentDto.title) data.title = updateTournamentDto.title;
    if (updateTournamentDto.startAt)
      data.startAt = new Date(updateTournamentDto.startAt);
    if (updateTournamentDto.endAt)
      data.endAt = new Date(updateTournamentDto.endAt);
    return this.tournamentService.update(id, data);
  }

  @Delete('Delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.remove(id);
  }
}

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

@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Post()
  create(
    @Body()
    createTournamentDto: {
      title: string;
      startAt: string;
      endAt: string;
    },
  ) {
    return this.tournamentService.create({
      title: createTournamentDto.title,
      startAt: new Date(createTournamentDto.startAt),
      endAt: new Date(createTournamentDto.endAt),
    });
  }

  @Get()
  findAll() {
    return this.tournamentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.findOne(id);
  }

  @Patch(':id')
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

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentService.remove(id);
  }
}

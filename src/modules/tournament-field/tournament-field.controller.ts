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
import { TournamentFieldService } from './tournament-field.service';
import { CreateTournamentFieldDto } from '@/modules/tournament-field/dto/create-tournament-field.dto';

@Controller('tournament-field')
export class TournamentFieldController {
  constructor(
    private readonly tournamentFieldService: TournamentFieldService,
  ) {}

  @Post('Create')
  create(@Body() createTournamentFieldDto: CreateTournamentFieldDto) {
    return this.tournamentFieldService.create({
      title: createTournamentFieldDto.title,
    });
  }

  @Get('GetList')
  findAll() {
    return this.tournamentFieldService.findAll();
  }

  @Get('Get/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentFieldService.findOne(id);
  }

  @Patch('Update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTournamentFieldDto: { title?: string },
  ) {
    return this.tournamentFieldService.update(id, updateTournamentFieldDto);
  }

  @Delete('Delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tournamentFieldService.remove(id);
  }
}

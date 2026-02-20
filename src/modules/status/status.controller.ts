import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from '@/modules/status/dto/create-status.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from '@/common/guards/at.guard';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post('Create')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create({
      title: createStatusDto.title,
    });
  }

  @Get('GetList')
  findAll() {
    return this.statusService.findAll();
  }

  @Get('Get/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.findOne(id);
  }

  @Patch('Update/:id')
  @UseGuards(AtGuard)
  @ApiBearerAuth()
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: { title?: string },
  ) {
    return this.statusService.update(id, updateStatusDto);
  }

  @UseGuards(AtGuard)
  @ApiBearerAuth()
  @Delete('Delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.remove(id);
  }
}

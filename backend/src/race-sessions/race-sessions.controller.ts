import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
} from '@nestjs/common';
import { RaceSessionsService } from './race-sessions.service';
import { CreateRaceSessionDto, UpdateRaceSessionDto } from './dto/race-session.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('race-sessions')
@UseGuards(JwtAuthGuard)
export class RaceSessionsController {
  constructor(private raceSessionsService: RaceSessionsService) {}

  @Get()
  list(
    @Request() req: { user: { kartTrackId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.raceSessionsService.list(req.user.kartTrackId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.raceSessionsService.get(req.user.kartTrackId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { kartTrackId: string } },
    @Body() dto: CreateRaceSessionDto,
  ) {
    return this.raceSessionsService.create(req.user.kartTrackId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { kartTrackId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateRaceSessionDto,
  ) {
    return this.raceSessionsService.update(req.user.kartTrackId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.raceSessionsService.remove(req.user.kartTrackId, id);
  }
}

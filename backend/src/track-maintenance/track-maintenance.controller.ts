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
import { TrackMaintenanceService } from './track-maintenance.service';
import { CreateTrackMaintenanceDto, UpdateTrackMaintenanceDto } from './dto/track-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('track-maintenance')
@UseGuards(JwtAuthGuard)
export class TrackMaintenanceController {
  constructor(private trackMaintenanceService: TrackMaintenanceService) {}

  @Get()
  list(
    @Request() req: { user: { kartTrackId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
  ) {
    return this.trackMaintenanceService.list(req.user.kartTrackId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.trackMaintenanceService.get(req.user.kartTrackId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { kartTrackId: string } },
    @Body() dto: CreateTrackMaintenanceDto,
  ) {
    return this.trackMaintenanceService.create(req.user.kartTrackId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { kartTrackId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateTrackMaintenanceDto,
  ) {
    return this.trackMaintenanceService.update(req.user.kartTrackId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.trackMaintenanceService.remove(req.user.kartTrackId, id);
  }
}

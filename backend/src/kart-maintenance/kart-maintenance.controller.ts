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
import { KartMaintenanceService } from './kart-maintenance.service';
import { CreateKartMaintenanceDto, UpdateKartMaintenanceDto } from './dto/kart-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('kart-maintenance')
@UseGuards(JwtAuthGuard)
export class KartMaintenanceController {
  constructor(private kartMaintenanceService: KartMaintenanceService) {}

  @Get()
  list(
    @Request() req: { user: { kartTrackId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.kartMaintenanceService.list(req.user.kartTrackId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      priority,
    });
  }

  @Get('urgent')
  urgent(@Request() req: { user: { kartTrackId: string } }) {
    return this.kartMaintenanceService.urgent(req.user.kartTrackId);
  }

  @Get(':id')
  get(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.kartMaintenanceService.get(req.user.kartTrackId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { kartTrackId: string } },
    @Body() dto: CreateKartMaintenanceDto,
  ) {
    return this.kartMaintenanceService.create(req.user.kartTrackId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { kartTrackId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateKartMaintenanceDto,
  ) {
    return this.kartMaintenanceService.update(req.user.kartTrackId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.kartMaintenanceService.remove(req.user.kartTrackId, id);
  }
}

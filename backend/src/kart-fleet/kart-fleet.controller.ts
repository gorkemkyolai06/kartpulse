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
import { KartFleetService } from './kart-fleet.service';
import { CreateKartFleetDto, UpdateKartFleetDto } from './dto/kart-fleet.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('kart-fleet')
@UseGuards(JwtAuthGuard)
export class KartFleetController {
  constructor(private kartFleetService: KartFleetService) {}

  @Get()
  list(
    @Request() req: { user: { kartTrackId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('section') section?: string,
  ) {
    return this.kartFleetService.list(req.user.kartTrackId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      section,
    });
  }

  @Get(':id')
  get(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.kartFleetService.get(req.user.kartTrackId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { kartTrackId: string } },
    @Body() dto: CreateKartFleetDto,
  ) {
    return this.kartFleetService.create(req.user.kartTrackId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { kartTrackId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateKartFleetDto,
  ) {
    return this.kartFleetService.update(req.user.kartTrackId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.kartFleetService.remove(req.user.kartTrackId, id);
  }
}

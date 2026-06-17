import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { KartTrackService } from './kart-track.service';
import { UpdateKartTrackDto } from './dto/update-kart-track.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('kart-track')
@UseGuards(JwtAuthGuard)
export class KartTrackController {
  constructor(private kartTrackService: KartTrackService) {}

  @Get()
  get(@Request() req: { user: { kartTrackId: string } }) {
    return this.kartTrackService.get(req.user.kartTrackId);
  }

  @Patch()
  update(
    @Request() req: { user: { kartTrackId: string } },
    @Body() dto: UpdateKartTrackDto,
  ) {
    return this.kartTrackService.update(req.user.kartTrackId, dto);
  }
}

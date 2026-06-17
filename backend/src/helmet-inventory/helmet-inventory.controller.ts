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
import { HelmetInventoryService } from './helmet-inventory.service';
import { CreateHelmetInventoryDto, UpdateHelmetInventoryDto } from './dto/helmet-inventory.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('helmet-inventory')
@UseGuards(JwtAuthGuard)
export class HelmetInventoryController {
  constructor(private helmetInventoryService: HelmetInventoryService) {}

  @Get()
  list(
    @Request() req: { user: { kartTrackId: string } },
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('helmetType') helmetType?: string,
  ) {
    return this.helmetInventoryService.list(req.user.kartTrackId, {
      page: page ? parseInt(page, 10) : undefined,
      status,
      helmetType,
    });
  }

  @Get('available')
  available(@Request() req: { user: { kartTrackId: string } }) {
    return this.helmetInventoryService.available(req.user.kartTrackId);
  }

  @Get(':id')
  get(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.helmetInventoryService.get(req.user.kartTrackId, id);
  }

  @Post()
  @HttpCode(201)
  create(
    @Request() req: { user: { kartTrackId: string } },
    @Body() dto: CreateHelmetInventoryDto,
  ) {
    return this.helmetInventoryService.create(req.user.kartTrackId, dto);
  }

  @Patch(':id')
  update(
    @Request() req: { user: { kartTrackId: string } },
    @Param('id') id: string,
    @Body() dto: UpdateHelmetInventoryDto,
  ) {
    return this.helmetInventoryService.update(req.user.kartTrackId, id, dto);
  }

  @Delete(':id')
  remove(@Request() req: { user: { kartTrackId: string } }, @Param('id') id: string) {
    return this.helmetInventoryService.remove(req.user.kartTrackId, id);
  }
}

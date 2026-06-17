import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateKartTrackDto } from './dto/update-kart-track.dto';

@Injectable()
export class KartTrackService {
  constructor(private prisma: PrismaService) {}

  async get(kartTrackId: string) {
    const kartTrack = await this.prisma.kartTrack.findUnique({
      where: { id: kartTrackId },
    });
    if (!kartTrack) throw new NotFoundException('Kart track not found');
    return kartTrack;
  }

  async update(kartTrackId: string, dto: UpdateKartTrackDto) {
    await this.get(kartTrackId);
    return this.prisma.kartTrack.update({ where: { id: kartTrackId }, data: dto });
  }
}

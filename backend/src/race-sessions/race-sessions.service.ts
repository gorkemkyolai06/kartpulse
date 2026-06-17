import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRaceSessionDto, UpdateRaceSessionDto } from './dto/race-session.dto';

@Injectable()
export class RaceSessionsService {
  constructor(private prisma: PrismaService) {}

  async list(kartTrackId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { kartTrackId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.raceSession.findMany({
        where,
        orderBy: { sessionAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          kartFleet: { select: { id: true, name: true, section: true, kartType: true } },
        },
      }),
      this.prisma.raceSession.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(kartTrackId: string, id: string) {
    const session = await this.prisma.raceSession.findFirst({
      where: { id, kartTrackId },
      include: { kartFleet: true },
    });
    if (!session) throw new NotFoundException('Race session not found');
    return session;
  }

  async create(kartTrackId: string, dto: CreateRaceSessionDto) {
    return this.prisma.raceSession.create({
      data: {
        ...dto,
        kartTrackId,
        sessionAt: dto.sessionAt ? new Date(dto.sessionAt) : new Date(),
      },
      include: { kartFleet: true },
    });
  }

  async update(kartTrackId: string, id: string, dto: UpdateRaceSessionDto) {
    await this.get(kartTrackId, id);
    const data = { ...dto };
    if (dto.sessionAt) {
      (data as { sessionAt?: Date }).sessionAt = new Date(dto.sessionAt);
    }
    return this.prisma.raceSession.update({
      where: { id },
      data,
      include: { kartFleet: true },
    });
  }

  async remove(kartTrackId: string, id: string) {
    await this.get(kartTrackId, id);
    return this.prisma.raceSession.delete({ where: { id } });
  }
}

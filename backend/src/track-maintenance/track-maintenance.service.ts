import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackMaintenanceDto, UpdateTrackMaintenanceDto } from './dto/track-maintenance.dto';

@Injectable()
export class TrackMaintenanceService {
  constructor(private prisma: PrismaService) {}

  async list(kartTrackId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { kartTrackId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.trackMaintenance.findMany({
        where,
        orderBy: { scheduledAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.trackMaintenance.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(kartTrackId: string, id: string) {
    const maintenance = await this.prisma.trackMaintenance.findFirst({
      where: { id, kartTrackId },
    });
    if (!maintenance) throw new NotFoundException('Track maintenance not found');
    return maintenance;
  }

  async create(kartTrackId: string, dto: CreateTrackMaintenanceDto) {
    return this.prisma.trackMaintenance.create({
      data: {
        ...dto,
        kartTrackId,
        scheduledAt: new Date(dto.scheduledAt),
      },
    });
  }

  async update(kartTrackId: string, id: string, dto: UpdateTrackMaintenanceDto) {
    await this.get(kartTrackId, id);
    const data = { ...dto };
    if (dto.scheduledAt) {
      (data as { scheduledAt?: Date }).scheduledAt = new Date(dto.scheduledAt);
    }
    return this.prisma.trackMaintenance.update({ where: { id }, data });
  }

  async remove(kartTrackId: string, id: string) {
    await this.get(kartTrackId, id);
    return this.prisma.trackMaintenance.delete({ where: { id } });
  }
}

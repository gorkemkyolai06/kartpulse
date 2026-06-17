import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKartMaintenanceDto, UpdateKartMaintenanceDto } from './dto/kart-maintenance.dto';

@Injectable()
export class KartMaintenanceService {
  constructor(private prisma: PrismaService) {}

  async list(
    kartTrackId: string,
    params: { page?: number; status?: string; priority?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { kartTrackId };
    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;

    const [data, total] = await Promise.all([
      this.prisma.kartMaintenance.findMany({
        where,
        orderBy: { reportedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          kartFleet: { select: { id: true, name: true, section: true } },
        },
      }),
      this.prisma.kartMaintenance.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async urgent(kartTrackId: string) {
    return this.prisma.kartMaintenance.findMany({
      where: {
        kartTrackId,
        status: { in: ['open', 'in_progress'] },
        priority: { in: ['high', 'urgent'] },
      },
      include: { kartFleet: { select: { name: true, section: true } } },
      orderBy: { reportedAt: 'desc' },
      take: 10,
    });
  }

  async get(kartTrackId: string, id: string) {
    const maintenance = await this.prisma.kartMaintenance.findFirst({
      where: { id, kartTrackId },
      include: { kartFleet: true },
    });
    if (!maintenance) throw new NotFoundException('Kart maintenance not found');
    return maintenance;
  }

  async create(kartTrackId: string, dto: CreateKartMaintenanceDto) {
    return this.prisma.kartMaintenance.create({
      data: {
        ...dto,
        kartTrackId,
        reportedAt: dto.reportedAt ? new Date(dto.reportedAt) : new Date(),
      },
      include: { kartFleet: true },
    });
  }

  async update(kartTrackId: string, id: string, dto: UpdateKartMaintenanceDto) {
    await this.get(kartTrackId, id);
    const data = { ...dto };
    if (dto.reportedAt) {
      (data as { reportedAt?: Date }).reportedAt = new Date(dto.reportedAt);
    }
    if (dto.completedAt) {
      (data as { completedAt?: Date }).completedAt = new Date(dto.completedAt);
    }
    return this.prisma.kartMaintenance.update({
      where: { id },
      data,
      include: { kartFleet: true },
    });
  }

  async remove(kartTrackId: string, id: string) {
    await this.get(kartTrackId, id);
    return this.prisma.kartMaintenance.delete({ where: { id } });
  }
}

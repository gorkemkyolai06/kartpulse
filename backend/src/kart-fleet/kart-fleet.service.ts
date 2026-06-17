import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKartFleetDto, UpdateKartFleetDto } from './dto/kart-fleet.dto';

@Injectable()
export class KartFleetService {
  constructor(private prisma: PrismaService) {}

  async list(kartTrackId: string, params: { page?: number; status?: string; section?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { kartTrackId };
    if (params.status) where.status = params.status;
    if (params.section) where.section = params.section;

    const [data, total] = await Promise.all([
      this.prisma.kartFleet.findMany({
        where,
        orderBy: [{ section: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        include: {
          kartMaintenance: {
            where: { status: { in: ['open', 'in_progress'] } },
            take: 1,
            orderBy: { reportedAt: 'desc' },
          },
        },
      }),
      this.prisma.kartFleet.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(kartTrackId: string, id: string) {
    const kart = await this.prisma.kartFleet.findFirst({
      where: { id, kartTrackId },
      include: {
        kartMaintenance: { orderBy: { reportedAt: 'desc' }, take: 5 },
        raceSessions: { orderBy: { sessionAt: 'desc' }, take: 5 },
      },
    });
    if (!kart) throw new NotFoundException('Kart not found');
    return kart;
  }

  async create(kartTrackId: string, dto: CreateKartFleetDto) {
    return this.prisma.kartFleet.create({ data: { ...dto, kartTrackId } });
  }

  async update(kartTrackId: string, id: string, dto: UpdateKartFleetDto) {
    await this.get(kartTrackId, id);
    return this.prisma.kartFleet.update({ where: { id }, data: dto });
  }

  async remove(kartTrackId: string, id: string) {
    await this.get(kartTrackId, id);
    return this.prisma.kartFleet.delete({ where: { id } });
  }
}

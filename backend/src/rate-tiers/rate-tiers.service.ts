import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRateTierDto, UpdateRateTierDto } from './dto/rate-tier.dto';

@Injectable()
export class RateTiersService {
  constructor(private prisma: PrismaService) {}

  async list(kartTrackId: string, params: { page?: number; status?: string }) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { kartTrackId };
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      this.prisma.rateTier.findMany({
        where,
        orderBy: { rateCategory: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.rateTier.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async get(kartTrackId: string, id: string) {
    const tier = await this.prisma.rateTier.findFirst({
      where: { id, kartTrackId },
    });
    if (!tier) throw new NotFoundException('Rate tier not found');
    return tier;
  }

  async create(kartTrackId: string, dto: CreateRateTierDto) {
    return this.prisma.rateTier.create({ data: { ...dto, kartTrackId } });
  }

  async update(kartTrackId: string, id: string, dto: UpdateRateTierDto) {
    await this.get(kartTrackId, id);
    return this.prisma.rateTier.update({ where: { id }, data: dto });
  }

  async remove(kartTrackId: string, id: string) {
    await this.get(kartTrackId, id);
    return this.prisma.rateTier.delete({ where: { id } });
  }
}

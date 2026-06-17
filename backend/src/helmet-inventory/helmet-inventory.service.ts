import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHelmetInventoryDto, UpdateHelmetInventoryDto } from './dto/helmet-inventory.dto';

@Injectable()
export class HelmetInventoryService {
  constructor(private prisma: PrismaService) {}

  async list(
    kartTrackId: string,
    params: { page?: number; status?: string; helmetType?: string },
  ) {
    const page = params.page || 1;
    const limit = 20;
    const where: Record<string, unknown> = { kartTrackId };
    if (params.status) where.status = params.status;
    if (params.helmetType) where.helmetType = params.helmetType;

    const [data, total] = await Promise.all([
      this.prisma.helmetInventory.findMany({
        where,
        orderBy: [{ helmetType: 'asc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.helmetInventory.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async available(kartTrackId: string) {
    return this.prisma.helmetInventory.findMany({
      where: { kartTrackId, status: 'available' },
      orderBy: { helmetType: 'asc' },
    });
  }

  async get(kartTrackId: string, id: string) {
    const item = await this.prisma.helmetInventory.findFirst({
      where: { id, kartTrackId },
    });
    if (!item) throw new NotFoundException('Helmet item not found');
    return item;
  }

  async create(kartTrackId: string, dto: CreateHelmetInventoryDto) {
    return this.prisma.helmetInventory.create({ data: { ...dto, kartTrackId } });
  }

  async update(kartTrackId: string, id: string, dto: UpdateHelmetInventoryDto) {
    await this.get(kartTrackId, id);
    return this.prisma.helmetInventory.update({ where: { id }, data: dto });
  }

  async remove(kartTrackId: string, id: string) {
    await this.get(kartTrackId, id);
    return this.prisma.helmetInventory.delete({ where: { id } });
  }
}

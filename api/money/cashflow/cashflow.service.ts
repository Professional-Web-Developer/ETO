import { prisma } from '../../../lib/prisma';

export const CashflowService = {
  async list() {
    return prisma.cashEntry.findMany({ orderBy: { timestamp: 'desc' } });
  },
  async create(data: any) {
    return prisma.cashEntry.create({ data });
  }
};

import { prisma } from './prisma';

export async function getCashflow({ from, to, agentId, category }: { from?: Date; to?: Date; agentId?: number; category?: string } = {}) {
  const where: any = {};
  if (from || to) where.timestamp = {};
  if (from) where.timestamp.gte = from;
  if (to) where.timestamp.lte = to;
  if (agentId) where.agentId = agentId;
  if (category) where.category = category;

  return prisma.cashEntry.findMany({
    where,
    orderBy: { timestamp: 'desc' }
  });
}

export async function createCashEntry(payload: any) {
  return prisma.cashEntry.create({ data: payload });
}

export async function getObligations() {
  return prisma.obligation.findMany({ orderBy: { dueDate: 'asc' } });
}

export async function createObligation(payload: any) {
  return prisma.obligation.create({ data: payload });
}

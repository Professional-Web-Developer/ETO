import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get('range') || 'month';

    // simple report: total IN and OUT in range
    const now = new Date();
    let from = new Date();
    if (range === 'day') from.setDate(now.getDate() - 1);
    else if (range === 'week') from.setDate(now.getDate() - 7);
    else if (range === 'year') from.setFullYear(now.getFullYear() - 1);
    else from.setMonth(now.getMonth() - 1);

    const entries = await prisma.cashEntry.findMany({ where: { timestamp: { gte: from, lte: now } } });
    const totals = entries.reduce(
      (acc: { in: number; out: number }, e: any) => {
        if (e.type === 'IN') acc.in += Number(e.amount.toString());
        else acc.out += Number(e.amount.toString());
        return acc;
      },
      { in: 0, out: 0 }
    );

    return NextResponse.json({ range, totals, count: entries.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { MoneyService } from '../../../services/money.service';
import { z } from 'zod';

const cashEntrySchema = z.object({
  type: z.enum(['IN', 'OUT']),
  amount: z.preprocess((v) => (typeof v === 'string' || typeof v === 'number' ? Number(v) : NaN), z.number().positive()),
  category: z.string().optional(),
  note: z.string().optional(),
  timestamp: z.string().optional()
});

export const CashflowController = {
  async list(req: any) {
    // parse query params: range=day|week|month|year and start=ISO
    const params = req?.nextUrl?.searchParams || (req?.url ? new URL(req.url).searchParams : new URLSearchParams());
    const querySchema = z.object({ range: z.enum(['day', 'week', 'month', 'year']).optional(), start: z.string().optional(), agentId: z.string().optional(), category: z.string().optional() });
    const parsedQ = querySchema.safeParse(Object.fromEntries(params.entries()));
    let from: Date | undefined;
    let to: Date | undefined;
    let agentId: number | undefined;
    let category: string | undefined;

    if (parsedQ.success) {
      if (parsedQ.data.agentId) agentId = Number(parsedQ.data.agentId);
      if (parsedQ.data.category) category = parsedQ.data.category;

      if (parsedQ.data.range) {
        const start = parsedQ.data.start ? new Date(parsedQ.data.start) : new Date();
        const y = start.getUTCFullYear();
        const m = start.getUTCMonth();
        const d = start.getUTCDate();

        if (parsedQ.data.range === 'day') {
          from = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
          to = new Date(Date.UTC(y, m, d, 23, 59, 59, 999));
        } else if (parsedQ.data.range === 'week') {
          from = new Date(Date.UTC(y, m, d, 0, 0, 0, 0));
          to = new Date(Date.UTC(y, m, d + 7, 23, 59, 59, 999));
        } else if (parsedQ.data.range === 'month') {
          from = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
          // last day of month: day 0 of next month
          to = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
        } else if (parsedQ.data.range === 'year') {
          from = new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0));
          to = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
        }
      }
    }

    return MoneyService.listCashflow({ from, to, agentId, category });
  },
  async create(body: any) {
    const parsed = cashEntrySchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      const err: any = new Error('Validation failed');
      err.issues = errors;
      throw err;
    }

    const { type, amount, category, note, timestamp } = parsed.data;
    const payload = {
      type,
      amount: amount.toFixed(2),
      category: category || 'Other',
      note: note || null,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    };
    return MoneyService.addCashEntry(payload);
  }
};

// small helper for decimal usage since Prisma expects Decimal
function PrismaDecimal(n: number | string) {
  // Keep it simple for now; prisma client will accept string or number
  return n;
}

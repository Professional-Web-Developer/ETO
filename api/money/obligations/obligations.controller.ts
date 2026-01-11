import { MoneyService } from '../../../services/money.service';
import { z } from 'zod';

const obligationSchema = z.object({
  counterparty: z.string().min(1),
  amount: z.preprocess((v) => (typeof v === 'string' || typeof v === 'number' ? Number(v) : NaN), z.number().positive()),
  dueDate: z.string().optional(),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional()
});

export const ObligationsController = {
  async list() {
    return MoneyService.listObligations();
  },
  async create(body: any) {
    const parsed = obligationSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten();
      const err: any = new Error('Validation failed');
      err.issues = errors;
      throw err;
    }

    const { counterparty, amount, dueDate, status } = parsed.data;
    const payload = {
      counterparty,
      amount: amount.toFixed(2),
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      status: status || 'PENDING'
    };

    return MoneyService.addObligation(payload);
  }
};

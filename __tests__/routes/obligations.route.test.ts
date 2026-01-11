// mock Next.js server runtime
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, opts?: any) => ({ status: opts?.status || 200, json: async () => body })
  }
}));

import { GET, POST } from '../../app/api/money/obligations/route';
import { MoneyService } from '../../services/money.service';

jest.mock('../../services/money.service', () => ({
  MoneyService: {
    listObligations: jest.fn(),
    addObligation: jest.fn()
  }
}));

describe('obligations route handlers', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET returns 200 and json body', async () => {
    (MoneyService.listObligations as jest.Mock).mockResolvedValue([{ id: 1, counterparty: 'John' }]);
    const res: any = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('counterparty', 'John');
  });

  test('POST returns 201 on success', async () => {
    (MoneyService.addObligation as jest.Mock).mockResolvedValue({ id: 2, counterparty: 'Acme' });
    const req: any = { json: async () => ({ counterparty: 'Acme', amount: '100.00', dueDate: new Date().toISOString() }) };

    const res: any = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id', 2);
  });

  test('POST returns 400 on validation error', async () => {
    const req: any = { json: async () => ({ counterparty: '', amount: '0' }) };
    const res: any = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'validation');
  });
});
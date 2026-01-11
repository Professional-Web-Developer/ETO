// mock Next.js server runtime to avoid importing NextRequest/NextResponse that require global Request
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: any, opts?: any) => ({ status: opts?.status || 200, json: async () => body })
  }
}));

import { GET, POST } from '../../app/api/money/cashflow/route';
import { MoneyService } from '../../services/money.service';

jest.mock('../../services/money.service', () => ({
  MoneyService: {
    listCashflow: jest.fn(),
    addCashEntry: jest.fn()
  }
}));

describe('cashflow route handlers', () => {
  afterEach(() => jest.clearAllMocks());

  test('GET returns 200 and json body', async () => {
    (MoneyService.listCashflow as jest.Mock).mockResolvedValue([{ id: 1, amount: '100.00' }]);
    const req: any = { nextUrl: new URL('http://localhost/?range=day') };

    const res: any = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body[0]).toHaveProperty('id', 1);
  });

  test('POST returns 201 on success', async () => {
    (MoneyService.addCashEntry as jest.Mock).mockResolvedValue({ id: 2, amount: '50.00' });
    const req: any = { json: async () => ({ type: 'IN', amount: '50.00', category: 'Misc' }) };

    const res: any = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id', 2);
  });

  test('POST returns 400 on validation error', async () => {
    const req: any = { json: async () => ({ type: 'IN', amount: 0 }) };

    const res: any = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toHaveProperty('error', 'validation');
  });
});
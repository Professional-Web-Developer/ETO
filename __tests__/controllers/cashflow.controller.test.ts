import { CashflowController } from '../../api/money/cashflow/cashflow.controller';
import { MoneyService } from '../../services/money.service';

jest.mock('../../services/money.service', () => ({
  MoneyService: {
    addCashEntry: jest.fn(),
    listCashflow: jest.fn()
  }
}));

describe('CashflowController', () => {
  afterEach(() => jest.clearAllMocks());

  test('create should validate and call MoneyService.addCashEntry on valid input', async () => {
    const payload = { type: 'IN', amount: '100.00', category: 'Salary' };
    (MoneyService.addCashEntry as jest.Mock).mockResolvedValue({ id: 1, ...payload });

    const res = await CashflowController.create(payload as any);
    expect(MoneyService.addCashEntry).toHaveBeenCalled();
    expect(res).toHaveProperty('id', 1);
  });

  test('create should throw validation error on invalid amount', async () => {
    await expect(CashflowController.create({ type: 'IN', amount: 0 } as any)).rejects.toMatchObject({ message: 'Validation failed' });
  });

  test('list should call MoneyService.listCashflow', async () => {
    (MoneyService.listCashflow as jest.Mock).mockResolvedValue([]);
    const res = await CashflowController.list({} as any);
    expect(MoneyService.listCashflow).toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  test('list should parse day range and call service with from/to', async () => {
    const spy = MoneyService.listCashflow as jest.Mock;
    spy.mockResolvedValue([]);
    const url = 'http://localhost/?range=day&start=2026-01-10T00:00:00.000Z';
    const req: any = { nextUrl: new URL(url) };

    await CashflowController.list(req);
    expect(spy).toHaveBeenCalled();
    const calledWith = spy.mock.calls[0][0];
    expect(calledWith.from).toBeInstanceOf(Date);
    expect(calledWith.to).toBeInstanceOf(Date);
    // from should be start of day in UTC
    expect(calledWith.from.getUTCFullYear()).toBe(2026);
    expect(calledWith.from.getUTCMonth()).toBe(0); // January
    expect(calledWith.from.getUTCDate()).toBe(10);
  });

  test('list should parse month range and call service with month boundaries', async () => {
    const spy = MoneyService.listCashflow as jest.Mock;
    spy.mockResolvedValue([]);
    const url = 'http://localhost/?range=month&start=2026-03-05T00:00:00.000Z&agentId=5&category=Salary';
    const req: any = { nextUrl: new URL(url) };

    await CashflowController.list(req);
    expect(spy).toHaveBeenCalled();
    const calledWith = spy.mock.calls[0][0];
    expect(calledWith.from.getUTCFullYear()).toBe(2026);
    expect(calledWith.from.getUTCMonth()).toBe(2); // March
    expect(calledWith.to.getUTCFullYear()).toBe(2026);
    expect(calledWith.to.getUTCMonth()).toBe(2); // March
    expect(calledWith.agentId).toBe(5);
    expect(calledWith.category).toBe('Salary');
  });
});
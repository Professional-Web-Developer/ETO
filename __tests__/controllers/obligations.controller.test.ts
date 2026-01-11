import { ObligationsController } from '../../api/money/obligations/obligations.controller';
import { MoneyService } from '../../services/money.service';

jest.mock('../../services/money.service', () => ({
  MoneyService: {
    addObligation: jest.fn(),
    listObligations: jest.fn()
  }
}));

describe('ObligationsController', () => {
  afterEach(() => jest.clearAllMocks());

  test('create should validate and call MoneyService.addObligation on valid input', async () => {
    const payload = { counterparty: 'Acme', amount: '100.00', dueDate: new Date().toISOString() };
    (MoneyService.addObligation as jest.Mock).mockResolvedValue({ id: 1, ...payload });

    const res = await ObligationsController.create(payload as any);
    expect(MoneyService.addObligation).toHaveBeenCalled();
    expect(res).toHaveProperty('id', 1);
  });

  test('create should throw validation error on missing counterparty', async () => {
    await expect(ObligationsController.create({ counterparty: '', amount: '50' } as any)).rejects.toMatchObject({ message: 'Validation failed' });
  });

  test('list should call MoneyService.listObligations', async () => {
    (MoneyService.listObligations as jest.Mock).mockResolvedValue([]);
    const res = await ObligationsController.list();
    expect(MoneyService.listObligations).toHaveBeenCalled();
    expect(res).toEqual([]);
  });
});
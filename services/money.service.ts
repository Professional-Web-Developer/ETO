import * as moneyLib from '../lib/money';

export const MoneyService = {
  async listCashflow(opts?: any) {
    return moneyLib.getCashflow(opts);
  },
  async addCashEntry(data: any) {
    // business validation, ensure amount > 0 and type present
    if (!data?.amount || Number(data.amount) <= 0) throw new Error('Invalid amount');
    return moneyLib.createCashEntry(data);
  },
  async listObligations() {
    return moneyLib.getObligations();
  },
  async addObligation(data: any) {
    if (!data?.counterparty || !data?.amount) throw new Error('Invalid obligation');
    return moneyLib.createObligation(data);
  }
};

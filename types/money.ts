export type CashEntry = {
  id: number;
  type: 'IN' | 'OUT';
  amount: string;
  category: string;
  note?: string;
  timestamp: string;
};

export type Obligation = {
  id: number;
  counterparty: string;
  amount: string;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
};

export type Lending = {
  id: number;
  direction: string;
  person: string;
  amount: string;
  dueDate?: string;
};
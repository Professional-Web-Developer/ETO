import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CashEntryForm from '../../components/money/CashEntryForm';

describe('CashEntryForm optimistic updates', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test('calls mutate optimistically and revalidates on success', async () => {
    const mockMutate = jest.fn().mockResolvedValue(undefined);

    // mock fetch: first call returns empty previous list, second call is POST
    (global as any).fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ json: async () => [] }))
      .mockImplementationOnce((url: string, opts: any) => {
        expect(url).toMatch(/\/api\/money\/cashflow$/);
        expect(opts.method).toBe('POST');
        return Promise.resolve({ ok: true, json: async () => ({ id: 1, type: 'IN', amount: opts.body ? JSON.parse(opts.body).amount : '0.00', category: 'Salary', note: '', timestamp: new Date().toISOString() }) });
      });

    render(<CashEntryForm mutateCashflow={mockMutate} />);

    const amountInput = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(amountInput, '15.50');
    await userEvent.click(addButton);

    // optimistic mutate should be called with an array whose first item is temp with negative id
    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    const firstCallArgs = (mockMutate.mock.calls[0] || []);
    expect(Array.isArray(firstCallArgs[0])).toBe(true);
    const optimistic = firstCallArgs[0][0];
    expect(optimistic.id).toBeLessThan(0);
    expect(optimistic.amount).toBe('15.50');
    expect(firstCallArgs[1]).toBe(false);

    // ensure revalidation call (no args) happened after success
    await waitFor(() => expect(mockMutate).toHaveBeenCalledWith());
  });

  test('reverts optimistic update on server error', async () => {
    const mockMutate = jest.fn().mockResolvedValue(undefined);

    // first fetch returns previous list with one existing entry
    const prev = [{ id: 100, type: 'IN', amount: '10.00', category: 'Salary', timestamp: new Date().toISOString() }];

    (global as any).fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ json: async () => prev }))
      .mockImplementationOnce(() => Promise.resolve({ ok: false, json: async () => ({ error: 'server' }) }));

    render(<CashEntryForm mutateCashflow={mockMutate} />);

    const amountInput = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add/i });

    await userEvent.type(amountInput, '20.00');
    await userEvent.click(addButton);

    // optimistic mutate called first
    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    expect(mockMutate.mock.calls[0][1]).toBe(false);

    // on failure, mutate should be called with previous to rollback
    await waitFor(() => expect(mockMutate).toHaveBeenCalledWith(prev, false));
  });
});

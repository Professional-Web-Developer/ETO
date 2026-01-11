import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ObligationForm from '../../components/money/ObligationForm';

describe('ObligationForm optimistic updates', () => {
  beforeEach(() => jest.restoreAllMocks());

  test('calls mutate optimistically and revalidates on success', async () => {
    const mockMutate = jest.fn().mockResolvedValue(undefined);

    (global as any).fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ json: async () => [] }))
      .mockImplementationOnce((url: string, opts: any) => {
        expect(url).toMatch(/\/api\/money\/obligations$/);
        expect(opts.method).toBe('POST');
        return Promise.resolve({ ok: true, json: async () => ({ id: 1, counterparty: JSON.parse(opts.body).counterparty, amount: JSON.parse(opts.body).amount, dueDate: JSON.parse(opts.body).dueDate }) });
      });

    render(<ObligationForm mutateObligations={mockMutate} />);

    const counter = screen.getByPlaceholderText('Counterparty') as HTMLInputElement;
    const amount = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add obligation/i });

    await userEvent.type(counter, 'John');
    await userEvent.type(amount, '45');
    await userEvent.click(addButton);

    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    const firstCallArgs = (mockMutate.mock.calls[0] || []);
    expect(Array.isArray(firstCallArgs[0])).toBe(true);
    const optimistic = firstCallArgs[0][0];
    expect(optimistic.id).toBeLessThan(0);
    expect(optimistic.amount).toBe('45.00');
    expect(firstCallArgs[1]).toBe(false);

    await waitFor(() => expect(mockMutate).toHaveBeenCalledWith());
  });

  test('reverts optimistic update on server error', async () => {
    const mockMutate = jest.fn().mockResolvedValue(undefined);

    const prev = [{ id: 100, counterparty: 'Jane', amount: '10.00', dueDate: new Date().toISOString() }];

    (global as any).fetch = jest.fn()
      .mockImplementationOnce(() => Promise.resolve({ json: async () => prev }))
      .mockImplementationOnce(() => Promise.resolve({ ok: false, json: async () => ({ error: 'server' }) }));

    render(<ObligationForm mutateObligations={mockMutate} />);

    const counter = screen.getByPlaceholderText('Counterparty') as HTMLInputElement;
    const amount = screen.getByPlaceholderText('Amount') as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: /add obligation/i });

    await userEvent.type(counter, 'Jane');
    await userEvent.type(amount, '20');
    await userEvent.click(addButton);

    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    expect(mockMutate.mock.calls[0][1]).toBe(false);

    await waitFor(() => expect(mockMutate).toHaveBeenCalledWith(prev, false));
  });
});
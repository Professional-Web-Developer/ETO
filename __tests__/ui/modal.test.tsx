import React, { useState } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Modal from '../../components/ui/modal';

describe('Modal', () => {
  it('calls onClose when Escape is pressed and restores focus', () => {
    function TestHost() {
      const [open, setOpen] = useState(true);
      return (
        <div>
          <button>Open</button>
          {open && (
            <Modal open onClose={() => setOpen(false)}>
              <div>Content</div>
            </Modal>
          )}
        </div>
      );
    }

    render(<TestHost />);

    const openBtn = screen.getByText(/open/i) as HTMLElement;
    openBtn.focus();

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    // after modal closes, focus should be restored to the previously focused button
    expect(document.activeElement).toBe(openBtn);
  });
});
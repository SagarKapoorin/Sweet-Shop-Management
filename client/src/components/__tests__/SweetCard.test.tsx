import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SweetCard from '../SweetCard';
import { type Sweet } from '../../types/types';

const baseSweet: Sweet = {
  id: '1',
  name: 'Chocolate Truffle',
  category: 'Chocolate',
  price: 4.5,
  stock: 10,
  description: 'Rich and creamy truffle',
};

describe('SweetCard', () => {
  it('shows out-of-stock state and disables purchase', () => {
    const onPurchase = vi.fn();
    render(<SweetCard sweet={{ ...baseSweet, stock: 0 }} role={null} onPurchase={onPurchase} />);

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purchase chocolate truffle/i)).toBeDisabled();
  });

  it('renders admin controls when role is admin', () => {
    const onPurchase = vi.fn();
    render(<SweetCard sweet={baseSweet} role="admin" onPurchase={onPurchase} />);

    expect(screen.getByLabelText(/edit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/delete/i)).toBeInTheDocument();
  });

  it('calls purchase handler when clicking purchase without triggering card view', async () => {
    const user = userEvent.setup();
    const onPurchase = vi.fn();
    const onView = vi.fn();
    render(<SweetCard sweet={baseSweet} role="user" onPurchase={onPurchase} onView={onView} />);

    await user.click(screen.getByLabelText(/purchase chocolate truffle/i));
    expect(onPurchase).toHaveBeenCalledWith(expect.objectContaining({ id: baseSweet.id }));
    expect(onView).not.toHaveBeenCalled();
  });

  it('invokes view handler when card is activated', async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    render(<SweetCard sweet={baseSweet} onPurchase={vi.fn()} onView={onView} />);

    await user.click(screen.getByTestId('sweet-card'));
    expect(onView).toHaveBeenCalledWith(expect.objectContaining({ id: baseSweet.id }));
  });
});

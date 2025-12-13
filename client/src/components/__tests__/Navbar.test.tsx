import type { ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { type User } from '../../types/types';

const mockLogout = vi.fn();
let mockUser: User | null = null;

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser, logout: mockLogout })
}));

const renderNavbar = (uiProps?: ComponentProps<typeof Navbar>) =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Navbar {...uiProps} />
    </MemoryRouter>
  );

describe('Navbar', () => {
  beforeEach(() => {
    mockUser = null;
    mockLogout.mockClear();
  });

  it('shows login link when user is not authenticated', () => {
    renderNavbar();

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('shows admin action and triggers callbacks when authenticated admin', async () => {
    const user = userEvent.setup();
    const onOpenAdmin = vi.fn();
    mockUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
    };

    renderNavbar({ onOpenAdmin });

    expect(screen.getByText(/add sweet/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /add sweet/i }));
    expect(onOpenAdmin).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /logout/i }));
    expect(mockLogout).toHaveBeenCalled();
  });
});

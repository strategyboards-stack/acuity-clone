import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { App } from '../App';
import { setActiveToken } from '../lib/sessionService';

describe('client self-service phase 4B flows', () => {
  beforeEach(() => {
    setActiveToken('token-valid');
  });

  it('renders appointments with upcoming and past segmentation', async () => {
    render(
      <MemoryRouter initialEntries={['/client/appointments']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Upcoming appointments' })).toBeInTheDocument();
    expect(screen.getByText('Initial Consultation')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Past appointments' })).toBeInTheDocument();
    expect(screen.getByText('Follow-up Session')).toBeInTheDocument();
  });

  it('supports action entry routes from authenticated surfaces', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/client/appointments']}>
        <App />
      </MemoryRouter>
    );

    const rescheduleLink = await screen.findByRole('link', { name: 'Reschedule' });
    await user.click(rescheduleLink);

    expect(await screen.findByRole('heading', { name: 'Reschedule flow entry' })).toBeInTheDocument();
  });

  it('logs out and moves to login placeholder', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/client/appointments']}>
        <App />
      </MemoryRouter>
    );

    const logoutButton = await screen.findByRole('button', { name: 'Logout' });
    await user.click(logoutButton);

    expect(await screen.findByText('Client login placeholder')).toBeInTheDocument();
  });

  it('renders invalid token handling when session is missing', async () => {
    setActiveToken(null);
    render(
      <MemoryRouter initialEntries={['/client/appointments']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Session unavailable' })).toBeInTheDocument();
  });

  it('renders empty states for appointments and manage codes', async () => {
    setActiveToken('token-empty');
    render(
      <MemoryRouter initialEntries={['/client/appointments']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('You have no upcoming appointments.')).toBeInTheDocument();
    expect(screen.getByText('You have no past appointments.')).toBeInTheDocument();

    render(
      <MemoryRouter initialEntries={['/client/manage-codes']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('You do not have any active or historical codes yet.')).toBeInTheDocument();
  });
});

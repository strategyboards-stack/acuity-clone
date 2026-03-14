import { NavLink } from 'react-router-dom';

interface ClientNavigationProps {
  onLogout: () => void;
}

export function ClientNavigation({ onLogout }: ClientNavigationProps) {
  return (
    <header className="nav-shell">
      <h1>Client Account</h1>
      <nav aria-label="Client account menu" className="menu">
        <NavLink to="/client/appointments">Appointments</NavLink>
        <NavLink to="/client/manage-codes">Manage codes</NavLink>
        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

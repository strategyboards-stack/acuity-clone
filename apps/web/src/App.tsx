import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import type { SelfServiceModel } from '@acuity/contracts';
import { AppointmentList } from './components/AppointmentList';
import { ClientNavigation } from './components/ClientNavigation';
import { ManageCodes } from './components/ManageCodes';
import { NotAuthorized } from './components/NotAuthorized';
import { getActiveToken, loadClientSelfService, setActiveToken } from './lib/sessionService';

export function App() {
  const [model, setModel] = useState<SelfServiceModel | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientSelfService(getActiveToken()).then((next) => {
      setModel(next);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <main className="panel">Loading…</main>;
  }

  if (!model) {
    return (
      <Routes>
        <Route path="/client/login" element={<main className="panel">Client login placeholder</main>} />
        <Route path="*" element={<NotAuthorized />} />
      </Routes>
    );
  }

  const logout = () => {
    setActiveToken(null);
    setModel(null);
    navigate('/client/login');
  };

  return (
    <>
      <ClientNavigation onLogout={logout} />
      <Routes>
        <Route path="/" element={<Navigate to="/client/appointments" replace />} />
        <Route path="/client/appointments" element={<AppointmentList appointments={model.appointments} />} />
        <Route path="/client/manage-codes" element={<ManageCodes codes={model.manageCodes} />} />
        <Route path="/client/appointments/:publicCode/:action" element={<ActionEntry />} />
        <Route path="*" element={<main className="panel">Not found.</main>} />
      </Routes>
    </>
  );
}

function ActionEntry() {
  const { publicCode, action } = useParams();

  if (!publicCode || !action) {
    return <main className="panel">Invalid appointment action token.</main>;
  }

  if (!['edit-info', 'reschedule', 'cancel'].includes(action)) {
    return <main className="panel">Invalid appointment action token.</main>;
  }

  return (
    <main className="panel">
      <h2>{toTitle(action)} flow entry</h2>
      <p>Appointment code: {publicCode}</p>
      <p>This is the authenticated handoff entrypoint for {action}.</p>
    </main>
  );
}

function toTitle(action: string): string {
  if (action === 'edit-info') return 'Edit info';
  if (action === 'reschedule') return 'Reschedule';
  return 'Cancel';
}

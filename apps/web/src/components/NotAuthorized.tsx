import { Link } from 'react-router-dom';

export function NotAuthorized() {
  return (
    <main className="panel" role="status">
      <h2>Session unavailable</h2>
      <p>The login token is invalid or has expired. Please sign in again.</p>
      <Link to="/client/login">Go to client login</Link>
    </main>
  );
}

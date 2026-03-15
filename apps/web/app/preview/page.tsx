import Link from 'next/link';
import { demoIdentities, previewSurfaces, statusLabel } from '../../lib/demoData';

export default function PreviewIndexPage() {
  const grouped = {
    clickable: previewSurfaces.filter((s) => s.status === 'clickable'),
    backend_only: previewSurfaces.filter((s) => s.status === 'backend_only'),
    not_implemented: previewSurfaces.filter((s) => s.status === 'not_implemented')
  };

  return (
    <main>
      <h1>/preview demo mode</h1>
      <p>Local-only entry surface to review currently implemented slices without relying on production auth providers.</p>

      <div className="card">
        <h2>Demo identities (local-only)</h2>
        <ul>
          {demoIdentities.map((identity) => (
            <li key={identity.id}><strong>{identity.role}</strong> — {identity.email}</li>
          ))}
        </ul>
        <p>
          Use route query parameter <code>?as=demo-owner</code>, <code>?as=demo-client</code>, or <code>?as=demo-contributor</code> on any preview route.
        </p>
      </div>

      <h2>Implemented and clickable now</h2>
      <div className="grid">
        {grouped.clickable.map((surface) => (
          <article className="card" key={surface.slug}>
            <span className={`pill ${surface.status}`}>{statusLabel[surface.status]}</span>
            <h3>{surface.name}</h3>
            <p>{surface.notes}</p>
            <Link href={`/preview/${surface.slug}`}>Open route</Link>
          </article>
        ))}
      </div>

      <h2>Backend/domain-only (not visually reviewable yet)</h2>
      {grouped.backend_only.map((surface) => (
        <article className="card" key={surface.slug}>
          <span className={`pill ${surface.status}`}>{statusLabel[surface.status]}</span>
          <h3>{surface.name}</h3>
          <p>{surface.notes}</p>
        </article>
      ))}

      <h2>Not implemented yet</h2>
      {grouped.not_implemented.map((surface) => (
        <article className="card" key={surface.slug}>
          <span className={`pill ${surface.status}`}>{statusLabel[surface.status]}</span>
          <h3>{surface.name}</h3>
          <p>{surface.notes}</p>
        </article>
      ))}
    </main>
  );
}

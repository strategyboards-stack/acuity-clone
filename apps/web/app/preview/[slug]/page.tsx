import Link from 'next/link';
import { notFound } from 'next/navigation';
import { demoIdentities, previewSurfaces, statusLabel } from '../../../lib/demoData';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ as?: string }>;
};

export default async function PreviewSurfacePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const surface = previewSurfaces.find((item) => item.slug === slug);

  if (!surface) {
    notFound();
  }

  const identity = demoIdentities.find((entry) => entry.id === query.as) ?? demoIdentities[0];

  return (
    <main>
      <p><Link href="/preview">← Back to preview index</Link></p>
      <h1>{surface.name}</h1>
      <p><span className={`pill ${surface.status}`}>{statusLabel[surface.status]}</span></p>

      <div className="card">
        <h2>Local demo identity</h2>
        <p>Viewing as <strong>{identity.role}</strong> ({identity.email}).</p>
        <p>
          Quick switch:
          {' '}
          {demoIdentities.map((entry) => (
            <Link key={entry.id} href={`/preview/${slug}?as=${entry.id}`} style={{ marginRight: 12 }}>
              {entry.role}
            </Link>
          ))}
        </p>
      </div>

      <div className="card">
        <h2>Surface note</h2>
        <p>{surface.notes}</p>
        <p>This is intentionally local preview scaffolding for manual review of current progress.</p>
      </div>
    </main>
  );
}

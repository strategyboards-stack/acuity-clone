import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Acuity Clone Local Preview</h1>
      <p>This repository currently ships a demo review shell so product slices can be clicked and reviewed in-browser.</p>
      <div className="card">
        <h2>Start here</h2>
        <p><Link href="/preview">Open /preview route index</Link></p>
      </div>
    </main>
  );
}

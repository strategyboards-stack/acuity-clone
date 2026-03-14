import type { ManageCode } from '@acuity/contracts';

interface ManageCodesProps {
  codes: ManageCode[];
}

export function ManageCodes({ codes }: ManageCodesProps) {
  return (
    <main className="panel">
      <h2>Manage codes</h2>
      {codes.length === 0 ? (
        <p>You do not have any active or historical codes yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Status</th>
              <th>Remaining uses</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.code}>
                <td>{code.code}</td>
                <td>{code.type}</td>
                <td>{code.status}</td>
                <td>{code.remainingUses ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

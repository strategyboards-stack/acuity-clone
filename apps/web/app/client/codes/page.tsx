import { getSessionClient } from "@/lib/auth/session";
import { getCodesForClient } from "@/lib/data/store";

export default async function ManageCodesPage() {
  const client = await getSessionClient();
  if (!client) return null;

  const codes = getCodesForClient(client.id);

  return (
    <main className="stack">
      <h1>Manage codes</h1>
      <div className="card">
        {codes.length === 0 ? (
          <p>No active codes found.</p>
        ) : (
          <table className="table" aria-label="Client codes list">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Status</th>
                <th>Expiry</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((code) => (
                <tr key={code.id}>
                  <td>{code.code}</td>
                  <td>{code.type}</td>
                  <td>{code.status}</td>
                  <td>{code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

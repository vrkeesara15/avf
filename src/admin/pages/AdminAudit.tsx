import { adminApi } from "../adminApi";
import { useAsync } from "../useAsync";

export function AdminAudit() {
  const { data, loading, error } = useAsync(() => adminApi.getAudit());

  return (
    <div>
      <header className="admin-page__head">
        <h1>Audit Log</h1>
        <p>Every admin action, timestamped (ADM-07). Super-admin only.</p>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}

      {data && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>User</th>
                <th>Action</th>
                <th>Target</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="admin-table__empty">
                    No actions logged yet.
                  </td>
                </tr>
              )}
              {data.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.createdAt).toLocaleString("en-IN")}</td>
                  <td>{a.userEmail}</td>
                  <td>
                    <code>{a.action}</code>
                  </td>
                  <td>{a.target ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { adminApi } from "../adminApi";
import { useAsync } from "../useAsync";

const STATUSES = ["pending", "active", "inactive"];

export function AdminVolunteers() {
  const { data, loading, error, setData } = useAsync(() =>
    adminApi.getVolunteers()
  );

  const onChange = async (id: string, status: string) => {
    const updated = await adminApi.updateVolunteer(id, status);
    setData((prev) =>
      (prev ?? []).map((v) => (v.id === id ? updated : v))
    );
  };

  return (
    <div>
      <header className="admin-page__head">
        <h1>Volunteers</h1>
        <p>Review registrations and update their status (ADM-04).</p>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}

      {data && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Interest</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table__empty">
                    No volunteers yet.
                  </td>
                </tr>
              )}
              {data.map((v) => (
                <tr key={v.id}>
                  <td>{v.name}</td>
                  <td>{v.email}</td>
                  <td>{v.phone}</td>
                  <td>{v.city}</td>
                  <td>{v.interest}</td>
                  <td>
                    <select
                      className="select select--inline"
                      value={v.status}
                      onChange={(e) => onChange(v.id, e.target.value)}
                      aria-label={`Status for ${v.name}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

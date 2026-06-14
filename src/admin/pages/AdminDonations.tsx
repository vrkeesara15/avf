import { adminApi } from "../adminApi";
import { useAsync } from "../useAsync";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function AdminDonations() {
  const { data, loading, error } = useAsync(() => adminApi.getDonations());

  return (
    <div>
      <header className="admin-page__head admin-page__head--row">
        <div>
          <h1>Donations</h1>
          <p>All donation records with 80G receipt status (ADM-03).</p>
        </div>
        <button
          className="btn btn--primary btn--sm"
          onClick={() => adminApi.downloadDonationsCsv()}
        >
          ⬇ Export CSV
        </button>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}

      {data && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Donor</th>
                <th>PAN</th>
                <th>City</th>
                <th>Amount</th>
                <th>Frequency</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-table__empty">
                    No donations yet.
                  </td>
                </tr>
              )}
              {data.map((d) => (
                <tr key={d.id}>
                  <td>{d.receiptNo ?? "—"}</td>
                  <td>{d.donorName ?? "—"}</td>
                  <td>{d.pan ?? "—"}</td>
                  <td>{d.city ?? "—"}</td>
                  <td>{inr(d.amount)}</td>
                  <td>{d.frequency}</td>
                  <td>
                    <span className={`pill pill--${d.status}`}>{d.status}</span>
                  </td>
                  <td>
                    {new Date(d.paidAt ?? d.createdAt).toLocaleDateString(
                      "en-IN"
                    )}
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

import { adminApi } from "../adminApi";
import { useAsync } from "../useAsync";

const STATUSES = ["new", "in_progress", "resolved"];

export function AdminInquiries() {
  const { data, loading, error, setData } = useAsync(() =>
    adminApi.getInquiries()
  );

  const onChange = async (id: string, status: string) => {
    const updated = await adminApi.updateInquiry(id, status);
    setData((prev) => (prev ?? []).map((i) => (i.id === id ? updated : i)));
  };

  return (
    <div>
      <header className="admin-page__head">
        <h1>Inquiries</h1>
        <p>Contact &amp; CSR partnership submissions (ADM-08).</p>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}

      {data && (
        <div className="admin-cards">
          {data.length === 0 && <p>No inquiries yet.</p>}
          {data.map((i) => (
            <article className="admin-card" key={i.id}>
              <div className="admin-card__top">
                <span className={`pill pill--${i.type}`}>{i.type}</span>
                <select
                  className="select select--inline"
                  value={i.status}
                  onChange={(e) => onChange(i.id, e.target.value)}
                  aria-label={`Status for inquiry`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              {i.type === "contact" ? (
                <>
                  <h3>{i.subject}</h3>
                  <p className="admin-card__meta">
                    {i.name} · {i.email}
                  </p>
                  <p>{i.message}</p>
                </>
              ) : (
                <>
                  <h3>{i.orgName}</h3>
                  <p className="admin-card__meta">
                    {i.contact} · {i.email}
                  </p>
                  <p>{i.nature}</p>
                </>
              )}
              <p className="admin-card__date">
                {new Date(i.createdAt).toLocaleString("en-IN")}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

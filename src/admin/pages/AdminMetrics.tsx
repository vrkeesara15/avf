import { useState } from "react";
import { adminApi, type Metric } from "../adminApi";
import { useAsync } from "../useAsync";

function MetricRow({
  metric,
  onSave,
}: {
  metric: Metric;
  onSave: (id: string, value: number) => Promise<void>;
}) {
  const [value, setValue] = useState(metric.value);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async () => {
    setSaving(true);
    await onSave(metric.id, value);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="admin-metric">
      <label htmlFor={`m-${metric.id}`}>{metric.label}</label>
      <div className="admin-metric__control">
        <input
          id={`m-${metric.id}`}
          type="number"
          className="input"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <button
          className="btn btn--primary btn--sm"
          onClick={save}
          disabled={saving || value === metric.value}
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}

export function AdminMetrics() {
  const { data, loading, error, setData } = useAsync(() =>
    adminApi.getMetrics()
  );

  const onSave = async (id: string, value: number) => {
    const updated = await adminApi.updateMetric(id, value);
    setData((prev) => (prev ?? []).map((m) => (m.id === id ? updated : m)));
  };

  return (
    <div>
      <header className="admin-page__head">
        <h1>Impact Metrics</h1>
        <p>
          Update the numbers shown across the public site. Changes appear
          everywhere immediately (IMP-02 / ADM-06).
        </p>
      </header>

      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}

      {data && (
        <div className="admin-metrics">
          {data.map((m) => (
            <MetricRow key={m.id} metric={m} onSave={onSave} />
          ))}
        </div>
      )}
    </div>
  );
}

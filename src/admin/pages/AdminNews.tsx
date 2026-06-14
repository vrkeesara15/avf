import { useState } from "react";
import { adminApi, type Post } from "../adminApi";
import { useAsync } from "../useAsync";

const CATEGORIES = ["News", "Event Recap", "Success Story", "Announcement"];
const COLORS = ["#1b4f8a", "#d8631a", "#2e9e6b", "#7c3aed"];

const today = () => new Date().toLocaleDateString("en-GB"); // DD/MM/YYYY

export function AdminNews() {
  const { data, loading, error, setData } = useAsync(() => adminApi.getPosts());
  const [form, setForm] = useState<Partial<Post>>({
    title: "",
    category: "News",
    excerpt: "",
    icon: "📰",
    color: COLORS[0],
  });
  const [busy, setBusy] = useState(false);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt) return;
    setBusy(true);
    try {
      const post = await adminApi.createPost({ ...form, date: today() });
      setData((prev) => [post, ...(prev ?? [])]);
      setForm({ title: "", category: "News", excerpt: "", icon: "📰", color: COLORS[0] });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    await adminApi.deletePost(id);
    setData((prev) => (prev ?? []).filter((p) => p.id !== id));
  };

  return (
    <div>
      <header className="admin-page__head">
        <h1>News &amp; Stories</h1>
        <p>Publish posts shown on the homepage and newsroom (ADM-02 / NEWS-01).</p>
      </header>

      <form className="admin-form" onSubmit={create} aria-label="Create post">
        <h2>New post</h2>
        <div className="field">
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            className="input"
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="admin-form__row">
          <div className="field">
            <label htmlFor="post-cat">Category</label>
            <select
              id="post-cat"
              className="select"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="post-icon">Icon (emoji)</label>
            <input
              id="post-icon"
              className="input"
              value={form.icon ?? ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="post-excerpt">Excerpt</label>
          <textarea
            id="post-excerpt"
            className="textarea"
            value={form.excerpt ?? ""}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
          />
        </div>
        <button className="btn btn--primary" disabled={busy}>
          {busy ? "Publishing…" : "Publish post"}
        </button>
      </form>

      <h2 style={{ marginTop: "2rem" }}>Published posts</h2>
      {loading && <p>Loading…</p>}
      {error && <p className="field-error">{error}</p>}
      {data && (
        <div className="admin-cards">
          {data.length === 0 && <p>No posts yet.</p>}
          {data.map((p) => (
            <article className="admin-card" key={p.id}>
              <div className="admin-card__top">
                <span className="pill" style={{ background: p.color, color: "#fff" }}>
                  {p.icon} {p.category}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => remove(p.id)}
                >
                  Delete
                </button>
              </div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <p className="admin-card__date">{p.date}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

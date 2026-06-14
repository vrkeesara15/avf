import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function AdminLogin() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) {
    navigate("/admin", { replace: true });
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card" onSubmit={onSubmit} aria-label="Admin login">
        <div className="admin__brand admin__brand--center">
          <span className="admin__brand-mark">AV</span>
          <strong>Akshaya Vidya Foundation</strong>
        </div>
        <h1>Admin Sign In</h1>
        <p className="form-note">Manage donations, volunteers, content and impact.</p>

        {error && (
          <div className="field-error" role="alert" style={{ marginBottom: "1rem" }}>
            {error}
          </div>
        )}

        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
        <p className="form-note" style={{ marginTop: "1rem", textAlign: "center" }}>
          Default seed login: <code>admin@akshayavidya.org</code>
        </p>
      </form>
    </div>
  );
}

import { Link } from "react-router-dom";
import { adminApi } from "../adminApi";
import { useAsync } from "../useAsync";
import { useAuth } from "../AuthContext";

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function AdminDashboard() {
  const { user } = useAuth();
  const canSeeDonations =
    user?.role === "super_admin" || user?.role === "donation_viewer";
  const stats = useAsync(() =>
    canSeeDonations
      ? adminApi.getDonationStats()
      : Promise.resolve(null)
  );
  const volunteers = useAsync(() => adminApi.getVolunteers());
  const inquiries = useAsync(() => adminApi.getInquiries());

  return (
    <div>
      <header className="admin-page__head">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}.</p>
      </header>

      <div className="admin-stats">
        {canSeeDonations && (
          <>
            <div className="admin-stat">
              <span className="admin-stat__label">Total raised</span>
              <span className="admin-stat__value">
                {stats.data ? inr(stats.data.totalRaised) : "—"}
              </span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">This month</span>
              <span className="admin-stat__value">
                {stats.data ? inr(stats.data.monthRaised) : "—"}
              </span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">Donations</span>
              <span className="admin-stat__value">
                {stats.data?.totalDonations ?? "—"}
              </span>
            </div>
          </>
        )}
        <div className="admin-stat">
          <span className="admin-stat__label">Volunteers</span>
          <span className="admin-stat__value">
            {volunteers.data?.length ?? "—"}
          </span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat__label">Open inquiries</span>
          <span className="admin-stat__value">
            {inquiries.data
              ? inquiries.data.filter((i) => i.status !== "resolved").length
              : "—"}
          </span>
        </div>
      </div>

      <div className="admin-quick">
        <h2>Quick actions</h2>
        <div className="admin-quick__grid">
          {canSeeDonations && (
            <Link to="/admin/donations" className="admin-quick__card">
              💛 View donations &amp; export 80G report
            </Link>
          )}
          <Link to="/admin/volunteers" className="admin-quick__card">
            🙋 Manage volunteer registrations
          </Link>
          <Link to="/admin/inquiries" className="admin-quick__card">
            ✉️ Respond to inquiries
          </Link>
          {(user?.role === "super_admin" || user?.role === "content_editor") && (
            <Link to="/admin/metrics" className="admin-quick__card">
              📈 Update impact metrics
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

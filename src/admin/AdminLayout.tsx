import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { AdminProfile } from "./adminApi";

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: AdminProfile["role"][]; // undefined => all authenticated
}

const NAV: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/donations", label: "Donations", icon: "💛", roles: ["donation_viewer"] },
  { to: "/admin/volunteers", label: "Volunteers", icon: "🙋" },
  { to: "/admin/inquiries", label: "Inquiries", icon: "✉️" },
  { to: "/admin/news", label: "News & Stories", icon: "📰", roles: ["content_editor"] },
  { to: "/admin/metrics", label: "Impact Metrics", icon: "📈", roles: ["content_editor"] },
  { to: "/admin/audit", label: "Audit Log", icon: "🛡️", roles: [] },
];

function canSee(item: NavItem, role: AdminProfile["role"]): boolean {
  if (role === "super_admin") return true;
  if (!item.roles) return true; // all authenticated
  return item.roles.includes(role);
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <span className="admin__brand-mark">AV</span>
          <span>
            AVF Admin
            <small>{user.name}</small>
          </span>
        </div>
        <nav className="admin__nav">
          {NAV.filter((i) => canSee(i, user.role)).map((i) => (
            <NavLink
              key={i.to}
              to={i.to}
              end={i.to === "/admin"}
              className={({ isActive }) =>
                `admin__nav-link${isActive ? " is-active" : ""}`
              }
            >
              <span aria-hidden="true">{i.icon}</span> {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin__sidebar-foot">
          <span className="admin__role">{user.role.replace("_", " ")}</span>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
          >
            Log out
          </button>
        </div>
      </aside>
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}

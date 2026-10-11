
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  Settings,
  GraduationCap,
  X,
  UserRoundCog,
} from "lucide-react";

import { useStudents } from "../../context/StudentContext";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Students",
    path: "/students",
    icon: Users,
  },
  {
    label: "Student Management",
    path: "/student-management",
    icon: UserRoundCog,
  },
  {
    label: "Favourites",
    path: "/favourites",
    icon: Heart,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}) {
  const { favouriteCount } = useStudents();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        id="app-sidebar"
        className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <GraduationCap size={25} strokeWidth={2} />
          </div>

          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">
              StudentHub
            </span>

            <span className="sidebar-brand-caption">
              STUDENT MANAGEMENT
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

        <nav className="sidebar-navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "sidebar-link-active" : ""
                  }`
                }
              >
                <Icon size={19} strokeWidth={1.8} />

                <span className="sidebar-link-label">
                  {item.label}
                </span>

                {item.path === "/favourites" &&
                  favouriteCount > 0 && (
                    <span className="sidebar-count">
                      {favouriteCount}
                    </span>
                  )}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-avatar">
            SH
          </div>

          <div className="sidebar-footer-info">
            <span className="sidebar-footer-name">
              StudentHub Pro
            </span>

            <span className="sidebar-footer-caption">
              Student workspace
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

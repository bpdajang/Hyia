import { Logo, Avatar } from "../ui/index.jsx";
import {
  House,
  Users,
  BriefcaseBusiness,
  MessageCircle,
  Bell,
} from "lucide-react";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: (active) => <House />,
  },
  {
    id: "circle",
    label: "My Circle",
    icon: (active) => <Users />,
  },
  {
    id: "opportunities",
    label: "Opportunities",
    icon: (active) => <BriefcaseBusiness />,
  },
  {
    id: "messages",
    label: "Messages",
    badge: 3,
    icon: (active) => <MessageCircle />,
  },
  {
    id: "notifications",
    label: "Notifications",
    badge: 5,
    icon: (active) => <Bell />,
  },
];

export default function TopNav({ activeTab, onTabChange, currentUser }) {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 260,
        zIndex: 100,
        background: "var(--color-base)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        padding: "12px 12px 20px",
        gap: 4,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "8px 12px 20px" }}>
        <Logo />
      </div>

      {/* Nav items */}
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              background: "none",
              border: "none",
              color: isActive ? "var(--color-text-1)" : "var(--color-text-2)",
              padding: "12px 16px",
              borderRadius: 9999,
              cursor: "pointer",
              fontSize: "1.05rem",
              fontWeight: isActive ? 700 : 400,
              fontFamily: "var(--font-body)",
              transition: "background 0.15s, color 0.15s",
              textAlign: "left",
              width: "100%",
              position: "relative",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(108,99,255,0.07)";
                e.currentTarget.style.color = "var(--color-text-1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.color = "var(--color-text-2)";
              }
            }}
          >
            <span
              style={{
                color: isActive ? "#6C63FF" : "inherit",
                display: "flex",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              {item.icon(isActive)}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span
                style={{
                  background: "#6C63FF",
                  color: "white",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  minWidth: 20,
                  textAlign: "center",
                  lineHeight: "1.6",
                }}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Profile */}
      <button
        onClick={() => onTabChange("profile")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "10px 14px",
          borderRadius: 9999,
          width: "100%",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(108,99,255,0.07)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Avatar initials={currentUser?.initials || "U"} size="sm" color="primary" />
        <div style={{ textAlign: "left", minWidth: 0 }}>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-text-1)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {currentUser?.name || "User"}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--color-text-3)",
              whiteSpace: "nowrap",
            }}
          >
            @hyiasuser
          </div>
        </div>
      </button>
    </nav>
  );
}

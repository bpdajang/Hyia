import { Avatar } from "../ui/index.jsx";
import {
  House,
  Users,
  BriefcaseBusiness,
  MessageCircle,
  Bell,
  Settings,
  Search,
} from "lucide-react";

function buildNavItems(unreadMessages, unreadNotifications) {
  return [
    { id: "home", label: "Home", icon: <House size={20} /> },
    { id: "circle", label: "My Circle", icon: <Users size={20} /> },
    {
      id: "opportunities",
      label: "Opportunities",
      icon: <BriefcaseBusiness size={20} />,
    },
    {
      id: "messages",
      label: "Messages",
      badge: unreadMessages,
      icon: <MessageCircle size={20} />,
    },
    {
      id: "notifications",
      label: "Notifications",
      badge: unreadNotifications,
      icon: <Bell size={20} />,
    },
  ];
}

export function SideNav({
  activeTab,
  onTabChange,
  currentUser,
  onSearch,
  unreadMessages = 0,
  unreadNotifications = 0,
}) {
  const NAV_ITEMS = buildNavItems(unreadMessages, unreadNotifications);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: 260,
        zIndex: 100,
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column",
        padding: "20px 12px 16px",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "0 12px 20px" }}>
        <img src="" />
      </div>

      {/* Search button */}
      <button
        onClick={onSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          background: "#f3f4f6",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          padding: "8px 12px",
          color: "#9ca3af",
          fontSize: "0.82rem",
          cursor: "pointer",
          marginBottom: 16,
          fontFamily: "var(--font-body)",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#6C63FF")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
      >
        <Search size={14} />
        <span style={{ flex: 1, textAlign: "left" }}>Search…</span>
      </button>

      {/* Nav items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <NavItem
              key={item.id}
              isActive={isActive}
              badge={item.badge}
              icon={item.icon}
              label={item.label}
              onClick={() => onTabChange(item.id)}
            />
          );
        })}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Settings */}
      <NavItem
        isActive={activeTab === "settings"}
        icon={<Settings size={20} />}
        label="Settings"
        onClick={() => onTabChange("settings")}
        subtle={activeTab !== "settings"}
      />

      {/* Divider */}
      <div style={{ height: 1, background: "#e5e7eb", margin: "12px 4px" }} />

      {/* Profile */}
      <button
        onClick={() => onTabChange("profile")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: activeTab === "profile" ? "#f3f4f6" : "transparent",
          border: "none",
          cursor: "pointer",
          padding: "10px 12px",
          borderRadius: 10,
          width: "100%",
          transition: "background 0.15s",
          textAlign: "left",
        }}
        onMouseEnter={(e) => {
          if (activeTab !== "profile")
            e.currentTarget.style.background = "#f9fafb";
        }}
        onMouseLeave={(e) => {
          if (activeTab !== "profile")
            e.currentTarget.style.background = "transparent";
        }}
      >
        <Avatar
          initials={currentUser?.initials || "U"}
          size="sm"
          color="primary"
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#111111",
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
              color: "#9ca3af",
              whiteSpace: "nowrap",
            }}
          >
            @{(currentUser?.name || "user").toLowerCase().replace(/\s+/g, "")}
          </div>
        </div>
      </button>
    </nav>
  );
}

function NavItem({ isActive, icon, label, badge, onClick, subtle }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: isActive ? "#f3f4f6" : "transparent",
        border: "none",
        color: isActive ? "#111111" : subtle ? "#9ca3af" : "#6b7280",
        padding: "10px 12px",
        borderRadius: 10,
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: isActive ? 600 : 400,
        fontFamily: "var(--font-body)",
        transition: "background 0.12s, color 0.12s",
        textAlign: "left",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.color = "#111111";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = subtle ? "#9ca3af" : "#6b7280";
        }
      }}
    >
      <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span
          style={{
            background: "#111111",
            color: "#ffffff",
            borderRadius: 99,
            padding: "1px 7px",
            fontSize: "0.68rem",
            fontWeight: 700,
            minWidth: 20,
            textAlign: "center",
            lineHeight: "1.6",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

const BASE_ITEMS = [
  { id: "home", label: "Home", icon: House },
  { id: "circle", label: "Circle", icon: Users },
  { id: "opportunities", label: "Jobs", icon: BriefcaseBusiness },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "notifications", label: "Notifs", icon: Bell },
];

export function BottomNav({
  activeTab,
  onTabChange,
  unreadMessages = 0,
  unreadNotifications = 0,
}) {
  const ITEMS = BASE_ITEMS.map((item) => ({
    ...item,
    badge:
      item.id === "messages"
        ? unreadMessages
        : item.id === "notifications"
          ? unreadNotifications
          : null,
  }));

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "#ffffff",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "stretch",
        height: 62,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {ITEMS.map(({ id, label, icon: Icon, badge }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isActive ? "#6C63FF" : "#9ca3af",
              position: "relative",
              padding: "8px 0",
              transition: "color 0.15s",
            }}
          >
            {/* Active indicator */}
            {isActive && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 3,
                  background: "#6C63FF",
                  borderRadius: "0 0 4px 4px",
                }}
              />
            )}

            {/* Icon + badge */}
            <span style={{ position: "relative" }}>
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              {badge > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -7,
                    background: "#111111",
                    color: "white",
                    borderRadius: 99,
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "1px 4px",
                    minWidth: 14,
                    textAlign: "center",
                    lineHeight: 1.5,
                  }}
                >
                  {badge}
                </span>
              )}
            </span>

            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: isActive ? 600 : 400,
                fontFamily: "var(--font-body)",
                letterSpacing: "0.02em",
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

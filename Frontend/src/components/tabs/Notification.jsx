import { useState } from "react";
import { UserCheck, BriefcaseBusiness, Bot, ThumbsUp, Users, Eye, CheckCheck } from "lucide-react";
import { FilterBar } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { NOTIFICATIONS } from "../../data/index.js";

const NOTIF_ICON_MAP = {
  UserCheck:         { Icon: UserCheck,         color: "#6C63FF", bg: "rgba(108,99,255,0.12)" },
  BriefcaseBusiness: { Icon: BriefcaseBusiness,  color: "#FFB74D", bg: "rgba(255,183,77,0.12)"  },
  Bot:               { Icon: Bot,                color: "#00D4AA", bg: "rgba(0,212,170,0.12)"   },
  ThumbsUp:          { Icon: ThumbsUp,           color: "#FF6B6B", bg: "rgba(255,107,107,0.12)" },
  Users:             { Icon: Users,              color: "#6C63FF", bg: "rgba(108,99,255,0.12)"  },
  Eye:               { Icon: Eye,               color: "#00D4AA", bg: "rgba(0,212,170,0.12)"   },
};

// Map filter labels to notification icon types
const FILTER_ICON_MAP = {
  Opportunities: ["BriefcaseBusiness"],
  Mentions:      ["ThumbsUp"],
};

export function NotificationsTab({ onTabChange }) {
  const [filter, setFilter] = useState("All");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter((n) => n.unread).length;

  const filtered = notifs.filter((n) => {
    if (filter === "All") return true;
    if (filter === "Unread") return n.unread;
    const icons = FILTER_ICON_MAP[filter];
    if (icons) return icons.includes(n.icon);
    return true;
  });

  function handleCta(notif) {
    if (notif.tab) onTabChange(notif.tab);
    setNotifs((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)),
    );
    showToast("Marked as read");
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast("All notifications marked as read");
  }

  return (
    <div
      style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "var(--color-text-1)",
            }}
          >
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span
              style={{
                background: "#6C63FF",
                color: "white",
                borderRadius: 99,
                padding: "2px 9px",
                fontSize: "0.72rem",
                fontWeight: 700,
              }}
            >
              {unreadCount} new
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "1.5px solid var(--color-border)",
                color: "var(--color-text-2)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 14px",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6C63FF";
                e.currentTarget.style.color = "#6C63FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.color = "var(--color-text-2)";
              }}
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
          <FilterBar
            filters={["All", "Unread", "Opportunities", "Mentions"]}
            active={filter}
            onChange={setFilter}
          />
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyNotifs filter={filter} onClear={() => setFilter("All")} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filtered.map((notif) => (
            <NotifRow
              key={notif.id}
              notif={notif}
              onCta={() => handleCta(notif)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NotifRow({ notif, onCta }) {
  const def = NOTIF_ICON_MAP[notif.icon];

  return (
    <div
      style={{
        background: notif.unread ? "var(--color-card)" : "var(--color-base)",
        border: "1px solid var(--color-border)",
        borderLeft: notif.unread
          ? "3px solid #6C63FF"
          : "3px solid transparent",
        borderRadius: "var(--radius-md)",
        padding: 16,
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        transition: "border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = notif.unread ? "#6C63FF" : "var(--color-border-light)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = notif.unread ? "#6C63FF" : "var(--color-border)")
      }
    >
      {def && (
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: def.bg,
            color: def.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <def.Icon size={18} />
        </div>
      )}

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: "0.875rem",
            color: "var(--color-text-2)",
            lineHeight: 1.5,
            marginBottom: 4,
          }}
          dangerouslySetInnerHTML={{
            __html: notif.text.replace(
              /<strong>/g,
              '<strong style="color:var(--color-text-1)">',
            ),
          }}
        />
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
          {notif.time}
        </div>
      </div>

      <button
        onClick={onCta}
        style={{
          background: "rgba(108,99,255,0.1)",
          color: "#6C63FF",
          border: "1px solid rgba(108,99,255,0.25)",
          borderRadius: "var(--radius-sm)",
          padding: "6px 16px",
          fontSize: "0.78rem",
          fontWeight: 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all 0.15s",
          alignSelf: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#6C63FF";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(108,99,255,0.1)";
          e.currentTarget.style.color = "#6C63FF";
        }}
      >
        {notif.cta}
      </button>
    </div>
  );
}

function EmptyNotifs({ filter, onClear }) {
  const isFiltered = filter !== "All";
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: 12 }}>🔔</div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "1rem",
          color: "var(--color-text-1)",
          marginBottom: 8,
        }}
      >
        {isFiltered ? `No ${filter.toLowerCase()} notifications` : "You're all caught up"}
      </div>
      <div
        style={{
          fontSize: "0.85rem",
          color: "var(--color-text-3)",
          marginBottom: isFiltered ? 16 : 0,
        }}
      >
        {isFiltered
          ? `Nothing to show under "${filter}" right now.`
          : "No new notifications — check back later."}
      </div>
      {isFiltered && (
        <button
          onClick={onClear}
          style={{
            background: "rgba(108,99,255,0.1)",
            color: "#6C63FF",
            border: "1.5px solid #6C63FF",
            borderRadius: "var(--radius-sm)",
            padding: "7px 20px",
            fontSize: "0.82rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View all notifications
        </button>
      )}
    </div>
  );
}

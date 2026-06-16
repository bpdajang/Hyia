import { useState } from "react";
import { UserCheck, BriefcaseBusiness, Bot, ThumbsUp, Users, Eye } from "lucide-react";
import { FilterBar } from "../ui/index.jsx";

const NOTIF_ICON_MAP = {
  UserCheck:        { Icon: UserCheck,        color: "#6C63FF", bg: "rgba(108,99,255,0.15)" },
  BriefcaseBusiness:{ Icon: BriefcaseBusiness, color: "#FFB74D", bg: "rgba(255,183,77,0.15)"  },
  Bot:              { Icon: Bot,               color: "#00D4AA", bg: "rgba(0,212,170,0.15)"   },
  ThumbsUp:         { Icon: ThumbsUp,          color: "#FF6B6B", bg: "rgba(255,107,107,0.15)" },
  Users:            { Icon: Users,             color: "#6C63FF", bg: "rgba(108,99,255,0.15)"  },
  Eye:              { Icon: Eye,               color: "#00D4AA", bg: "rgba(0,212,170,0.15)"   },
};
import { NOTIFICATIONS } from "../../data/index.js";

// ---- Notifications ----
export function NotificationsTab({ onTabChange }) {
  const [filter, setFilter] = useState("All");
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  function handleCta(notif) {
    if (notif.tab) onTabChange(notif.tab);
    setNotifs((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n)),
    );
  }

  return (
    <div
      style={{ maxWidth: 720, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
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
        <FilterBar
          filters={["All", "Unread", "Opportunities", "Mentions"]}
          active={filter}
          onChange={setFilter}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {notifs.map((notif) => (
          <div
            key={notif.id}
            style={{
              background: "var(--color-card)",
              border: `1px solid var(--color-border)`,
              borderLeft: notif.unread
                ? "3px solid #6C63FF"
                : "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: 16,
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--color-border-light)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = notif.unread
                ? "#6C63FF"
                : "var(--color-border)")
            }
          >
            {(() => {
              const def = NOTIF_ICON_MAP[notif.icon];
              if (!def) return null;
              const { Icon, color, bg } = def;
              return (
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
              );
            })()}
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
              <div
                style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}
              >
                {notif.time}
              </div>
            </div>
            <button
              onClick={() => handleCta(notif)}
              style={{
                background: "rgba(108,99,255,0.15)",
                color: "#6C63FF",
                border: "1px solid rgba(108,99,255,0.3)",
                borderRadius: "var(--radius-sm)",
                padding: "6px 16px",
                fontSize: "0.78rem",
                fontWeight: 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                alignSelf: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#6C63FF";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(108,99,255,0.15)";
                e.currentTarget.style.color = "#6C63FF";
              }}
            >
              {notif.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

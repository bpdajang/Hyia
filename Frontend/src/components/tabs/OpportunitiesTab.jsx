import { useState } from "react";
import { Calendar, Banknote, MapPin, Clock, Check } from "lucide-react";
import { FilterBar, CompanyLogo, MatchBadge } from "../ui/index.jsx";
import { OPPORTUNITIES } from "../../data/index.js";

function OppCard({ opp, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? "var(--color-card-hover)" : "var(--color-card)",
        border: `1px solid ${selected ? "#6C63FF" : opp.featured ? "rgba(108,99,255,0.4)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = "#6C63FF";
      }}
      onMouseLeave={(e) => {
        if (!selected)
          e.currentTarget.style.borderColor = opp.featured
            ? "rgba(108,99,255,0.4)"
            : "var(--color-border)";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <CompanyLogo letter={opp.logo} color={opp.logoColor} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--color-text-1)",
              marginBottom: 2,
            }}
          >
            {opp.title}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-3)" }}>
            {opp.company}
          </div>
        </div>
        <MatchBadge pct={opp.match} />
      </div>
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--color-text-2)",
          lineHeight: 1.5,
          marginBottom: 10,
        }}
      >
        {opp.desc}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {opp.tags.map((t) => (
          <span
            key={t}
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-2)",
              borderRadius: 10,
              padding: "2px 9px",
              fontSize: "0.72rem",
            }}
          >
            {t}
          </span>
        ))}
        <span
          style={{
            fontSize: "0.72rem",
            color: "var(--color-text-3)",
            marginLeft: "auto",
          }}
        >
          {opp.deadline}
        </span>
      </div>
    </div>
  );
}

function OppDetail({ opp }) {
  if (!opp) {
    return (
      <div
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: 28,
          position: "sticky",
          top: "calc(var(--nav-h) + 20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 600,
        }}
      >
        <div style={{ textAlign: "center", color: "var(--color-text-3)" }}>
          <p style={{ marginTop: 5 }}>Select an opportunity to see details</p>
        </div>
      </div>
    );
  }

  const d = opp.detail;
  if (!d) return null;

  return (
    <div
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: 28,
        position: "sticky",
        top: "calc(var(--nav-h) + 20px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        <CompanyLogo letter={opp.logo} color={opp.logoColor} large />
        <div style={{ flex: 1 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.2rem",
              color: "var(--color-text-1)",
              marginBottom: 4,
            }}
          >
            {opp.title}
          </h2>
          <div style={{ fontSize: "0.85rem", color: "var(--color-text-2)" }}>
            {opp.company} · {d.location}
          </div>
        </div>
        <MatchBadge pct={opp.match} size="lg" />
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          color: "var(--color-text-2)",
          fontSize: "0.8rem",
          marginBottom: 16,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={14} /> {d.duration}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Banknote size={14} /> {d.pay}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={14} /> {d.location}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} /> {d.type}</span>
      </div>

      <button
        style={{
          background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
          color: "white",
          border: "none",
          borderRadius: "var(--radius-sm)",
          padding: "11px 24px",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.9rem",
          cursor: "pointer",
          width: "100%",
          marginBottom: 8,
        }}
      >
        Apply Now
      </button>

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "var(--color-text-1)",
            marginBottom: 10,
          }}
        >
          About the role
        </h4>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-2)",
            lineHeight: 1.6,
          }}
        >
          {d.about}
        </p>
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "var(--color-text-1)",
            marginBottom: 10,
          }}
        >
          Requirements
        </h4>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {d.requirements.map((r) => (
            <li
              key={r}
              style={{ fontSize: "0.83rem", color: "var(--color-text-2)", display: "flex", alignItems: "flex-start", gap: 6 }}
            >
              <Check size={14} style={{ color: "#00D4AA", flexShrink: 0, marginTop: 2 }} /> {r}
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 20,
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <h4
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "var(--color-text-1)",
            marginBottom: 10,
          }}
        >
          Your matched skills
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {d.matchedSkills.map((s) => (
            <span
              key={s}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "rgba(108,99,255,0.15)",
                border: "1.5px solid #6C63FF",
                color: "#6C63FF",
                borderRadius: 20,
                padding: "3px 10px",
                fontSize: "0.75rem",
              }}
            >
              {s} <Check size={12} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesTab() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  return (
    <div
      style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}
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
        <FilterBar
          filters={[
            "All",
            "Internships",
            "Graduate Roles",
            "Research",
            "Grants",
          ]}
          active={filter}
          onChange={setFilter}
        />
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--color-text-1)",
          }}
        >
          Opportunities
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <OppDetail opp={selected} />

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* AI Match Banner */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(0,212,170,0.08))",
              border: "1px solid rgba(108,99,255,0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 4,
            }}
          >
            <div
              className="ai-pulse"
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#00D4AA",
                flexShrink: 0,
                boxShadow: "0 0 0 4px rgba(0,212,170,0.15)",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--color-text-1)",
                  marginBottom: 2,
                }}
              >
                Top job picks for you
              </div>
              <div
                style={{ fontSize: "0.75rem", color: "var(--color-text-2)" }}
              >
                Based on your skills in Python, React, UI/UX Design and your IT
                background
              </div>
            </div>
          </div>

          {OPPORTUNITIES.map((opp) => (
            <OppCard
              key={opp.id}
              opp={opp}
              selected={selected?.id === opp.id}
              onSelect={() => setSelected(selected?.id === opp.id ? null : opp)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

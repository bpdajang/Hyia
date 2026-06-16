import { useState } from "react";
import { Avatar, SkillPill } from "../ui/index.jsx";
import { CIRCLE_PEOPLE } from "../../data/index.js";

const NAV_ITEMS = [
  { label: "Connections", count: 247 },
  { label: "Following", count: 18 },
  { label: "Mentors", count: 8 },
  { label: "Groups", count: 5 },
  { label: "Companies", count: 12 },
  { label: "Events", count: 3 },
];

function PersonCard({ person, onViewProfile }) {
  const [connected, setConnected] = useState(false);
  return (
    <div
      onClick={() => onViewProfile && onViewProfile(person.id)}
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6C63FF";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,99,255,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Avatar initials={person.initials} color={person.color} size="lg" />
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.85rem",
          color: "var(--color-text-1)",
        }}
      >
        {person.name}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
        {person.meta}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          margin: "4px 0",
        }}
      >
        {person.skills.map((s) => (
          <SkillPill key={s} label={s} small />
        ))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setConnected((c) => !c);
        }}
        style={{
          background: connected ? "#6C63FF" : "rgba(108,99,255,0.15)",
          color: connected ? "white" : "#6C63FF",
          border: "1.5px solid #6C63FF",
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: "0.75rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s",
          marginTop: 4,
        }}
      >
        {connected ? "Connected ✓" : "Connect"}
      </button>
    </div>
  );
}

export default function CircleTab({ onViewProfile }) {
  const [activeNav, setActiveNav] = useState("Connections");

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
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--color-text-1)",
          }}
        >
          My Circle
        </h2>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}
      >
        {/* People grid */}
        <div>
          <PeopleSection
            title="People doing your Programme"
            people={CIRCLE_PEOPLE.programme}
            onViewProfile={onViewProfile}
          />
          <PeopleSection
            title="People you may know"
            people={CIRCLE_PEOPLE.suggested}
            onViewProfile={onViewProfile}
          />
        </div>
        {/* Sidebar nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              style={{
                background:
                  activeNav === item.label ? "rgba(108,99,255,0.15)" : "none",
                border: "none",
                color:
                  activeNav === item.label ? "#6C63FF" : "var(--color-text-2)",
                padding: "10px 14px",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer",
                fontSize: "0.85rem",
                textAlign: "left",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontWeight: activeNav === item.label ? 600 : 400,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (activeNav !== item.label) {
                  e.currentTarget.style.background = "var(--color-card)";
                  e.currentTarget.style.color = "var(--color-text-1)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeNav !== item.label) {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "var(--color-text-2)";
                }
              }}
            >
              {item.label}
              <span
                style={{
                  background: "var(--color-surface)",
                  color: "var(--color-text-3)",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontSize: "0.72rem",
                }}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PeopleSection({ title, people, onViewProfile }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "0.95rem",
          color: "var(--color-text-2)",
          marginBottom: 16,
          letterSpacing: "0.2px",
        }}
      >
        {title}
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {people.map((p) => (
          <PersonCard key={p.name} person={p} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  );
}

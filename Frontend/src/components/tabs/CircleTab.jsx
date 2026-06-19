import { useState } from "react";
import { Search, X } from "lucide-react";
import { Avatar, SkillPill } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { CIRCLE_PEOPLE, PROFILES } from "../../data/index.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";

// ── Derive category lists from data ───────────────────────────────────────────

function profileToCard(p) {
  return {
    id: p.id,
    initials: p.initials,
    name: p.name,
    meta: p.title,
    skills: (p.skills || []).slice(0, 3),
    color: p.color,
  };
}

const ALL_PROFILES = Object.values(PROFILES);

const MENTORS = ALL_PROFILES.filter((p) => p.type === "mentor").map(
  profileToCard,
);
const COMPANIES = ALL_PROFILES.filter((p) => p.type === "company").map(
  profileToCard,
);
const FOLLOWING = ALL_PROFILES.filter((p) => p.type === "alumni")
  .slice(0, 4)
  .map(profileToCard);

const PEOPLE_BY_CATEGORY = {
  Connections: [...CIRCLE_PEOPLE.programme, ...CIRCLE_PEOPLE.suggested],
  Following: FOLLOWING,
  Mentors: MENTORS,
  Groups: [],
  Companies: COMPANIES,
  Events: [],
};

const SECTION_LABEL = {
  Connections: null, // special-cased below
  Following: "Alumni you follow",
  Mentors: "Available Mentors",
  Groups: null,
  Companies: "Companies on Hyia",
  Events: null,
};

const NAV_ITEMS = [
  { label: "Connections", count: PEOPLE_BY_CATEGORY.Connections.length },
  { label: "Following", count: PEOPLE_BY_CATEGORY.Following.length },
  { label: "Mentors", count: PEOPLE_BY_CATEGORY.Mentors.length },
  { label: "Groups", count: 0 },
  { label: "Companies", count: PEOPLE_BY_CATEGORY.Companies.length },
  { label: "Events", count: 0 },
];

// ── Person Card ────────────────────────────────────────────────────────────────

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
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,99,255,0.1)";
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
      {person.skills.length > 0 && (
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
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const next = !connected;
          setConnected(next);
          showToast(
            next ? `Connected with ${person.name}!` : "Connection removed",
          );
        }}
        style={{
          background: connected ? "#6C63FF" : "rgba(108,99,255,0.12)",
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

// ── People Section ─────────────────────────────────────────────────────────────

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
          <PersonCard key={p.id} person={p} onViewProfile={onViewProfile} />
        ))}
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyCircle({ category }) {
  const config = {
    Groups: {
      emoji: "👥",
      title: "No groups yet",
      desc: "Groups & communities feature is coming soon.",
    },
    Events: {
      emoji: "📅",
      title: "No events yet",
      desc: "Check back for upcoming meetups and events.",
    },
  };
  const { emoji, title, desc } = config[category] || {
    emoji: "🔍",
    title: `No ${category.toLowerCase()} found`,
    desc: "Nothing here yet — check back soon.",
  };

  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>{emoji}</div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "1rem",
          color: "var(--color-text-1)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-text-3)" }}>
        {desc}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

export default function CircleTab({ onViewProfile }) {
  const [activeNav, setActiveNav] = useState("Connections");
  const [search, setSearch] = useState("");

  const people = PEOPLE_BY_CATEGORY[activeNav] || [];
  const sectionLabel = SECTION_LABEL[activeNav];

  const isMobile = useIsMobile(900);

  const displayPeople = search
    ? people.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.meta.toLowerCase().includes(search.toLowerCase()) ||
          (p.skills || []).some((s) =>
            s.toLowerCase().includes(search.toLowerCase()),
          ),
      )
    : people;

  function changeCategory(cat) {
    setActiveNav(cat);
    setSearch("");
  }

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        {/* Tab content */}
        <div style={{ padding: "16px 16px 24px" }}>
          {/* People area */}
          <div>
            {/* Search bar */}
            {people.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--color-card)",
                  border: "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  padding: "8px 14px",
                  marginBottom: 20,
                  transition: "border-color 0.15s",
                }}
                onFocus={() => {}}
              >
                <Search
                  size={16}
                  style={{ color: "var(--color-text-3)", flexShrink: 0 }}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${activeNav.toLowerCase()} by name, role, or skill…`}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "var(--color-text-1)",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-text-3)",
                      display: "flex",
                      padding: 0,
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => changeCategory(item.label)}
                  style={{
                    background:
                      activeNav === item.label
                        ? "rgba(108,99,255,0.12)"
                        : "none",
                    border: "none",
                    color:
                      activeNav === item.label
                        ? "#6C63FF"
                        : "var(--color-text-2)",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    textAlign: "left",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: activeNav === item.label ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (activeNav !== item.label) {
                      e.currentTarget.style.background = "var(--color-surface)";
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

            {people.length === 0 ? (
              <EmptyCircle category={activeNav} />
            ) : displayPeople.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>🔍</div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "var(--color-text-1)",
                    marginBottom: 6,
                  }}
                >
                  No results for "{search}"
                </div>
                <div
                  style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}
                >
                  Try a different name, role, or skill.
                </div>
              </div>
            ) : activeNav === "Connections" ? (
              <>
                <PeopleSection
                  title="People doing your Programme"
                  people={CIRCLE_PEOPLE.programme.filter(
                    (p) =>
                      !search ||
                      p.name.toLowerCase().includes(search.toLowerCase()) ||
                      p.meta.toLowerCase().includes(search.toLowerCase()) ||
                      (p.skills || []).some((s) =>
                        s.toLowerCase().includes(search.toLowerCase()),
                      ),
                  )}
                  onViewProfile={onViewProfile}
                />
                <PeopleSection
                  title="People you may know"
                  people={CIRCLE_PEOPLE.suggested.filter(
                    (p) =>
                      !search ||
                      p.name.toLowerCase().includes(search.toLowerCase()) ||
                      p.meta.toLowerCase().includes(search.toLowerCase()) ||
                      (p.skills || []).some((s) =>
                        s.toLowerCase().includes(search.toLowerCase()),
                      ),
                  )}
                  onViewProfile={onViewProfile}
                />
              </>
            ) : (
              <PeopleSection
                title={sectionLabel || activeNav}
                people={displayPeople}
                onViewProfile={onViewProfile}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

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
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 260px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* People area */}
        <div>
          {/* Search bar */}
          {people.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--color-card)",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "8px 14px",
                marginBottom: 20,
                transition: "border-color 0.15s",
              }}
              onFocus={() => {}}
            >
              <Search
                size={16}
                style={{ color: "var(--color-text-3)", flexShrink: 0 }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeNav.toLowerCase()} by name, role, or skill…`}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  color: "var(--color-text-1)",
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-body)",
                }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-3)",
                    display: "flex",
                    padding: 0,
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>
          )}

          {people.length === 0 ? (
            <EmptyCircle category={activeNav} />
          ) : displayPeople.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>🔍</div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  color: "var(--color-text-1)",
                  marginBottom: 6,
                }}
              >
                No results for "{search}"
              </div>
              <div
                style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}
              >
                Try a different name, role, or skill.
              </div>
            </div>
          ) : activeNav === "Connections" ? (
            <>
              <PeopleSection
                title="People doing your Programme"
                people={CIRCLE_PEOPLE.programme.filter(
                  (p) =>
                    !search ||
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.meta.toLowerCase().includes(search.toLowerCase()) ||
                    (p.skills || []).some((s) =>
                      s.toLowerCase().includes(search.toLowerCase()),
                    ),
                )}
                onViewProfile={onViewProfile}
              />
              <PeopleSection
                title="People you may know"
                people={CIRCLE_PEOPLE.suggested.filter(
                  (p) =>
                    !search ||
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.meta.toLowerCase().includes(search.toLowerCase()) ||
                    (p.skills || []).some((s) =>
                      s.toLowerCase().includes(search.toLowerCase()),
                    ),
                )}
                onViewProfile={onViewProfile}
              />
            </>
          ) : (
            <PeopleSection
              title={sectionLabel || activeNav}
              people={displayPeople}
              onViewProfile={onViewProfile}
            />
          )}
        </div>

        {/* Sidebar nav */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => changeCategory(item.label)}
              style={{
                background:
                  activeNav === item.label ? "rgba(108,99,255,0.12)" : "none",
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
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (activeNav !== item.label) {
                  e.currentTarget.style.background = "var(--color-surface)";
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

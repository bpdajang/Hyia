import { useState, useEffect, useRef } from "react";
import { Search, X, User, BriefcaseBusiness, Hash } from "lucide-react";
import { Avatar } from "./index.jsx";
import { PROFILES, OPPORTUNITIES, FEED_POSTS } from "../../data/index.js";

const ALL_PROFILES = Object.values(PROFILES);

function buildResults(query) {
  const q = query.toLowerCase().trim();
  if (!q) return { people: [], opportunities: [], posts: [] };

  const people = ALL_PROFILES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      (p.skills || []).some((s) => s.toLowerCase().includes(q))
  ).slice(0, 4);

  const opportunities = OPPORTUNITIES.filter(
    (o) =>
      o.title.toLowerCase().includes(q) ||
      o.company.toLowerCase().includes(q) ||
      o.desc.toLowerCase().includes(q) ||
      o.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 3);

  const posts = FEED_POSTS.filter(
    (p) =>
      p.body.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  ).slice(0, 3);

  return { people, opportunities, posts };
}

// Quick shortcuts shown when query is empty
const SHORTCUTS = [
  { label: "Browse Opportunities", tab: "opportunities", icon: <BriefcaseBusiness size={15} /> },
  { label: "My Circle",            tab: "circle",        icon: <User size={15} /> },
  { label: "#AfricanAI",           tab: "home",          icon: <Hash size={15} /> },
  { label: "#GhanaFintech",        tab: "home",          icon: <Hash size={15} /> },
];

export default function SearchModal({ onClose, onNavigate, onViewProfile }) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  const { people, opportunities, posts } = buildResults(query);
  const hasResults = people.length + opportunities.length + posts.length > 0;

  // Flat list of all result items for keyboard nav
  const flatItems = [
    ...people.map((p) => ({ type: "person", data: p })),
    ...opportunities.map((o) => ({ type: "opp", data: o })),
    ...posts.map((p) => ({ type: "post", data: p })),
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  function handleKey(e) {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setCursor((c) => Math.min(c + 1, flatItems.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); return; }
    if (e.key === "Enter" && flatItems[cursor]) { selectItem(flatItems[cursor]); }
  }

  function selectItem(item) {
    if (item.type === "person") { onViewProfile(item.data.id); }
    else if (item.type === "opp") { onNavigate("opportunities"); }
    else if (item.type === "post") { onNavigate("home"); }
    onClose();
  }

  function selectShortcut(tab) {
    onNavigate(tab);
    onClose();
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 600, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "80px 20px 20px" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in"
        style={{ background: "var(--color-card)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 580, boxShadow: "0 24px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
        onKeyDown={handleKey}
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--color-border)" }}>
          <Search size={18} style={{ color: "var(--color-text-3)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, jobs, posts…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--color-text-1)", fontSize: "1rem", fontFamily: "var(--font-body)" }}
          />
          {query ? (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-3)", display: "flex" }}>
              <X size={16} />
            </button>
          ) : (
            <kbd style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 6, padding: "2px 7px", fontSize: "0.7rem", color: "var(--color-text-3)", fontFamily: "var(--font-body)" }}>Esc</kbd>
          )}
        </div>

        <div style={{ maxHeight: 440, overflowY: "auto", padding: "8px 0" }}>
          {!query && (
            /* ── Shortcuts when empty ── */
            <div style={{ padding: "8px 20px 0" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-3)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Quick access</div>
              {SHORTCUTS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => selectShortcut(s.tab)}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: "none", border: "none", padding: "10px 0", cursor: "pointer", color: "var(--color-text-2)", fontSize: "0.875rem", textAlign: "left", borderRadius: "var(--radius-sm)", transition: "color 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-2)")}
                >
                  <span style={{ color: "var(--color-text-3)" }}>{s.icon}</span>
                  {s.label}
                  <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--color-text-3)" }}>↵</span>
                </button>
              ))}
            </div>
          )}

          {query && !hasResults && (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>🔍</div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-3)" }}>No results for "<strong>{query}</strong>"</p>
            </div>
          )}

          {query && hasResults && (
            <>
              <ResultSection title="People" icon={<User size={13} />}>
                {people.map((p, i) => {
                  const flatIdx = i;
                  return (
                    <ResultRow
                      key={p.id}
                      active={flatIdx === cursor}
                      onClick={() => { onViewProfile(p.id); onClose(); }}
                      onHover={() => setCursor(flatIdx)}
                    >
                      <Avatar initials={p.initials} color={p.color} size="xs" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-1)" }}>{p.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                      </div>
                      <TypeBadge label={p.type} />
                    </ResultRow>
                  );
                })}
              </ResultSection>

              {opportunities.length > 0 && (
                <ResultSection title="Opportunities" icon={<BriefcaseBusiness size={13} />}>
                  {opportunities.map((o, i) => {
                    const flatIdx = people.length + i;
                    return (
                      <ResultRow
                        key={o.id}
                        active={flatIdx === cursor}
                        onClick={() => { onNavigate("opportunities"); onClose(); }}
                        onHover={() => setCursor(flatIdx)}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(108,99,255,0.12)", color: "#6C63FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>{o.logo}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-1)" }}>{o.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>{o.company}</div>
                        </div>
                        <span style={{ fontSize: "0.72rem", color: "#00D4AA", fontWeight: 600 }}>{o.match}%</span>
                      </ResultRow>
                    );
                  })}
                </ResultSection>
              )}

              {posts.length > 0 && (
                <ResultSection title="Posts" icon={<Hash size={13} />}>
                  {posts.map((p, i) => {
                    const flatIdx = people.length + opportunities.length + i;
                    return (
                      <ResultRow
                        key={p.id}
                        active={flatIdx === cursor}
                        onClick={() => { onNavigate("home"); onClose(); }}
                        onHover={() => setCursor(flatIdx)}
                      >
                        <Avatar initials={p.initials} color={p.color} size="xs" />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, fontSize: "0.82rem", color: "var(--color-text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} dangerouslySetInnerHTML={{ __html: p.body.replace(/<[^>]*>/g, "").slice(0, 80) + "…" }} />
                          <div style={{ fontSize: "0.72rem", color: "var(--color-text-3)" }}>by {p.author}</div>
                        </div>
                      </ResultRow>
                    );
                  })}
                </ResultSection>
              )}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div style={{ borderTop: "1px solid var(--color-border)", padding: "10px 20px", display: "flex", gap: 16, color: "var(--color-text-3)", fontSize: "0.72rem" }}>
          <span><kbd style={kbdStyle}>↑↓</kbd> navigate</span>
          <span><kbd style={kbdStyle}>↵</kbd> select</span>
          <span><kbd style={kbdStyle}>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function ResultSection({ title, icon, children }) {
  return (
    <div style={{ padding: "8px 20px 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-3)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function ResultRow({ children, active, onClick, onHover }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onHover}
      style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", background: active ? "rgba(108,99,255,0.08)" : "none", border: "none", borderRadius: "var(--radius-sm)", padding: "8px 10px", cursor: "pointer", textAlign: "left", transition: "background 0.1s" }}
    >
      {children}
    </button>
  );
}

function TypeBadge({ label }) {
  const colors = { mentor: { bg: "rgba(0,212,170,0.1)", text: "#00D4AA" }, student: { bg: "rgba(108,99,255,0.1)", text: "#6C63FF" }, company: { bg: "rgba(255,183,77,0.1)", text: "#FFB74D" }, alumni: { bg: "rgba(108,99,255,0.1)", text: "#6C63FF" } };
  const c = colors[label] || colors.student;
  return (
    <span style={{ background: c.bg, color: c.text, borderRadius: 8, padding: "2px 7px", fontSize: "0.68rem", fontWeight: 600, flexShrink: 0, textTransform: "capitalize" }}>
      {label}
    </span>
  );
}

const kbdStyle = {
  background: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: 4,
  padding: "1px 5px",
  fontFamily: "var(--font-body)",
  fontSize: "0.68rem",
  color: "var(--color-text-3)",
};

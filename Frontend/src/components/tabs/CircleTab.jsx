import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Avatar, SkillPill } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  getConnections,
  getPendingRequests,
  sendConnectionRequest,
  respondToRequest,
  listAlumni,
  listCompanies,
} from "../../api/network.js";

function getInitials(name = "") {
  return name.trim().split(/\s+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "?";
}

function userToCard(u) {
  const p = u.profile || {};
  let meta = "";
  if (u.role === "student") meta = [p.course, p.university].filter(Boolean).join(" · ");
  if (u.role === "alumni") meta = [p.job_title, p.current_company].filter(Boolean).join(" · ");
  if (u.role === "company") meta = p.industry || "";
  const skills = p.skills || p.expertise || [];
  return {
    id: u.id,
    initials: getInitials(u.name),
    name: u.name,
    meta: meta || u.role,
    skills: skills.slice(0, 3),
    color: "primary",
    role: u.role,
  };
}

// ── Person Card ────────────────────────────────────────────────────────────────

function PersonCard({ person, isConnected, onConnect }) {
  const [status, setStatus] = useState(isConnected ? "connected" : "none");

  async function handleConnect(e) {
    e.stopPropagation();
    if (status !== "none") return;
    setStatus("pending");
    try {
      await onConnect(person.id);
      showToast(`Connection request sent to ${person.name}!`);
    } catch (err) {
      showToast(err.message || "Could not send request", "error");
      setStatus("none");
    }
  }

  const btnLabel = status === "connected" ? "Connected ✓" : status === "pending" ? "Pending…" : "Connect";
  const btnStyle = {
    background: status === "connected" ? "#6C63FF" : "rgba(108,99,255,0.12)",
    color: status === "connected" ? "white" : "#6C63FF",
    border: "1.5px solid #6C63FF",
    borderRadius: 20,
    padding: "4px 12px",
    fontSize: "0.75rem",
    fontWeight: 600,
    cursor: status === "none" ? "pointer" : "default",
    transition: "all 0.2s",
    marginTop: 4,
    opacity: status === "pending" ? 0.7 : 1,
  };

  return (
    <div
      style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center", cursor: "default", transition: "all 0.2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6C63FF"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,99,255,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <Avatar initials={person.initials} color={person.color} size="lg" />
      <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-1)" }}>{person.name}</div>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>{person.meta}</div>
      {person.skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", margin: "4px 0" }}>
          {person.skills.map((s) => <SkillPill key={s} label={s} small />)}
        </div>
      )}
      <button onClick={handleConnect} style={btnStyle}>{btnLabel}</button>
    </div>
  );
}

// ── Pending Request Row ────────────────────────────────────────────────────────

function PendingRow({ req, onAccept, onReject }) {
  const [responding, setResponding] = useState(false);

  async function respond(action) {
    setResponding(true);
    try {
      await respondToRequest(req.id, action);
      action === "accepted" ? onAccept(req.id) : onReject(req.id);
      showToast(action === "accepted" ? "Connection accepted!" : "Request declined");
    } catch (err) {
      showToast(err.message || "Failed to respond", "error");
      setResponding(false);
    }
  }

  return (
    <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
      <Avatar initials={getInitials(req.sender_name || "?")} color="primary" size="sm" />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-1)" }}>{req.sender_name || "Someone"}</div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>Wants to connect</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => respond("accepted")} disabled={responding} style={{ background: "#6C63FF", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "6px 14px", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}>Accept</button>
        <button onClick={() => respond("rejected")} disabled={responding} style={{ background: "none", border: "1.5px solid var(--color-border)", color: "var(--color-text-2)", borderRadius: "var(--radius-sm)", padding: "6px 14px", fontSize: "0.78rem", cursor: "pointer" }}>Decline</button>
      </div>
    </div>
  );
}

// ── People Grid ────────────────────────────────────────────────────────────────

function PeopleGrid({ title, people, connectedIds, onConnect }) {
  if (people.length === 0) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      {title && (
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-2)", marginBottom: 16, letterSpacing: "0.2px" }}>{title}</h3>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
        {people.map((p) => (
          <PersonCard key={p.id} person={p} isConnected={connectedIds.has(p.id)} onConnect={onConnect} />
        ))}
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyCircle({ category }) {
  const config = {
    Groups:  { emoji: "👥", title: "No groups yet",  desc: "Groups & communities are coming soon." },
    Events:  { emoji: "📅", title: "No events yet",  desc: "Check back for upcoming meetups and events." },
  };
  const { emoji, title, desc } = config[category] || {
    emoji: "🔍",
    title: `No ${category.toLowerCase()} yet`,
    desc: "Nothing here — check back soon.",
  };
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>{emoji}</div>
      <div style={{ fontWeight: 600, fontSize: "1rem", color: "var(--color-text-1)", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-text-3)" }}>{desc}</div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

const STATIC_CATEGORIES = ["Groups", "Events"];

export default function CircleTab({ onViewProfile }) {
  const [activeNav, setActiveNav] = useState("Connections");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [companies, setCompanies] = useState([]);

  const isMobile = useIsMobile(900);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [conns, pend, alum, comps] = await Promise.all([
          getConnections().catch(() => []),
          getPendingRequests().catch(() => []),
          listAlumni().catch(() => []),
          listCompanies().catch(() => []),
        ]);
        setConnections(conns.map(userToCard));
        setPending(pend);
        setAlumni(alum.map(userToCard));
        setCompanies(comps.map(userToCard));
      } catch {
        // silent — individual catches above handle per-category failures
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const connectedIds = new Set(connections.map((c) => c.id));

  const PEOPLE_BY_CATEGORY = {
    Connections: connections,
    Following:   alumni.slice(0, 8),
    Mentors:     alumni,
    Groups:      [],
    Companies:   companies,
    Events:      [],
  };

  const NAV_ITEMS = [
    { label: "Connections", count: connections.length },
    { label: "Following",   count: alumni.slice(0, 8).length },
    { label: "Mentors",     count: alumni.length },
    { label: "Groups",      count: 0 },
    { label: "Companies",   count: companies.length },
    { label: "Events",      count: 0 },
  ];

  const SECTION_LABEL = {
    Connections: null,
    Following:   "Alumni you follow",
    Mentors:     "Available Mentors",
    Groups:      null,
    Companies:   "Companies on Hyia",
    Events:      null,
  };

  const people = PEOPLE_BY_CATEGORY[activeNav] || [];
  const sectionLabel = SECTION_LABEL[activeNav];

  const displayPeople = search
    ? people.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.meta.toLowerCase().includes(search.toLowerCase()) ||
        p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
      )
    : people;

  async function handleConnect(userId) {
    await sendConnectionRequest(userId);
  }

  function acceptPending(reqId) {
    const req = pending.find((r) => r.id === reqId);
    if (req) {
      setPending((prev) => prev.filter((r) => r.id !== reqId));
    }
  }

  function rejectPending(reqId) {
    setPending((prev) => prev.filter((r) => r.id !== reqId));
  }

  function changeCategory(cat) {
    setActiveNav(cat);
    setSearch("");
  }

  const isStatic = STATIC_CATEGORIES.includes(activeNav);

  const SearchBar = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--color-card)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "8px 14px", marginBottom: 20, transition: "border-color 0.15s" }}>
      <Search size={16} style={{ color: "var(--color-text-3)", flexShrink: 0 }} />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${activeNav.toLowerCase()} by name, role, or skill…`}
        style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--color-text-1)", fontSize: "0.875rem", fontFamily: "var(--font-body)" }}
      />
      {search && (
        <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-3)", display: "flex", padding: 0 }}>
          <X size={15} />
        </button>
      )}
    </div>
  );

  const NavSidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          onClick={() => changeCategory(item.label)}
          style={{ background: activeNav === item.label ? "rgba(108,99,255,0.12)" : "none", border: "none", color: activeNav === item.label ? "#6C63FF" : "var(--color-text-2)", padding: "10px 14px", borderRadius: "var(--radius-sm)", cursor: "pointer", fontSize: "0.85rem", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: activeNav === item.label ? 600 : 400, transition: "all 0.15s" }}
          onMouseEnter={(e) => { if (activeNav !== item.label) { e.currentTarget.style.background = "var(--color-surface)"; e.currentTarget.style.color = "var(--color-text-1)"; } }}
          onMouseLeave={(e) => { if (activeNav !== item.label) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-text-2)"; } }}
        >
          {item.label}
          <span style={{ background: "var(--color-surface)", color: "var(--color-text-3)", borderRadius: 10, padding: "1px 7px", fontSize: "0.72rem" }}>
            {loading ? "…" : item.count}
          </span>
        </button>
      ))}
    </div>
  );

  const ContentArea = () => {
    if (loading) {
      return <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-3)" }}>Loading…</div>;
    }
    if (isStatic) return <EmptyCircle category={activeNav} />;

    // Pending requests shown in Connections section
    const showPending = activeNav === "Connections" && pending.length > 0;

    return (
      <>
        {showPending && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-2)", marginBottom: 14 }}>Pending requests ({pending.length})</h3>
            {pending.map((req) => (
              <PendingRow key={req.id} req={req} onAccept={acceptPending} onReject={rejectPending} />
            ))}
          </div>
        )}

        {people.length === 0 ? (
          <EmptyCircle category={activeNav} />
        ) : displayPeople.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-1)", marginBottom: 6 }}>No results for "{search}"</div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}>Try a different name, role, or skill.</div>
          </div>
        ) : (
          <PeopleGrid
            title={sectionLabel}
            people={displayPeople}
            connectedIds={connectedIds}
            onConnect={handleConnect}
          />
        )}
      </>
    );
  };

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "16px 16px 24px" }}>
          <NavSidebar />
          {!isStatic && people.length > 0 && <SearchBar />}
          <ContentArea />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }} className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-text-1)" }}>My Circle</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 24, alignItems: "start" }}>
        <div>
          {!isStatic && people.length > 0 && <SearchBar />}
          <ContentArea />
        </div>
        <NavSidebar />
      </div>
    </div>
  );
}

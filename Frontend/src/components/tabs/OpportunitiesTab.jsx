import { useState, useEffect } from "react";
import { Calendar, Banknote, MapPin, Clock, Check, X, Paperclip } from "lucide-react";
import { FilterBar, CompanyLogo, MatchBadge, Avatar, SkeletonOppCard } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { listOpportunities, applyToOpportunity, getMyApplications } from "../../api/opportunities.js";

// ── Map API opportunity to the UI card/detail shape ───────────────────────────

function getLogoColor(name = "") {
  const colors = ["primary", "teal", "orange", "pink", "purple"];
  const index = (name.charCodeAt(0) || 0) % colors.length;
  return colors[index];
}

function formatDeadline(deadline) {
  if (!deadline) return "Open-ended";
  const d = new Date(deadline);
  if (isNaN(d)) return deadline;
  const diff = Math.ceil((d - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  if (diff <= 7) return `${diff}d left`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function apiOppToCard(opp) {
  const letter = (opp.company_name || "?")[0].toUpperCase();
  return {
    id: opp.id,
    title: opp.title,
    company: opp.company_name || "Unknown Company",
    logo: letter,
    logoColor: getLogoColor(opp.company_name),
    desc: opp.description,
    tags: opp.required_skills || [],
    match: 0,
    deadline: formatDeadline(opp.deadline),
    featured: false,
    type: opp.type,
    detail: {
      location: opp.location || "Not specified",
      duration: opp.duration || "Not specified",
      pay: opp.pay || "Not specified",
      type: opp.type,
      about: opp.description,
      requirements: opp.required_skills || [],
      matchedSkills: [],
    },
  };
}

// Infer filter category from API type field
function getFilterCategory(opp) {
  const t = opp.type || "";
  if (t === "internship") return "Internships";
  if (t === "job") return "Graduate Roles";
  if (t === "project") return "Research";
  if (t === "hackathon") return "Grants";
  return "All";
}

// ── Opportunity Card ───────────────────────────────────────────────────────────

function OppCard({ opp, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? "var(--color-card-hover)" : "var(--color-card)",
        border: `1px solid ${selected ? "#6C63FF" : opp.featured ? "rgba(108,99,255,0.35)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: 16,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => { if (!selected) e.currentTarget.style.borderColor = "#6C63FF"; }}
      onMouseLeave={(e) => { if (!selected) e.currentTarget.style.borderColor = opp.featured ? "rgba(108,99,255,0.35)" : "var(--color-border)"; }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
        <CompanyLogo letter={opp.logo} color={opp.logoColor} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-1)", marginBottom: 2 }}>{opp.title}</div>
          <div style={{ fontSize: "0.78rem", color: "var(--color-text-3)" }}>{opp.company}</div>
        </div>
        {opp.match > 0 && <MatchBadge pct={opp.match} />}
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--color-text-2)", lineHeight: 1.5, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{opp.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        {opp.tags.slice(0, 4).map((t) => (
          <span key={t} style={{ background: "var(--color-surface)", color: "var(--color-text-2)", borderRadius: 10, padding: "2px 9px", fontSize: "0.72rem" }}>{t}</span>
        ))}
        <span style={{ fontSize: "0.72rem", color: "var(--color-text-3)", marginLeft: "auto" }}>{opp.deadline}</span>
      </div>
    </div>
  );
}

// ── Opportunity Detail ─────────────────────────────────────────────────────────

function OppDetail({ opp, appliedIds, onApply }) {
  const [showModal, setShowModal] = useState(false);

  if (!opp) {
    return (
      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: 28, position: "sticky", top: "28px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 500 }}>
        <div style={{ textAlign: "center", color: "var(--color-text-3)" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>💼</div>
          <p style={{ fontSize: "0.875rem" }}>Select an opportunity to see details</p>
        </div>
      </div>
    );
  }

  const d = opp.detail;
  const applied = appliedIds.has(opp.id);

  return (
    <>
      <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: 28, position: "sticky", top: "28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          <CompanyLogo letter={opp.logo} color={opp.logoColor} large />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--color-text-1)", marginBottom: 4 }}>{opp.title}</h2>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-2)" }}>{opp.company} · {d.location}</div>
          </div>
          {opp.match > 0 && <MatchBadge pct={opp.match} size="lg" />}
        </div>

        {/* Meta row */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: "var(--color-text-2)", fontSize: "0.8rem", marginBottom: 20 }}>
          {d.duration !== "Not specified" && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Calendar size={14} /> {d.duration}</span>}
          {d.pay !== "Not specified" && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Banknote size={14} /> {d.pay}</span>}
          {d.location !== "Not specified" && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={14} /> {d.location}</span>}
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={14} /> {d.type}</span>
        </div>

        {/* Apply button */}
        <button
          onClick={() => !applied && setShowModal(true)}
          style={{
            background: applied ? "rgba(0,212,170,0.12)" : "linear-gradient(135deg, #7B73FF, #00D4AA)",
            color: applied ? "#00D4AA" : "white",
            border: applied ? "1.5px solid #00D4AA" : "none",
            borderRadius: "var(--radius-sm)",
            padding: "11px 24px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: applied ? "default" : "pointer",
            width: "100%",
            marginBottom: 8,
            transition: "all 0.2s",
          }}
        >
          {applied ? "✓ Applied" : "Apply Now"}
        </button>

        {/* About */}
        <section style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
          <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-1)", marginBottom: 10 }}>About the role</h4>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-2)", lineHeight: 1.6 }}>{d.about}</p>
        </section>

        {/* Requirements */}
        {d.requirements.length > 0 && (
          <section style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-1)", marginBottom: 10 }}>Required skills</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {d.requirements.map((r) => (
                <li key={r} style={{ fontSize: "0.83rem", color: "var(--color-text-2)", display: "flex", alignItems: "flex-start", gap: 6 }}>
                  <Check size={14} style={{ color: "#00D4AA", flexShrink: 0, marginTop: 2 }} /> {r}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Matched skills */}
        {d.matchedSkills.length > 0 && (
          <section style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--color-border)" }}>
            <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", color: "var(--color-text-1)", marginBottom: 10 }}>Your matched skills</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {d.matchedSkills.map((s) => (
                <span key={s} style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(108,99,255,0.1)", border: "1.5px solid #6C63FF", color: "#6C63FF", borderRadius: 20, padding: "3px 10px", fontSize: "0.75rem" }}>
                  {s} <Check size={12} />
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {showModal && (
        <ApplyModal
          opp={opp}
          onClose={() => setShowModal(false)}
          onApply={(coverLetter) => { onApply(opp.id, coverLetter); setShowModal(false); }}
        />
      )}
    </>
  );
}

// ── Apply Modal ────────────────────────────────────────────────────────────────

function ApplyModal({ opp, onClose, onApply }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!coverLetter.trim()) { showToast("Please add a cover letter", "error"); return; }
    setSubmitting(true);
    try {
      await onApply(coverLetter);
      setSubmitted(true);
    } catch (err) {
      showToast(err.message || "Application failed", "error");
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="fade-in" style={{ background: "var(--color-card)", borderRadius: "var(--radius-xl)", padding: 28, width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--color-text-1)", marginBottom: 8 }}>Application submitted!</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-2)", marginBottom: 20, lineHeight: 1.5 }}>
              Your application has been sent to <strong>{opp.company}</strong>.
            </p>
            <button onClick={onClose} style={{ background: "linear-gradient(135deg, #7B73FF, #00D4AA)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "10px 28px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer" }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--color-text-1)", marginBottom: 2 }}>Apply — {opp.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-3)" }}>{opp.company}</p>
              </div>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-3)", display: "flex" }}><X size={20} /></button>
            </div>

            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "var(--color-text-1)", marginBottom: 6 }}>
              Cover letter <span style={{ color: "#FF6B6B" }}>*</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder={`Tell ${opp.company} why you're a great fit…`}
              autoFocus
              style={{ width: "100%", minHeight: 160, background: "var(--color-surface)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "12px 14px", color: "var(--color-text-1)", fontSize: "0.875rem", lineHeight: 1.6, resize: "vertical", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box", marginBottom: 16 }}
              onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
              onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
            />

            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", marginBottom: 20, color: "var(--color-text-3)", fontSize: "0.82rem" }}>
              <Paperclip size={14} />
              <span>Resume / Portfolio (optional) — attach file</span>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onClose} style={{ background: "none", border: "1.5px solid var(--color-border)", color: "var(--color-text-2)", borderRadius: "var(--radius-sm)", padding: "9px 20px", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}>
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!coverLetter.trim() || submitting}
                style={{ background: coverLetter.trim() && !submitting ? "linear-gradient(135deg, #7B73FF, #00D4AA)" : "var(--color-border)", color: coverLetter.trim() && !submitting ? "white" : "var(--color-text-3)", border: "none", borderRadius: "var(--radius-sm)", padding: "9px 26px", cursor: coverLetter.trim() && !submitting ? "pointer" : "not-allowed", fontWeight: 600, fontSize: "0.85rem" }}
              >
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Tab ───────────────────────────────────────────────────────────────────

export default function OpportunitiesTab() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [opps, apps] = await Promise.all([
          listOpportunities(),
          getMyApplications().catch(() => []),
        ]);
        setOpportunities(opps.map(apiOppToCard));
        setAppliedIds(new Set(apps.map((a) => a.opportunity_id)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = opportunities.filter((opp) => {
    if (filter === "All") return true;
    return getFilterCategory(opp) === filter;
  });

  async function handleApply(id, coverLetter) {
    await applyToOpportunity(id, coverLetter);
    setAppliedIds((prev) => new Set([...prev, id]));
    showToast("Application submitted!");
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }} className="fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-text-1)" }}>
          Opportunities
        </h2>
        <FilterBar filters={["All", "Internships", "Graduate Roles", "Research", "Grants"]} active={filter} onChange={(f) => { setFilter(f); setSelected(null); }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
        {/* Detail panel — sticky left */}
        <OppDetail opp={selected} appliedIds={appliedIds} onApply={handleApply} />

        {/* List — right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ background: "linear-gradient(135deg, rgba(108,99,255,0.1), rgba(0,212,170,0.06))", border: "1px solid rgba(108,99,255,0.25)", borderRadius: "var(--radius-lg)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
            <div className="ai-pulse" style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D4AA", flexShrink: 0, boxShadow: "0 0 0 4px rgba(0,212,170,0.15)" }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-1)", marginBottom: 2 }}>Live opportunities</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-2)" }}>
                {loading ? "Loading…" : `${filtered.length} role${filtered.length !== 1 ? "s" : ""} available`}
              </div>
            </div>
          </div>

          {loading ? (
            [1, 2, 3, 4].map((n) => <SkeletonOppCard key={n} />)
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
              <p style={{ color: "#ef4444", fontSize: "0.875rem" }}>{error}</p>
              <button onClick={() => window.location.reload()} style={{ marginTop: 12, background: "none", border: "1.5px solid #6C63FF", color: "#6C63FF", borderRadius: "var(--radius-sm)", padding: "6px 16px", fontSize: "0.8rem", cursor: "pointer" }}>Retry</button>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
              <div style={{ fontSize: "1.8rem", marginBottom: 10 }}>🔍</div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-3)" }}>
                {filter === "All" ? "No opportunities posted yet." : `No ${filter} opportunities right now.`}
              </p>
              {filter !== "All" && (
                <button onClick={() => setFilter("All")} style={{ marginTop: 12, background: "none", border: "1.5px solid #6C63FF", color: "#6C63FF", borderRadius: "var(--radius-sm)", padding: "6px 16px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>View all</button>
              )}
            </div>
          ) : (
            filtered.map((opp) => (
              <OppCard
                key={opp.id}
                opp={opp}
                selected={selected?.id === opp.id}
                onSelect={() => setSelected(selected?.id === opp.id ? null : opp)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { User, Bell, Lock, Shield, Eye, EyeOff, Check, LogOut, Building2, Trash2 } from "lucide-react";
import { Avatar } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { updateMyProfile } from "../../api/auth.js";
import { getMyCompanyPages, deleteCompanyPage } from "../../api/companyPages.js";

// ── Section wrapper ────────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 20 }}>
      <div style={{ padding: "16px 24px", borderBottom: "1px solid var(--color-border)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--color-text-1)", margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: "20px 24px" }}>{children}</div>
    </div>
  );
}

// ── Toggle row ─────────────────────────────────────────────────────────────────

function ToggleRow({ label, description, value, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--color-border)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-1)", marginBottom: 2 }}>{label}</div>
        {description && <div style={{ fontSize: "0.78rem", color: "var(--color-text-3)" }}>{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: value ? "#6C63FF" : "var(--color-border)",
          border: "none",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
        aria-pressed={value}
      >
        <span
          style={{
            position: "absolute",
            top: 3,
            left: value ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}

// ── Settings input ─────────────────────────────────────────────────────────────

function SettingsInput({ label, value, onChange, type = "text", placeholder, readOnly, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-2)", marginBottom: 6 }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          background: readOnly ? "var(--color-surface)" : "var(--color-card)",
          border: `1.5px solid ${focused ? "#6C63FF" : "var(--color-border)"}`,
          borderRadius: "var(--radius-md)",
          padding: "11px 14px",
          color: readOnly ? "var(--color-text-2)" : "var(--color-text-1)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-body)",
          outline: "none",
          boxSizing: "border-box",
          cursor: readOnly ? "not-allowed" : "text",
          transition: "border-color 0.15s",
        }}
      />
      {hint && <p style={{ margin: "5px 0 0", fontSize: "0.75rem", color: "var(--color-text-3)" }}>{hint}</p>}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export default function SettingsTab({ currentUser, onUpdateUser, onLogout, onNavigate }) {
  const user = currentUser || {};
  const [activeSection, setActiveSection] = useState("account");

  // Account state
  const [displayName, setDisplayName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [nameSaved, setNameSaved] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // Company pages
  const [companyPages, setCompanyPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(false);

  useEffect(() => {
    if (activeSection !== "account") return;
    setPagesLoading(true);
    getMyCompanyPages()
      .then(setCompanyPages)
      .catch(() => {})
      .finally(() => setPagesLoading(false));
  }, [activeSection]);

  async function handleDeletePage(pageId, pageName) {
    if (!window.confirm(`Delete "${pageName}"? This cannot be undone.`)) return;
    try {
      await deleteCompanyPage(pageId);
      setCompanyPages((prev) => prev.filter((p) => p.id !== pageId));
      showToast("Company page deleted");
    } catch (err) {
      showToast(err.message || "Failed to delete company page", "error");
    }
  }

  // Notification prefs
  const [notifPrefs, setNotifPrefs] = useState({
    mentorshipRequests: true,
    newConnections: true,
    newOpportunities: true,
    mentions: true,
    weeklyDigest: false,
    productUpdates: false,
  });

  // Privacy prefs
  const [privacyPrefs, setPrivacyPrefs] = useState({
    publicProfile: true,
    showEmail: false,
    showConnections: true,
    allowMentorRequests: true,
    indexedBySearch: true,
  });

  function toggleNotif(key) {
    setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));
    showToast("Notification preference updated");
  }

  function togglePrivacy(key) {
    setPrivacyPrefs((p) => ({ ...p, [key]: !p[key] }));
    showToast("Privacy setting updated");
  }

  async function saveProfile() {
    if (!displayName.trim()) { showToast("Name cannot be empty", "error"); return; }
    try {
      const role = user.role || "student";
      await updateMyProfile(role, { name: displayName.trim(), bio });
      onUpdateUser?.({ name: displayName.trim(), bio });
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2500);
      showToast("Profile updated!");
    } catch (err) {
      showToast(err.message || "Failed to save profile", "error");
    }
  }

  function changePassword() {
    if (!currentPw) { showToast("Enter your current password", "error"); return; }
    if (newPw.length < 8) { showToast("New password must be at least 8 characters", "error"); return; }
    if (newPw !== confirmPw) { showToast("Passwords don't match", "error"); return; }
    setCurrentPw(""); setNewPw(""); setConfirmPw("");
    showToast("Password changed successfully!");
  }

  const sections = [
    { id: "account", label: "Account", icon: <User size={16} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
    { id: "privacy", label: "Privacy", icon: <Shield size={16} /> },
    { id: "security", label: "Security", icon: <Lock size={16} /> },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px" }} className="fade-in">
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-text-1)", marginBottom: 24 }}>
        Settings
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, alignItems: "start" }}>
        {/* Sidebar */}
        <div style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: 8, position: "sticky", top: 28 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                background: activeSection === s.id ? "rgba(108,99,255,0.1)" : "none",
                color: activeSection === s.id ? "#6C63FF" : "var(--color-text-2)",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: activeSection === s.id ? 600 : 400,
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { if (activeSection !== s.id) { e.currentTarget.style.background = "var(--color-surface)"; e.currentTarget.style.color = "var(--color-text-1)"; } }}
              onMouseLeave={(e) => { if (activeSection !== s.id) { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--color-text-2)"; } }}
            >
              {s.icon} {s.label}
            </button>
          ))}

          <div style={{ borderTop: "1px solid var(--color-border)", marginTop: 8, paddingTop: 8 }}>
            <button
              onClick={onLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                background: "none",
                color: "#ef4444",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "10px 12px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeSection === "account" && (
            <>
              <Section title="Profile">
                {/* Avatar preview */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
                  <Avatar initials={user.initials || "U"} color="primary" size="lg" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-1)" }}>{user.name || "Your Name"}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-text-3)", marginBottom: 8 }}>@{(user.name || "user").toLowerCase().replace(/\s+/g, "")}</div>
                    <button style={{ background: "none", border: "1.5px solid var(--color-border)", color: "var(--color-text-2)", borderRadius: "var(--radius-sm)", padding: "5px 14px", fontSize: "0.78rem", cursor: "pointer" }}>
                      Change photo
                    </button>
                  </div>
                </div>

                <SettingsInput label="Display name" value={displayName} onChange={setDisplayName} placeholder="Your name" />

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-2)", marginBottom: 6 }}>Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community a bit about yourself…"
                    rows={3}
                    style={{ width: "100%", background: "var(--color-card)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "11px 14px", color: "var(--color-text-1)", fontSize: "0.875rem", fontFamily: "var(--font-body)", outline: "none", resize: "vertical", boxSizing: "border-box", transition: "border-color 0.15s" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                  />
                </div>

                <SettingsInput label="Email address" value={user.email || (user.name ? `${user.name.toLowerCase().replace(/\s+/g, ".")}@hyia.app` : "")} readOnly hint="Contact support to change your email address." />

                <button
                  onClick={saveProfile}
                  style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #7B73FF, #00D4AA)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "10px 22px", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer", transition: "opacity 0.2s" }}
                >
                  {nameSaved ? <><Check size={15} /> Saved</> : "Save changes"}
                </button>
              </Section>

              <Section title="Company Pages">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: companyPages.length ? 16 : 0 }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-1)", marginBottom: 3 }}>Create a Company Page</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-text-3)" }}>Represent your organization on Hyia. Post opportunities, showcase your culture, and connect with talent.</div>
                  </div>
                  <button
                    onClick={() => onNavigate?.("company-page-create")}
                    style={{ flexShrink: 0, background: "linear-gradient(135deg, #7B73FF, #00D4AA)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "8px 18px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    + Create Page
                  </button>
                </div>

                {pagesLoading && (
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-3)", margin: 0 }}>Loading…</p>
                )}

                {!pagesLoading && companyPages.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {companyPages.map((page) => (
                      <div
                        key={page.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                          background: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          borderRadius: "var(--radius-md)",
                          padding: "12px 16px",
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(108,99,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Building2 size={18} color="#6C63FF" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-text-1)", marginBottom: 2 }}>{page.company_name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
                            {[page.industry, page.location].filter(Boolean).join(" · ") || "Company Page"}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePage(page.id, page.company_name)}
                          title="Delete company page"
                          style={{ background: "none", border: "none", color: "var(--color-text-3)", cursor: "pointer", padding: 4, display: "flex", borderRadius: 6 }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-3)"; e.currentTarget.style.background = "none"; }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              <Section title="Danger zone">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text-1)", marginBottom: 3 }}>Delete account</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-text-3)" }}>Permanently remove your Hyia account and all associated data. This cannot be undone.</div>
                  </div>
                  <button
                    onClick={() => showToast("Account deletion requires email confirmation. Check your inbox.", "error")}
                    style={{ flexShrink: 0, background: "none", border: "1.5px solid #ef4444", color: "#ef4444", borderRadius: "var(--radius-sm)", padding: "8px 16px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                  >
                    Delete account
                  </button>
                </div>
              </Section>
            </>
          )}

          {activeSection === "notifications" && (
            <Section title="Notification preferences">
              <div style={{ paddingBottom: 4 }}>
                <ToggleRow label="Mentorship requests" description="When someone sends you a mentorship request" value={notifPrefs.mentorshipRequests} onChange={() => toggleNotif("mentorshipRequests")} />
                <ToggleRow label="New connections" description="When someone connects with you on Hyia" value={notifPrefs.newConnections} onChange={() => toggleNotif("newConnections")} />
                <ToggleRow label="New opportunities" description="AI-matched opportunities based on your profile" value={notifPrefs.newOpportunities} onChange={() => toggleNotif("newOpportunities")} />
                <ToggleRow label="Mentions" description="When someone mentions or tags you in a post" value={notifPrefs.mentions} onChange={() => toggleNotif("mentions")} />
                <ToggleRow label="Weekly digest" description="A summary of activity in your network every Monday" value={notifPrefs.weeklyDigest} onChange={() => toggleNotif("weeklyDigest")} />
                <div style={{ paddingBottom: 0, borderBottom: "none" }}>
                  <ToggleRow label="Product updates" description="New features and announcements from Hyia" value={notifPrefs.productUpdates} onChange={() => toggleNotif("productUpdates")} />
                </div>
              </div>
            </Section>
          )}

          {activeSection === "privacy" && (
            <Section title="Privacy controls">
              <div style={{ paddingBottom: 4 }}>
                <ToggleRow label="Public profile" description="Anyone on Hyia can view your profile" value={privacyPrefs.publicProfile} onChange={() => togglePrivacy("publicProfile")} />
                <ToggleRow label="Show email address" description="Display your email on your public profile" value={privacyPrefs.showEmail} onChange={() => togglePrivacy("showEmail")} />
                <ToggleRow label="Show connections" description="Let others see your connections list" value={privacyPrefs.showConnections} onChange={() => togglePrivacy("showConnections")} />
                <ToggleRow label="Allow mentorship requests" description="Students can send you mentorship requests" value={privacyPrefs.allowMentorRequests} onChange={() => togglePrivacy("allowMentorRequests")} />
                <div style={{ paddingBottom: 0, borderBottom: "none" }}>
                  <ToggleRow label="Appear in search" description="Allow your profile to be found via Hyia search and AI matching" value={privacyPrefs.indexedBySearch} onChange={() => togglePrivacy("indexedBySearch")} />
                </div>
              </div>
            </Section>
          )}

          {activeSection === "security" && (
            <Section title="Change password">
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-2)", marginBottom: 6 }}>Current password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    style={{ width: "100%", background: "var(--color-card)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "11px 44px 11px 14px", color: "var(--color-text-1)", fontSize: "0.875rem", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                  />
                  <button type="button" onClick={() => setShowCurrent((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-3)", cursor: "pointer", display: "flex" }}>
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-2)", marginBottom: 6 }}>New password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Choose a new password"
                    style={{ width: "100%", background: "var(--color-card)", border: "1.5px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "11px 44px 11px 14px", color: "var(--color-text-1)", fontSize: "0.875rem", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => (e.target.style.borderColor = "#6C63FF")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                  />
                  <button type="button" onClick={() => setShowNew((s) => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--color-text-3)", cursor: "pointer", display: "flex" }}>
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPw && <PasswordStrength password={newPw} />}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-2)", marginBottom: 6 }}>Confirm new password</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Re-enter new password"
                  style={{ width: "100%", background: "var(--color-card)", border: `1.5px solid ${confirmPw && confirmPw !== newPw ? "#ef4444" : "var(--color-border)"}`, borderRadius: "var(--radius-md)", padding: "11px 14px", color: "var(--color-text-1)", fontSize: "0.875rem", fontFamily: "var(--font-body)", outline: "none", boxSizing: "border-box" }}
                  onFocus={(e) => (e.target.style.borderColor = confirmPw && confirmPw !== newPw ? "#ef4444" : "#6C63FF")}
                  onBlur={(e) => (e.target.style.borderColor = confirmPw && confirmPw !== newPw ? "#ef4444" : "var(--color-border)")}
                />
                {confirmPw && confirmPw !== newPw && <p style={{ margin: "5px 0 0", fontSize: "0.75rem", color: "#ef4444" }}>Passwords don't match</p>}
              </div>

              <button
                onClick={changePassword}
                style={{ background: "linear-gradient(135deg, #7B73FF, #00D4AA)", color: "white", border: "none", borderRadius: "var(--radius-sm)", padding: "10px 22px", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}
              >
                Update password
              </button>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Password strength meter ────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#FFB74D", "#6C63FF", "#00D4AA"];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map((n) => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: n <= score ? colors[score] : "var(--color-border)", transition: "background 0.3s" }} />
        ))}
      </div>
      <p style={{ margin: 0, fontSize: "0.72rem", color: colors[score] || "var(--color-text-3)", fontWeight: 500 }}>
        {labels[score] || "Too short"}
      </p>
    </div>
  );
}

import { useState } from "react";
import { SkillTag } from "../components/ui/index.jsx";
import {
  AuthShell,
  StepIndicator,
  FormGroup,
  PrimaryBtn,
  GhostBtn,
} from "./StudentOnboarding.jsx";

const h1Style = {
  fontFamily: "var(--font-display)",
  fontSize: "1.75rem",
  fontWeight: 700,
  color: "var(--color-text-1)",
  marginBottom: 8,
};

const subStyle = {
  color: "var(--color-text-2)",
  marginBottom: 28,
  fontSize: "1rem",
};

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--color-text-2)",
  marginBottom: 10,
};

const inputStyle = {
  width: "100%",
  background: "var(--color-surface)",
  border: "1.5px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  padding: "13px 44px 13px 42px",
  color: "var(--color-text-1)",
  fontSize: "0.95rem",
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.2s",
};

// ---- Step 1: Basic Info ----
export function AlumniSignupPage({ onNavigate }) {
  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canContinue =
    name.trim() &&
    emailValid &&
    university.trim() &&
    gradYear &&
    jobTitle.trim() &&
    company.trim();

  return (
    <AuthShell>
      <StepIndicator current={2} />
      <h1 style={h1Style}>Tell us about yourself</h1>
      <p style={subStyle}>Your profile helps students find the right mentor.</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <FormGroup label="Full Name">
          <input
            type="text"
            placeholder="Kwame Asante"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </FormGroup>
        <FormGroup label="Email">
          <input
            type="email"
            placeholder="kwame@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </FormGroup>
        <FormGroup label="University Attended">
          <input
            type="text"
            placeholder="e.g. KNUST, UG, GIMPA"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            style={inputStyle}
          />
        </FormGroup>
        <FormGroup label="Graduation Year">
          <select
            value={gradYear}
            onChange={(e) => setGradYear(e.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>
              Select year
            </option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup label="Current Job Title">
          <input
            type="text"
            placeholder="e.g. Senior Software Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            style={inputStyle}
          />
        </FormGroup>
        <FormGroup label="Company / Organization">
          <input
            type="text"
            placeholder="e.g. Google, MTN, Self-employed"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={inputStyle}
          />
        </FormGroup>
        <FormGroup label="LinkedIn Profile" optional fullWidth>
          <input
            type="url"
            placeholder="https://linkedin.com/in/your-name"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            style={inputStyle}
          />
        </FormGroup>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <GhostBtn onClick={() => onNavigate("create-account")}>← Back</GhostBtn>
        <span
          style={{
            opacity: canContinue ? 1 : 0.5,
            pointerEvents: canContinue ? "auto" : "none",
          }}
        >
          <PrimaryBtn
            onClick={() =>
              onNavigate("alumni-expertise", {
                name,
                email,
                university,
                gradYear,
                jobTitle,
                company,
                linkedin,
              })
            }
          >
            Continue →
          </PrimaryBtn>
        </span>
      </div>
    </AuthShell>
  );
}

// ---- Step 2: Expertise & Mentoring ----
const INITIAL_EXPERTISE = ["System Design", "Career Growth", "Leadership"];
const SUGGESTED_EXPERTISE = [
  "Frontend",
  "Backend",
  "Cloud Architecture",
  "Data Science",
  "ML / AI",
  "Entrepreneurship",
  "DevOps",
  "Mobile Development",
  "Product Management",
  "Finance",
];

const MENTOR_OFFERINGS = [
  "Career Guidance",
  "Resume Review",
  "Mock Interviews",
  "Project Feedback",
  "Industry Insights",
  "Networking",
];

const AVAILABILITY_OPTIONS = [
  "1–2 hrs / week",
  "3–5 hrs / week",
  "On request only",
  "Not available right now",
];

export function AlumniExpertisePage({ onNavigate }) {
  const [selected, setSelected] = useState(INITIAL_EXPERTISE);
  const [suggestions, setSuggestions] = useState(SUGGESTED_EXPERTISE);
  const [input, setInput] = useState("");
  const [offerings, setOfferings] = useState([
    "Career Guidance",
    "Resume Review",
  ]);
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("1–2 hrs / week");
  const [menteeCapacity, setMenteeCapacity] = useState(3);

  function addSkill(name) {
    if (!selected.includes(name)) setSelected((s) => [...s, name]);
    setSuggestions((s) => s.filter((x) => x !== name));
  }

  function removeSkill(name) {
    setSelected((s) => s.filter((x) => x !== name));
    if (SUGGESTED_EXPERTISE.includes(name)) setSuggestions((s) => [...s, name]);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim()) {
      addSkill(input.trim());
      setInput("");
    }
  }

  function toggleOffering(o) {
    setOfferings((prev) =>
      prev.includes(o) ? prev.filter((x) => x !== o) : [...prev, o],
    );
  }

  return (
    <AuthShell>
      <StepIndicator current={3} />
      <h1 style={h1Style}>Your mentoring profile</h1>
      <p style={subStyle}>
        Help our AI connect you with the students who need you most.
      </p>

      {/* Expertise tags */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Areas of expertise</label>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 10,
          }}
        >
          {selected.map((s) => (
            <SkillTag
              key={s}
              label={s}
              active
              onRemove={() => removeSkill(s)}
            />
          ))}
        </div>
        <input
          type="text"
          placeholder="Add an area…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ ...inputStyle, marginTop: 10 }}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>Suggested areas</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {suggestions.map((s) => (
            <SkillTag key={s} label={s} suggest onClick={() => addSkill(s)} />
          ))}
        </div>
      </div>

      {/* What you can offer */}
      <div style={{ marginBottom: 24 }}>
        <label style={labelStyle}>What you can offer</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {MENTOR_OFFERINGS.map((o) => (
            <OfferingChip
              key={o}
              label={o}
              active={offerings.includes(o)}
              onToggle={() => toggleOffering(o)}
            />
          ))}
        </div>
      </div>

      {/* Bio */}
      <FormGroup label="Bio" optional>
        <textarea
          placeholder="Share a bit about your journey and what inspires you to mentor…"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={inputStyle}
        />
      </FormGroup>

      {/* Availability + Mentee Capacity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        <FormGroup label="Availability for mentoring">
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            style={inputStyle}
          >
            {AVAILABILITY_OPTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup label="Max Mentees at a Time">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              ...inputStyle,
            }}
          >
            <input
              type="number"
              min={1}
              max={20}
              value={menteeCapacity}
              onChange={(e) =>
                setMenteeCapacity(
                  Math.max(1, Math.min(20, Number(e.target.value))),
                )
              }
              style={{ width: 80 }}
            />
            <span style={{ color: "var(--color-text-3)", fontSize: "0.8rem" }}>
              mentees
            </span>
          </div>
        </FormGroup>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <GhostBtn onClick={() => onNavigate("alumni-signup")}>← Back</GhostBtn>
        <PrimaryBtn
          onClick={() =>
            onNavigate("home", {
              expertise: selected,
              bio,
              availability,
              offerings,
              menteeCapacity,
            })
          }
        >
          Finish & Enter Hyia →
        </PrimaryBtn>
      </div>
    </AuthShell>
  );
}

// ---- Toggle chip used for offerings ----
function OfferingChip({ label, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background: active ? "rgba(108,99,255,0.15)" : "var(--color-card)",
        border: `1.5px solid ${active ? "#6C63FF" : "var(--color-border)"}`,
        color: active ? "#6C63FF" : "var(--color-text-2)",
        borderRadius: 20,
        padding: "6px 14px",
        fontSize: "0.8rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      {label}
    </button>
  );
}

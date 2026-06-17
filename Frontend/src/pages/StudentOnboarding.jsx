import { useState } from "react";
import { Logo, SkillTag } from "../components/ui/index.jsx";

// ---- Shared step indicator ----
export function StepIndicator({ current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
      {[1, 2, 3].map((n, i) => (
        <div key={n} style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `2px solid ${n <= current ? "#6C63FF" : "var(--color-border)"}`,
              background:
                n <= current ? "rgba(108,99,255,0.15)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: n <= current ? "#6C63FF" : "var(--color-text-3)",
              transition: "all 0.3s",
            }}
          >
            {n}
          </div>
          {i < 2 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background: "var(--color-border)",
                maxWidth: 60,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function AuthShell({ children }) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 48,
        background: "var(--color-base)",
        minHeight: "100vh",
      }}
      className="fade-in"
    >
      <div
        style={{
          marginBottom: 40,
          alignSelf: "flex-start",
          width: "100%",
          maxWidth: 600,
          margin: "0 auto 40px",
        }}
      >
        <Logo />
      </div>
      <div style={{ width: "100%", maxWidth: 600 }}>{children}</div>
    </div>
  );
}

// ---- Step 1: Basic Info ----
export function StudentSignupPage({ onNavigate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("Year 1");

  return (
    <AuthShell>
      <StepIndicator current={2} />
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--color-text-1)",
          marginBottom: 8,
        }}
      >
        Tell us about yourself
      </h1>

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
            placeholder="e.g. Nana Ama Adwubi"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Email">
          <input
            type="email"
            placeholder="you@university.edu.gh"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="University">
          <input
            type="text"
            placeholder="e.g. KNUST, UG, UCC"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Course / Programme">
          <input
            type="text"
            placeholder="e.g. BSc Computer Science"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Year of Study">
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            {["Year 1", "Year 2", "Year 3", "Year 4"].map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </FormGroup>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <GhostBtn onClick={() => onNavigate("create-account")}>← Back</GhostBtn>
        <PrimaryBtn
          onClick={() =>
            onNavigate("student-skills", { name, email, university, course, year })
          }
        >
          Continue →
        </PrimaryBtn>
      </div>
    </AuthShell>
  );
}

// ---- Step 2: Skills ----
const INITIAL_SKILLS = ["Python", "React", "UI/UX Design", "Machine Learning"];
const SUGGESTED_SKILLS = [
  "Flutter",
  "Node.js",
  "Data Analysis",
  "Firebase",
  "SQL",
  "Figma",
  "Cloud Computing",
  "Agile",
];

export function StudentSkillsPage({ onNavigate }) {
  const [selected, setSelected] = useState(INITIAL_SKILLS);
  const [suggestions, setSuggestions] = useState(SUGGESTED_SKILLS);
  const [input, setInput] = useState("");
  const [bio, setBio] = useState("");

  function addSkill(name) {
    if (!selected.includes(name)) setSelected((s) => [...s, name]);
    setSuggestions((s) => s.filter((x) => x !== name));
  }

  function removeSkill(name) {
    setSelected((s) => s.filter((x) => x !== name));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim()) {
      addSkill(input.trim());
      setInput("");
    }
  }

  return (
    <AuthShell>
      <StepIndicator current={3} />
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--color-text-1)",
          marginBottom: 8,
        }}
      >
        Your skill profile
      </h1>
      <p
        style={{
          color: "var(--color-text-2)",
          marginBottom: 28,
          fontSize: "1rem",
        }}
      >
        Help our AI match you with the right mentors and opportunities
      </p>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Selected skills</label>
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
          placeholder="Add a skill…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginTop: 10 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Suggested for you</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {suggestions.map((s) => (
            <SkillTag key={s} label={s} suggest onClick={() => addSkill(s)} />
          ))}
        </div>
      </div>

      <FormGroup label="Bio" optional>
        <textarea
          placeholder="Tell the Hyia community a bit about yourself and your goals…"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </FormGroup>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
          marginTop: 24,
        }}
      >
        <GhostBtn onClick={() => onNavigate("student-signup")}>← Back</GhostBtn>
        <PrimaryBtn onClick={() => onNavigate("home", { skills: selected, bio })}>
          Finish & Enter Hyia →
        </PrimaryBtn>
      </div>
    </AuthShell>
  );
}

// ---- Shared small components ----
const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--color-text-2)",
  marginBottom: 10,
};

export function FormGroup({ label, optional, fullWidth, children }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        gridColumn: fullWidth ? "1 / -1" : "auto",
      }}
    >
      <label
        style={{
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "var(--color-text-2)",
        }}
      >
        {label}{" "}
        {optional && (
          <span style={{ color: "var(--color-text-3)", fontWeight: 400 }}>
            (optional)
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function PrimaryBtn({ onClick, children, fullWidth }) {
  return (
    <button
      onClick={onClick}
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
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        width: fullWidth ? "100%" : "auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.9";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

export function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: "var(--color-text-2)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        padding: "11px 20px",
        fontFamily: "var(--font-display)",
        fontWeight: 500,
        fontSize: "0.9rem",
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border-light)";
        e.currentTarget.style.color = "var(--color-text-1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.color = "var(--color-text-2)";
      }}
    >
      {children}
    </button>
  );
}

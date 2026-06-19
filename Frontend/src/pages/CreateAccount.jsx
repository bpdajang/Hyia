import { useState } from "react";
import {
  AuthShell,
  StepIndicator,
  PrimaryBtn,
  GhostBtn,
} from "./StudentOnboarding.jsx";
import { Mail, Lock, GraduationCap, Landmark, Building2 } from "lucide-react";

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
  itemAlign: "inline",
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

// Maps the selected role (carried via its onboarding page id) to a friendly label.
const ROLE_LABELS = {
  "student-signup": { icon: <GraduationCap />, label: "a Student" },
  "alumni-signup": { icon: <Landmark />, label: "an Alumni / Mentor" },
  "company-signup": { icon: <Building2 />, label: "a Company" },
};

export default function CreateAccountPage({ role, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  // `role.page` is the role-specific onboarding page chosen on the previous step.
  const target = role?.page || "student-signup";
  const roleMeta = ROLE_LABELS[target];

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canContinue = emailValid && password.length >= 8;

  function focusBorder(e) {
    e.currentTarget.style.borderColor = "#6C63FF";
  }
  function blurBorder(e) {
    e.currentTarget.style.borderColor = "var(--color-border)";
  }

  return (
    <AuthShell>
      <StepIndicator current={1} />
      <h1 style={h1Style}>Create your account</h1>
      <p style={subStyle}>
        {roleMeta ? (
          <>
            You're signing up as {roleMeta.icon}{" "}
            <strong style={{ color: "var(--color-text-1)", fontWeight: 600 }}>
              {roleMeta.label}
            </strong>
            .
          </>
        ) : (
          "We're so excited to have you join us!"
        )}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginBottom: 24,
        }}
      >
        {/* Email */}
        <div>
          <label style={labelStyle}>Email</label>
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>
              <Mail />
            </span>
            <input
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={focusBorder}
              onBlur={blurBorder}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative" }}>
            <span style={iconStyle}>
              <Lock />
            </span>
            <input
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Choose your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={focusBorder}
              onBlur={blurBorder}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              style={toggleStyle}
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? "Hide" : "Show"}
            </button>
          </div>
          {password ? (
            <PasswordStrength password={password} />
          ) : (
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--color-text-3)",
                marginTop: 8,
              }}
            >
              Use at least 8 characters.
            </p>
          )}
        </div>
      </div>

      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--color-text-2)",
          marginBottom: 28,
        }}
      >
        By creating an account you agree to the{" "}
        <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" style={linkStyle} onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </a>
        .
      </p>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <GhostBtn onClick={() => onNavigate("signup")}>← Back</GhostBtn>
        <span
          style={{
            opacity: canContinue ? 1 : 0.5,
            pointerEvents: canContinue ? "auto" : "none",
          }}
        >
          <PrimaryBtn onClick={() => onNavigate(target, { email })}>
            Next →
          </PrimaryBtn>
        </span>
      </div>
    </AuthShell>
  );
}

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
          <div
            key={n}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: n <= score ? colors[score] : "var(--color-border)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <p
        style={{
          margin: 0,
          fontSize: "0.72rem",
          color: colors[score] || "var(--color-text-3)",
          fontWeight: 500,
        }}
      >
        {labels[score] || "Too short"}
      </p>
    </div>
  );
}

const iconStyle = {
  position: "absolute",
  left: 14,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "0.95rem",
  opacity: 0.7,
  pointerEvents: "none",
};

const toggleStyle = {
  position: "absolute",
  right: 12,
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  color: "var(--color-text-2)",
  fontSize: "0.8rem",
  fontWeight: 500,
  cursor: "pointer",
  padding: 4,
};

const linkStyle = {
  color: "#6C63FF",
  textDecoration: "none",
  fontWeight: 500,
};

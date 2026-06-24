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

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <SocialSignupBtn icon="google" label="Google" />
        <SocialSignupBtn icon="linkedin" label="LinkedIn" />
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
          <PrimaryBtn onClick={() => onNavigate(target, { email, password })}>
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

function SocialSignupBtn({ icon, label }) {
  return (
    <button
      type="button"
      onClick={() => showToast(`${label} sign-up coming soon!`)}
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        background: "var(--color-card)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "11px 16px",
        cursor: "pointer",
        fontSize: "0.875rem",
        fontWeight: 500,
        color: "var(--color-text-1)",
        transition: "all 0.15s",
        fontFamily: "var(--font-body)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6C63FF";
        e.currentTarget.style.background = "rgba(108,99,255,0.04)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background = "var(--color-card)";
      }}
    >
      {icon === "google" && (
        <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
          <path
            d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z"
            fill="#4285F4"
          />
          <path
            d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.8H2.5v6.2C6.5 42.8 14.7 48 24 48z"
            fill="#34A853"
          />
          <path
            d="M10.6 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7v-6.2H2.5A23.9 23.9 0 000 24c0 3.9.9 7.5 2.5 10.9l8.1-6.2z"
            fill="#FBBC05"
          />
          <path
            d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.1 30.5 0 24 0 14.7 0 6.5 5.2 2.5 13.1l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z"
            fill="#EA4335"
          />
        </svg>
      )}
      {icon === "linkedin" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )}
      {label}
    </button>
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

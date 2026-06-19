import { useState } from "react";
import { useNetworkCanvas } from "../hooks/useNetworkCanvas.js";
import { Logo } from "../components/ui/index.jsx";
import { Mail, Lock } from "lucide-react";
import { showToast } from "../components/ui/toast.js";

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

export default function SignInPage({ onNavigate }) {
  useNetworkCanvas("network-canvas");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = emailValid && password.length > 0;

  function focusBorder(e) {
    e.currentTarget.style.borderColor = "#6C63FF";
  }
  function blurBorder(e) {
    e.currentTarget.style.borderColor = "var(--color-border)";
  }

  function submit(e) {
    e.preventDefault();
    if (canSubmit) onNavigate("home", { email });
  }

  return (
    <div className="flex min-h-screen fade-in">
      {/* Left panel — form */}
      <div
        className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-12 md:px-12"
        style={{ background: "var(--color-surface)", minHeight: "100vh" }}
      >
        <div className="w-full max-w-sm md:max-w-md">
          <div className="mb-10">
            <Logo />
          </div>

          <h1
            className="text-2xl md:text-[1.75rem] font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-1)",
            }}
          >
            Welcome back
          </h1>
          <p
            className="text-base mb-8"
            style={{ color: "var(--color-text-2)" }}
          >
            Sign in to continue to your Hyia network.
          </p>

          <form onSubmit={submit}>
            {/* Email */}
            <div className="mb-5">
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
            <div className="mb-2">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <label style={labelStyle}>Password</label>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    ...linkStyle,
                    fontSize: "0.75rem",
                    marginBottom: 10,
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>
                  <Lock />
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
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
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                marginTop: 24,
                width: "100%",
                background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-sm)",
                padding: "13px 24px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                cursor: canSubmit ? "pointer" : "not-allowed",
                opacity: canSubmit ? 1 : 0.5,
                transition: "all 0.2s",
              }}
            >
              Sign in
            </button>
          </form>

          <div
            className="flex items-center gap-3 my-6"
            style={{ color: "var(--color-text-3)" }}
          >
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span style={{ fontSize: "0.8rem" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <SocialBtn icon="google" label="Google" />
            <SocialBtn icon="linkedin" label="LinkedIn" />
          </div>

          <p className="text-center" style={{ color: "var(--color-text-2)" }}>
            New to Hyia?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("signup");
              }}
              className="font-medium"
              style={{ color: "#6C63FF", textDecoration: "none" }}
            >
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* Right panel — canvas (hidden on mobile) */}
      <div
        className="hidden md:flex md:w-1/2 relative overflow-hidden items-end p-12"
        style={{ background: "var(--color-base)" }}
      >
        <canvas
          id="network-canvas"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div className="relative z-10">
          <h2
            className="gradient-text text-3xl font-bold mb-3 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Where academia meets industry
          </h2>
          <p
            className="text-base max-w-sm"
            style={{ color: "var(--color-text-2)" }}
          >
            Semantic talent discovery. Intelligent mentorship matching. Real
            opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}

function SocialBtn({ icon, label }) {
  return (
    <button
      type="button"
      onClick={() => showToast(`${label} sign-in coming soon!`)}
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
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6C63FF"; e.currentTarget.style.background = "rgba(108,99,255,0.04)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.background = "var(--color-card)"; }}
    >
      {icon === "google" && (
        <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
          <path d="M47.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.5z" fill="#4285F4"/>
          <path d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.8H2.5v6.2C6.5 42.8 14.7 48 24 48z" fill="#34A853"/>
          <path d="M10.6 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7v-6.2H2.5A23.9 23.9 0 000 24c0 3.9.9 7.5 2.5 10.9l8.1-6.2z" fill="#FBBC05"/>
          <path d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.1 30.5 0 24 0 14.7 0 6.5 5.2 2.5 13.1l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z" fill="#EA4335"/>
        </svg>
      )}
      {icon === "linkedin" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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

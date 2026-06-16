import { useState } from "react";
import { useNetworkCanvas } from "../hooks/useNetworkCanvas.js";
import { Logo } from "../components/ui/index.jsx";

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
          <p className="text-base mb-8" style={{ color: "var(--color-text-2)" }}>
            Sign in to continue to your Hyia network.
          </p>

          <form onSubmit={submit}>
            {/* Email */}
            <div className="mb-5">
              <label style={labelStyle}>Email</label>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>✉️</span>
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
                  style={{ ...linkStyle, fontSize: "0.75rem", marginBottom: 10 }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <span style={iconStyle}>🔒</span>
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
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-border)" }}
            />
            <span>or</span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-border)" }}
            />
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

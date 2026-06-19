import { useNetworkCanvas } from "../hooks/useNetworkCanvas.js";
import { Logo } from "../components/ui/index.jsx";
import { GraduationCap, Landmark, Building2 } from "lucide-react";
import { showToast } from "../components/ui/toast.js";

const ROLES = [
  {
    icon: <GraduationCap />,
    label: "Student",
    desc: "Connect with mentors & discover opportunities",
    page: "student-signup",
  },
  {
    icon: <Landmark />,
    label: "Alumni / Mentor",
    desc: "Guide the next generation of talent",
    page: "alumni-signup",
  },
  {
    icon: <Building2 />,
    label: "Company",
    desc: "Discover and recruit top academic talent",
    page: "company-signup",
  },
];

export default function SignUpPage({ onNavigate, onSelectRole }) {
  useNetworkCanvas("network-canvas");

  return (
    <div className="flex min-h-screen fade-in">
      {/* Left panel */}
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
            Join the community
          </h1>
          <p
            className="text-base mb-8"
            style={{ color: "var(--color-text-2)" }}
          >
            Who are you signing up as?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
            {ROLES.map((role) => (
              <RoleCard
                key={role.label}
                role={role}
                onSelectRole={onSelectRole}
              />
            ))}
          </div>

          <div
            className="flex items-center gap-3 my-3"
            style={{ color: "var(--color-text-3)" }}
          >
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
            <span style={{ fontSize: "0.8rem" }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            <SocialSignupBtn icon="google" label="Google" />
            <SocialSignupBtn icon="linkedin" label="LinkedIn" />
          </div>

          <p className="text-center" style={{ color: "var(--color-text-2)" }}>
            Already a member?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate("signin");
              }}
              className="font-medium"
              style={{ color: "#6C63FF", textDecoration: "none" }}
            >
              Sign in
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

function RoleCard({ role, onSelectRole }) {
  return (
    <button
      onClick={() => onSelectRole(role)}
      className="flex flex-col items-center gap-2 cursor-pointer text-center transition-all duration-200 rounded-2xl"
      style={{
        background: "var(--color-card)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px 16px",
        color: "var(--color-text-1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6C63FF";
        e.currentTarget.style.background = "rgba(108,99,255,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(108,99,255,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background = "var(--color-card)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="text-4xl sm:text-3xl">{role.icon}</div>
      <div
        className="font-semibold text-sm"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text-1)",
        }}
      >
        {role.label}
      </div>
      <div
        className="text-xs leading-snug"
        style={{ color: "var(--color-text-3)" }}
      >
        {role.desc}
      </div>
    </button>
  );
}

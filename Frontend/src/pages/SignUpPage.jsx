import { useNetworkCanvas } from "../hooks/useNetworkCanvas.js";
import { Logo } from "../components/ui/index.jsx";
import { GraduationCap, Landmark } from "lucide-react";

const ROLES = [
  {
    icon: <GraduationCap />,
    label: "Student",
    desc: "Connect with mentors & discover opportunities",
    page: "student-signup",
  },
  {
    icon: <Landmark />,
    label: "Alumni / Professional",
    desc: "Guide the next generation of talent",
    page: "alumni-signup",
  },
];

export default function SignUpPage({ onNavigate, onSelectRole }) {
  useNetworkCanvas("network-canvas");

  return (
    <div className="flex min-h-screen fade-in">
      {/* Left panel (hidden on mobile) */}
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
        <div className="relative z-10 left-2">
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

      {/* Right panel — canvas */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
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
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-border)" }}
            />
            <span style={{ fontSize: "0.8rem" }}>or continue with</span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--color-border)" }}
            />
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
    </div>
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

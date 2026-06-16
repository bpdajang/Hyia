// ============================================
// HYIA — Shared UI Components
// ============================================

const COLOR_MAP = {
  primary: { bg: "rgba(108,99,255,0.15)", text: "#6C63FF" },
  accent: { bg: "rgba(0,212,170,0.15)", text: "#00D4AA" },
  warn: { bg: "rgba(255,183,77,0.15)", text: "#FFB74D" },
  danger: { bg: "rgba(255,107,107,0.15)", text: "#FF6B6B" },
};

const SIZE_MAP = {
  xl: { size: 90, font: "1.6rem", border: "3px solid #6C63FF" },
  lg: { size: 56, font: "1rem" },
  md: { size: 42, font: "0.85rem" },
  sm: { size: 34, font: "0.75rem" },
  xs: { size: 28, font: "0.65rem" },
};

export function Avatar({
  initials,
  color = "primary",
  size = "md",
  style = {},
}) {
  const c = COLOR_MAP[color] || COLOR_MAP.primary;
  const s = SIZE_MAP[size] || SIZE_MAP.md;
  return (
    <div
      style={{
        width: s.size,
        height: s.size,
        borderRadius: "50%",
        background: c.bg,
        color: c.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: s.font,
        flexShrink: 0,
        border: s.border,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}

export function LogoMark({ small = false }) {
  return (
    <div
      style={{
        width: small ? 20 : 28,
        height: small ? 18 : 26,
        background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
        display: "flex",
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: small ? "0.9rem" : "1.1rem",
        color: "white",
        flexShrink: 0,
      }}
    >
      a
    </div>
  );
}

export function Logo({ small = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: small ? 1 : 3 }}>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: small ? "1.1rem" : "1.4rem",
          fontWeight: 700,
          color: "var(--color-text-1)",
          letterSpacing: "-0.5px",
        }}
      >
        Hyi
      </span>
      <LogoMark small={small} />
    </div>
  );
}

export function SkillTag({ label, active, suggest, small, onRemove, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: active
          ? "rgba(108,99,255,0.15)"
          : suggest
            ? "var(--color-card)"
            : "var(--color-card)",
        border: `1.5px solid ${active ? "#6C63FF" : "var(--color-border)"}`,
        color: active ? "#6C63FF" : "var(--color-text-2)",
        borderRadius: 20,
        padding: small ? "3px 10px" : "5px 12px",
        fontSize: small ? "0.75rem" : "0.8rem",
        cursor: onClick || onRemove ? "pointer" : "default",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
    >
      {label}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{
            background: "none",
            border: "none",
            color: "inherit",
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

export function SkillPill({ label, small }) {
  return (
    <span
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text-2)",
        borderRadius: 12,
        padding: small ? "1px 6px" : "2px 8px",
        fontSize: small ? "0.7rem" : "0.75rem",
      }}
    >
      {label}
    </span>
  );
}

export function FilterBar({ filters, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            background:
              active === f ? "rgba(108,99,255,0.15)" : "var(--color-card)",
            border: `1.5px solid ${active === f ? "#6C63FF" : "var(--color-border)"}`,
            color: active === f ? "#6C63FF" : "var(--color-text-2)",
            borderRadius: 20,
            padding: "6px 16px",
            fontSize: "0.8rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export function CompanyLogo({ letter, color = "primary", large = false }) {
  const c = COLOR_MAP[color] || COLOR_MAP.primary;
  return (
    <div
      style={{
        width: large ? 56 : 36,
        height: large ? 56 : 36,
        borderRadius: large ? 12 : 8,
        background: c.bg,
        color: c.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: large ? "1.4rem" : "1rem",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
}

export function MatchBadge({ pct, size }) {
  const isLow = pct < 85;
  return (
    <span
      style={{
        background: isLow ? "rgba(255,183,77,0.12)" : "rgba(0,212,170,0.12)",
        color: isLow ? "#FFB74D" : "#00D4AA",
        border: `1px solid ${isLow ? "rgba(255,183,77,0.3)" : "rgba(0,212,170,0.3)"}`,
        borderRadius: 12,
        padding: size === "lg" ? "6px 14px" : "3px 10px",
        fontSize: size === "lg" ? "0.85rem" : "0.72rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {pct}% {size === "lg" ? "AI match" : "match"}
    </span>
  );
}

export function SectionCard({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ children, extra }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: "0.85rem",
        color: "var(--color-text-1)",
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
      {extra}
    </div>
  );
}

export function AiTag() {
  return (
    <span
      style={{
        background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
        color: "white",
        borderRadius: 6,
        padding: "2px 6px",
        fontSize: "0.65rem",
        fontWeight: 700,
      }}
    >
      AI
    </span>
  );
}

export function PostBadge({ type, label }) {
  const colors = {
    mentor: { bg: "rgba(108,99,255,0.15)", color: "#6C63FF" },
    student: { bg: "rgba(0,212,170,0.15)", color: "#00D4AA" },
    company: { bg: "rgba(255,183,77,0.15)", color: "#FFB74D" },
  };
  const c = colors[type] || colors.mentor;
  return (
    <span
      style={{
        background: c.bg,
        color: c.color,
        borderRadius: 4,
        padding: "2px 7px",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.3px",
      }}
    >
      {label}
    </span>
  );
}

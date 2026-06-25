import { useState, useEffect } from "react";
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, SkillPill } from "../ui/index.jsx";
import { showToast } from "../ui/toast.js";
import { useIsMobile } from "../../hooks/useIsMobile.js";
import {
  getConnections,
  getPendingRequests,
  sendConnectionRequest,
  respondToRequest,
  listAlumni,
  listCompanies,
  listStudents,
  getMyMentorshipRequests,
  getMyMentees,
  getIncomingMentorshipRequests,
  sendMentorshipRequest,
  respondToMentorshipRequest,
  fetchUserProfile,
} from "../../api/network.js";

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?"
  );
}

function userToCard(u) {
  const p = u.profile || {};
  let meta = "";
  if (u.role === "student")
    meta = [p.course, p.university].filter(Boolean).join(" · ");
  if (u.role === "alumni")
    meta = [p.job_title, p.current_company].filter(Boolean).join(" · ");
  if (u.role === "company") meta = p.industry || "";
  const skills = p.skills || p.expertise || [];
  return {
    id: u.id,
    initials: getInitials(u.name),
    name: u.name,
    meta: meta || u.role,
    skills: skills.slice(0, 3),
    color: "primary",
    role: u.role,
    university: u.role === "student" ? p.university || "" : undefined,
  };
}

// Converts a full API user response to the shape OtherProfile expects
function apiUserToProfile(u) {
  const p = u.profile || {};
  const initials = getInitials(u.name);

  if (u.role === "alumni") {
    return {
      id: u.id,
      type: "mentor",
      initials,
      color: "primary",
      name: u.name,
      title:
        [p.job_title, p.current_company].filter(Boolean).join(" · ") ||
        "Alumni",
      bio: p.bio || "",
      location: p.location || "",
      connections: 0,
      endorsements: 0,
      skills: p.expertise || [],
      expertise: p.offerings || [],
      availability: p.availability || "",
      menteesCount: p.mentee_count || 0,
      projects: [],
      education: p.university
        ? {
            icon: "Building2",
            school: p.university,
            degree: "",
            years: p.graduation_year ? `Class of ${p.graduation_year}` : "",
          }
        : null,
      socials: [p.linkedin && "LinkedIn", p.github && "GitHub"].filter(Boolean),
    };
  }

  if (u.role === "student") {
    return {
      id: u.id,
      type: "student",
      initials,
      color: "accent",
      name: u.name,
      title: [p.course, p.university].filter(Boolean).join(" · ") || "Student",
      bio: p.bio || "",
      location: p.university || "",
      connections: 0,
      endorsements: 0,
      skills: p.skills || [],
      projects: [],
      education: p.university
        ? {
            icon: "GraduationCap",
            school: p.university,
            degree: p.course || "",
            years: p.year || "",
          }
        : null,
      socials: [p.linkedin && "LinkedIn", p.github && "GitHub"].filter(Boolean),
    };
  }

  // company
  const displayName = p.company_name || u.name;
  return {
    id: u.id,
    type: "company",
    initials: (displayName || "").slice(0, 2).toUpperCase(),
    color: "warn",
    name: displayName,
    title: p.industry || "Company",
    bio: p.description || "",
    location: p.location || "",
    connections: 0,
    endorsements: 0,
    skills: [],
    website: p.website || "",
    industry: p.industry || "",
    size: p.size || "",
    socials: [p.website && "Website"].filter(Boolean),
  };
}

// ── Person Card ────────────────────────────────────────────────────────────────

function PersonCard({
  person,
  isConnected,
  onConnect,
  statusLabel,
  onCardClick,
  onMentorshipRequest,
  mentorshipPending,
}) {
  const [status, setStatus] = useState(isConnected ? "connected" : "none");

  async function handleConnect(e) {
    e.stopPropagation();
    if (status !== "none" || statusLabel) return;
    setStatus("pending");
    try {
      await onConnect(person.id);
      showToast(`Connection request sent to ${person.name}!`);
    } catch (err) {
      showToast(err.message || "Could not send request", "error");
      setStatus("none");
    }
  }

  let btnText, extraBtnStyle;
  if (statusLabel) {
    btnText = statusLabel;
    extraBtnStyle = {
      background: "rgba(0,212,170,0.12)",
      color: "#00D4AA",
      border: "1.5px solid #00D4AA",
    };
  } else if (status === "connected") {
    btnText = "Connected ✓";
    extraBtnStyle = {
      background: "#6C63FF",
      color: "white",
      border: "1.5px solid #6C63FF",
    };
  } else if (status === "pending") {
    btnText = "Pending…";
    extraBtnStyle = {
      background: "rgba(108,99,255,0.12)",
      color: "#6C63FF",
      border: "1.5px solid #6C63FF",
      opacity: 0.7,
    };
  } else {
    btnText = "Connect";
    extraBtnStyle = {
      background: "rgba(108,99,255,0.12)",
      color: "#6C63FF",
      border: "1.5px solid #6C63FF",
    };
  }

  return (
    <div
      onClick={onCardClick ? () => onCardClick(person) : undefined}
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        textAlign: "center",
        cursor: onCardClick ? "pointer" : "default",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6C63FF";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,99,255,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Avatar initials={person.initials} color={person.color} size="lg" />
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.85rem",
          color: "var(--color-text-1)",
        }}
      >
        {person.name}
      </div>
      <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
        {person.meta}
      </div>
      {person.skills.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
            margin: "4px 0",
          }}
        >
          {person.skills.map((s) => (
            <SkillPill key={s} label={s} small />
          ))}
        </div>
      )}
      <button
        onClick={handleConnect}
        style={{
          ...extraBtnStyle,
          borderRadius: 20,
          padding: "4px 12px",
          fontSize: "0.75rem",
          fontWeight: 600,
          cursor: statusLabel || status !== "none" ? "default" : "pointer",
          transition: "all 0.2s",
          marginTop: 4,
        }}
      >
        {btnText}
      </button>
      {onMentorshipRequest && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMentorshipRequest(person);
          }}
          disabled={mentorshipPending}
          style={{
            background: "none",
            border: "none",
            color: mentorshipPending ? "var(--color-text-3)" : "#00D4AA",
            fontSize: "0.72rem",
            fontWeight: 500,
            cursor: mentorshipPending ? "default" : "pointer",
            textDecoration: mentorshipPending ? "none" : "underline",
            marginTop: 2,
            padding: 0,
          }}
        >
          {mentorshipPending ? "Request pending…" : "Request mentorship"}
        </button>
      )}
    </div>
  );
}

// ── Pending Request Row ────────────────────────────────────────────────────────

function PendingRow({ req, onAccept, onReject }) {
  const [responding, setResponding] = useState(false);

  async function respond(action) {
    setResponding(true);
    try {
      await respondToRequest(req.id, action);
      action === "accepted" ? onAccept(req.id) : onReject(req.id);
      showToast(
        action === "accepted" ? "Connection accepted!" : "Request declined",
      );
    } catch (err) {
      showToast(err.message || "Failed to respond", "error");
      setResponding(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 8,
      }}
    >
      <Avatar
        initials={getInitials(req.sender_name || "?")}
        color="primary"
        size="sm"
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "var(--color-text-1)",
          }}
        >
          {req.sender_name || "Someone"}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
          Wants to connect
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => respond("accepted")}
          disabled={responding}
          style={{
            background: "#6C63FF",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "6px 14px",
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Accept
        </button>
        <button
          onClick={() => respond("rejected")}
          disabled={responding}
          style={{
            background: "none",
            border: "1.5px solid var(--color-border)",
            color: "var(--color-text-2)",
            borderRadius: "var(--radius-sm)",
            padding: "6px 14px",
            fontSize: "0.78rem",
            cursor: "pointer",
          }}
        >
          Decline
        </button>
      </div>
    </div>
  );
}

// ── Mentorship Pending Row (for alumni) ───────────────────────────────────────

function MentorshipPendingRow({ req, onAccept, onReject }) {
  const [responding, setResponding] = useState(false);

  async function respond(action) {
    setResponding(true);
    try {
      await respondToMentorshipRequest(req.id, action);
      action === "accepted" ? onAccept(req) : onReject(req.id);
      showToast(
        action === "accepted"
          ? `You are now mentoring ${req.student_name}!`
          : "Mentorship request declined",
      );
    } catch (err) {
      showToast(err.message || "Failed to respond", "error");
      setResponding(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderLeft: "3px solid #00D4AA",
        borderRadius: "var(--radius-md)",
        padding: "14px 16px",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: req.message ? 10 : 0,
        }}
      >
        <Avatar
          initials={getInitials(req.student_name || "?")}
          color="accent"
          size="sm"
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.85rem",
              color: "var(--color-text-1)",
            }}
          >
            {req.student_name || "A student"}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
            Sent a mentorship request
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => respond("accepted")}
            disabled={responding}
            style={{
              background: "#00D4AA",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "6px 14px",
              fontSize: "0.78rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Accept
          </button>
          <button
            onClick={() => respond("rejected")}
            disabled={responding}
            style={{
              background: "none",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text-2)",
              borderRadius: "var(--radius-sm)",
              padding: "6px 14px",
              fontSize: "0.78rem",
              cursor: "pointer",
            }}
          >
            Decline
          </button>
        </div>
      </div>
      {req.message && (
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 12px",
            fontSize: "0.8rem",
            color: "var(--color-text-2)",
            lineHeight: 1.5,
            marginLeft: 44,
          }}
        >
          {req.message.replace(/^\[Mentorship Request\]\n\n/, "")}
        </div>
      )}
    </div>
  );
}

// ── People Grid ────────────────────────────────────────────────────────────────

function PeopleGrid({
  title,
  people,
  connectedIds,
  onConnect,
  statusLabel,
  onCardClick,
  onMentorshipRequest,
  mentorshipPendingIds,
}) {
  if (people.length === 0) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      {title && (
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "var(--color-text-2)",
            marginBottom: 16,
            letterSpacing: "0.2px",
          }}
        >
          {title}
        </h3>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {people.map((p) => (
          <PersonCard
            key={p.id}
            person={p}
            isConnected={connectedIds.has(p.id)}
            onConnect={onConnect}
            statusLabel={statusLabel}
            onCardClick={onCardClick}
            onMentorshipRequest={onMentorshipRequest}
            mentorshipPending={mentorshipPendingIds?.has(p.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ── University Group ───────────────────────────────────────────────────────────

function UniversityGroup({
  university,
  students,
  connectedIds,
  onConnect,
  onCardClick,
}) {
  const [expanded, setExpanded] = useState(true);
  const Icon = expanded ? ChevronDown : ChevronRight;

  return (
    <div style={{ marginBottom: 28 }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "6px 0",
          marginBottom: expanded ? 14 : 4,
          width: "100%",
          textAlign: "left",
        }}
      >
        <Icon
          size={16}
          style={{ color: "var(--color-text-3)", flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "var(--color-text-2)",
          }}
        >
          {university || "Other"}
        </span>
        <span
          style={{
            background: "var(--color-surface)",
            color: "var(--color-text-3)",
            borderRadius: 10,
            padding: "1px 7px",
            fontSize: "0.72rem",
            marginLeft: 4,
          }}
        >
          {students.length}
        </span>
      </button>
      {expanded && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {students.map((s) => (
            <PersonCard
              key={s.id}
              person={s}
              isConnected={connectedIds.has(s.id)}
              onConnect={onConnect}
              onCardClick={onCardClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Students Section (grouped by university) ───────────────────────────────────

function StudentsSection({ students, connectedIds, onConnect, onCardClick }) {
  if (students.length === 0) return <EmptyCircle category="Students" />;

  const grouped = {};
  students.forEach((s) => {
    const uni = s.university || "Other";
    if (!grouped[uni]) grouped[uni] = [];
    grouped[uni].push(s);
  });

  return (
    <div>
      {Object.keys(grouped)
        .sort()
        .map((uni) => (
          <UniversityGroup
            key={uni}
            university={uni}
            students={grouped[uni]}
            connectedIds={connectedIds}
            onConnect={onConnect}
            onCardClick={onCardClick}
          />
        ))}
    </div>
  );
}

// ── Mentorship Request Modal ───────────────────────────────────────────────────

function MentorshipRequestModal({ person, onClose, onSubmit }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit() {
    if (!message.trim() || sending) return;
    setSending(true);
    try {
      await onSubmit(person.id, message.trim());
      showToast(`Mentorship request sent to ${person.name}!`);
      onClose();
    } catch (err) {
      showToast(err.message || "Could not send request", "error");
      setSending(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="fade-in"
        style={{
          background: "var(--color-card)",
          borderRadius: "var(--radius-xl)",
          padding: 24,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Avatar initials={person.initials} color={person.color} size="md" />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--color-text-1)",
              }}
            >
              {person.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
              {person.meta}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-3)",
              display: "flex",
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.9rem",
              color: "var(--color-text-1)",
              marginBottom: 4,
            }}
          >
            Request Mentorship
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-text-3)" }}>
            Write a short message to {person.name.split(" ")[0]} explaining what
            you'd like to learn.
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Hi ${person.name.split(" ")[0]}, I'd love to learn from your experience in…`}
          autoFocus
          rows={5}
          style={{
            width: "100%",
            background: "var(--color-surface)",
            border: "1.5px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 14px",
            color: "var(--color-text-1)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            resize: "vertical",
            fontFamily: "var(--font-body)",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#00D4AA")}
          onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 16,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text-2)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 20px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            style={{
              background:
                message.trim() && !sending
                  ? "linear-gradient(135deg, #00D4AA, #6C63FF)"
                  : "var(--color-border)",
              color:
                message.trim() && !sending ? "white" : "var(--color-text-3)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "8px 24px",
              cursor: message.trim() && !sending ? "pointer" : "not-allowed",
              fontWeight: 600,
              fontSize: "0.85rem",
              transition: "opacity 0.2s",
            }}
          >
            {sending ? "Sending…" : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────

function EmptyCircle({ category, u }) {
  const config = {
    Connections: {
      emoji: "🤝",
      title: "No connections yet",
      desc: "Connect with students and follow alumni to build your network.",
    },
    Following: {
      emoji: "👀",
      title: "Not following anyone yet",
      desc: "Connect with alumni and companies to follow their activity.",
    },
    Mentors: {
      emoji: "🎓",
      title: "No mentors yet",
      desc: "Request mentorship from alumni on the Alumni tab.",
    },
    Mentees: {
      emoji: "🎓",
      title: "No mentees yet",
      desc: "Students who request and are accepted for mentorship will appear here.",
    },
    Alumni: {
      emoji: "🎓",
      title: "No alumni yet",
      desc: "Alumni will appear here as they join the platform.",
    },
    Students: {
      emoji: "📚",
      title: "No students yet",
      desc: "Students will appear here grouped by their university.",
    },
    Companies: {
      emoji: "🏢",
      title: "No companies yet",
      desc: "Companies will appear here as they join Hyia.",
    },
    Groups: {
      emoji: "👥",
      title: "No groups yet",
      desc: "Groups created by alumni and students are coming soon.",
    },
    Events: {
      emoji: "📅",
      title: "No events yet",
      desc: "Check back for upcoming meetups and events.",
    },
  };
  const { emoji, title, desc } = config[category] || {
    emoji: "🔍",
    title: `No ${category.toLowerCase()} yet`,
    desc: "Nothing here — check back soon.",
  };
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 14 }}>{emoji}</div>
      <div
        style={{
          fontWeight: 600,
          fontSize: "1rem",
          color: "var(--color-text-1)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "0.85rem", color: "var(--color-text-3)" }}>
        {desc}
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────

const STATIC_CATEGORIES = ["Groups", "Events"];

export default function CircleTab({ onViewProfile, currentUser }) {
  const [activeNav, setActiveNav] = useState("Connections");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [mentorshipPendingIds, setMentorshipPendingIds] = useState(new Set());
  const [mentorshipModal, setMentorshipModal] = useState(null);
  const [incomingMentorshipReqs, setIncomingMentorshipReqs] = useState([]);

  const isMobile = useIsMobile(900);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const isAlumni = currentUser?.role === "alumni";
        const [conns, pend, alum, comps, studs, mentorReqs, incomingReqs, menteeReqs] =
          await Promise.all([
            getConnections().catch(() => []),
            getPendingRequests().catch(() => []),
            listAlumni().catch(() => []),
            listCompanies().catch(() => []),
            listStudents().catch(() => []),
            isAlumni ? Promise.resolve([]) : getMyMentorshipRequests().catch(() => []),
            isAlumni
              ? getIncomingMentorshipRequests().catch(() => [])
              : Promise.resolve([]),
            isAlumni ? getMyMentees().catch(() => []) : Promise.resolve([]),
          ]);
        const alumCards = alum.map(userToCard);
        const studCards = studs.map(userToCard);
        const acceptedAlumniIds = new Set(
          mentorReqs
            .filter((r) => r.status === "accepted")
            .map((r) => r.alumni_id),
        );
        const pendingAlumniIds = new Set(
          mentorReqs
            .filter((r) => r.status === "pending")
            .map((r) => r.alumni_id),
        );
        const menteeIds = new Set(menteeReqs.map((r) => r.student_id));
        setConnections(conns.map(userToCard));
        setPending(pend);
        setAlumni(alumCards);
        setCompanies(comps.map(userToCard));
        setStudents(studCards);
        setMentors(alumCards.filter((a) => acceptedAlumniIds.has(a.id)));
        setMentees(studCards.filter((s) => menteeIds.has(s.id)));
        setMentorshipPendingIds(pendingAlumniIds);
        setIncomingMentorshipReqs(incomingReqs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const connectedIds = new Set(connections.map((c) => c.id));

  // Connections = all accepted connections (students I connected + alumni I follow)
  const myConnections = connections;
  // Following = alumni + companies I'm connected with
  const following = connections.filter(
    (c) => c.role === "alumni" || c.role === "company",
  );

  const isAlumniUser = currentUser?.role === "alumni";

  const PEOPLE_BY_CATEGORY = {
    Connections: myConnections,
    Following: following,
    ...(isAlumniUser ? { Mentees: mentees } : { Mentors: mentors }),
    Alumni: alumni,
    Students: students,
    Companies: companies,
    Groups: [],
    Events: [],
  };

  const NAV_ITEMS = [
    {
      label: "Connections",
      count: myConnections.length,
      badge: incomingMentorshipReqs.length + pending.length || 0,
    },
    { label: "Following", count: following.length },
    isAlumniUser
      ? { label: "Mentees", count: mentees.length }
      : { label: "Mentors", count: mentors.length },
    { label: "Alumni", count: alumni.length },
    { label: "Students", count: students.length },
    { label: "Companies", count: companies.length },
    { label: "Groups", count: 0 },
    { label: "Events", count: 0 },
  ];

  const SECTION_LABEL = {
    Connections: null,
    Following: "Alumni & companies you follow",
    Mentors: "Your mentors",
    Mentees: "Your active mentees",
    Alumni: "Alumni on Hyia",
    Students: null,
    Companies: "Companies on Hyia",
    Groups: null,
    Events: null,
  };

  const isStatic = STATIC_CATEGORIES.includes(activeNav);
  const people = PEOPLE_BY_CATEGORY[activeNav] || [];
  const sectionLabel = SECTION_LABEL[activeNav];

  const displayPeople = search
    ? people.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.meta.toLowerCase().includes(search.toLowerCase()) ||
          p.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())),
      )
    : people;

  async function handleConnect(userId) {
    await sendConnectionRequest(userId);
  }

  function acceptIncomingMentorship(req) {
    setIncomingMentorshipReqs((prev) => prev.filter((r) => r.id !== req.id));
    // Move the student into the connections-like list (they can now message)
  }

  function rejectIncomingMentorship(reqId) {
    setIncomingMentorshipReqs((prev) => prev.filter((r) => r.id !== reqId));
  }

  async function handleMentorshipRequest(alumniId, message) {
    await sendMentorshipRequest(alumniId, message);
    setMentorshipPendingIds((prev) => new Set([...prev, alumniId]));
  }

  async function handleViewProfile(person) {
    if (!onViewProfile) return;
    try {
      const fullUser = await fetchUserProfile(person.id, person.role);
      onViewProfile(apiUserToProfile(fullUser));
    } catch {
      showToast("Could not load profile", "error");
    }
  }

  function acceptPending(reqId) {
    setPending((prev) => prev.filter((r) => r.id !== reqId));
  }

  function rejectPending(reqId) {
    setPending((prev) => prev.filter((r) => r.id !== reqId));
  }

  function changeCategory(cat) {
    setActiveNav(cat);
    setSearch("");
  }

  const SearchBar = () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--color-card)",
        border: "1.5px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        padding: "8px 14px",
        marginBottom: 20,
        transition: "border-color 0.15s",
      }}
    >
      <Search
        size={16}
        style={{ color: "var(--color-text-3)", flexShrink: 0 }}
      />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${activeNav.toLowerCase()} by name, role, or skill…`}
        style={{
          flex: 1,
          background: "none",
          border: "none",
          outline: "none",
          color: "var(--color-text-1)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-body)",
        }}
      />
      {search && (
        <button
          onClick={() => setSearch("")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-3)",
            display: "flex",
            padding: 0,
          }}
        >
          <X size={15} />
        </button>
      )}
    </div>
  );

  const NavSidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          onClick={() => changeCategory(item.label)}
          style={{
            background:
              activeNav === item.label ? "rgba(108,99,255,0.12)" : "none",
            border: "none",
            color: activeNav === item.label ? "#6C63FF" : "var(--color-text-2)",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontSize: "0.85rem",
            textAlign: "left",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontWeight: activeNav === item.label ? 600 : 400,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (activeNav !== item.label) {
              e.currentTarget.style.background = "var(--color-surface)";
              e.currentTarget.style.color = "var(--color-text-1)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeNav !== item.label) {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "var(--color-text-2)";
            }
          }}
        >
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.badge > 0 && (
            <span
              style={{
                background: "#FF6B6B",
                color: "white",
                borderRadius: 99,
                padding: "1px 6px",
                fontSize: "0.68rem",
                fontWeight: 700,
                marginRight: 4,
              }}
            >
              {item.badge}
            </span>
          )}
          <span
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text-3)",
              borderRadius: 10,
              padding: "1px 7px",
              fontSize: "0.72rem",
            }}
          >
            {loading && item.count === 0 ? "…" : item.count}
          </span>
        </button>
      ))}
    </div>
  );

  const ContentArea = () => {
    if (loading) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--color-text-3)",
          }}
        >
          Loading…
        </div>
      );
    }

    if (isStatic) return <EmptyCircle category={activeNav} />;

    // Students rendered with university grouping
    if (activeNav === "Students") {
      const filteredStudents = search
        ? students.filter(
            (s) =>
              s.name.toLowerCase().includes(search.toLowerCase()) ||
              s.meta.toLowerCase().includes(search.toLowerCase()) ||
              s.skills.some((sk) =>
                sk.toLowerCase().includes(search.toLowerCase()),
              ),
          )
        : students;
      return (
        <StudentsSection
          students={filteredStudents}
          connectedIds={connectedIds}
          onConnect={handleConnect}
          onCardClick={handleViewProfile}
        />
      );
    }

    const showPending = activeNav === "Connections" && pending.length > 0;
    const showIncomingMentorship =
      activeNav === "Connections" && incomingMentorshipReqs.length > 0;

    return (
      <>
        {showIncomingMentorship && (
          <div style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--color-text-2)",
                marginBottom: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Mentorship Requests
              <span
                style={{
                  background: "#00D4AA",
                  color: "white",
                  borderRadius: 99,
                  padding: "1px 8px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {incomingMentorshipReqs.length}
              </span>
            </h3>
            {incomingMentorshipReqs.map((req) => (
              <MentorshipPendingRow
                key={req.id}
                req={req}
                onAccept={acceptIncomingMentorship}
                onReject={rejectIncomingMentorship}
              />
            ))}
          </div>
        )}

        {showPending && (
          <div style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--color-text-2)",
                marginBottom: 14,
              }}
            >
              Connection Requests ({pending.length})
            </h3>
            {pending.map((req) => (
              <PendingRow
                key={req.id}
                req={req}
                onAccept={acceptPending}
                onReject={rejectPending}
              />
            ))}
          </div>
        )}

        {people.length === 0 ? (
          <EmptyCircle category={activeNav} />
        ) : displayPeople.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: 12 }}>🔍</div>
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "var(--color-text-1)",
                marginBottom: 6,
              }}
            >
              No results for "{search}"
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}>
              Try a different name, role, or skill.
            </div>
          </div>
        ) : (
          <PeopleGrid
            title={sectionLabel}
            people={displayPeople}
            connectedIds={connectedIds}
            onConnect={handleConnect}
            statusLabel={
              activeNav === "Mentors"
                ? "Your Mentor ✓"
                : activeNav === "Mentees"
                  ? "Your Mentee ✓"
                  : undefined
            }
            onCardClick={handleViewProfile}
            onMentorshipRequest={
              activeNav === "Alumni"
                ? (person) => setMentorshipModal(person)
                : undefined
            }
            mentorshipPendingIds={
              activeNav === "Alumni" ? mentorshipPendingIds : undefined
            }
          />
        )}
      </>
    );
  };

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div style={{ padding: "16px 16px 24px" }}>
          <NavSidebar />
          {!isStatic && (activeNav !== "Students" || students.length > 0) && (
            <div style={{ marginTop: 16 }}>
              <SearchBar />
            </div>
          )}
          <ContentArea />
        </div>
        {mentorshipModal && (
          <MentorshipRequestModal
            person={mentorshipModal}
            onClose={() => setMentorshipModal(null)}
            onSubmit={handleMentorshipRequest}
          />
        )}
      </div>
    );
  }

  return (
    <div
      style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "var(--color-text-1)",
          }}
        >
          My Circle
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 220px",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div>
          {!isStatic && (people.length > 0 || activeNav === "Students") && (
            <SearchBar />
          )}
          <ContentArea />
        </div>
        <NavSidebar />
      </div>

      {mentorshipModal && (
        <MentorshipRequestModal
          person={mentorshipModal}
          onClose={() => setMentorshipModal(null)}
          onSubmit={handleMentorshipRequest}
        />
      )}
    </div>
  );
}

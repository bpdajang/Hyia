import React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Users,
  GraduationCap,
  Building2,
  Heart,
  CreditCard,
  Bot,
  Leaf,
  BarChart2,
  Palette,
  Link2,
  BookOpen,
  TrendingUp,
  Pill,
  Stethoscope,
  Globe,
  Cloud,
  Smartphone,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { Avatar, SkillTag, SkillPill } from "../ui/index.jsx";

const PROJECT_ICON_MAP = {
  CreditCard,
  Bot,
  Leaf,
  BarChart2,
  Palette,
  Link2,
  BookOpen,
  TrendingUp,
  Pill,
  Stethoscope,
  Globe,
  Cloud,
  Smartphone,
  ShoppingCart,
  Activity,
  Building2,
  GraduationCap,
};

const DEFAULT_SKILLS = [
  "Python",
  "React",
  "UI/UX Design",
  "Machine Learning",
  "Flutter",
  "Firebase",
];

const PROJECTS = [
  {
    icon: "Smartphone",
    name: "Rural Health App",
    desc: "Mobile health app for rural communities using Flutter & Firebase. 2,000+ active users in Northern Ghana.",
    stack: ["Flutter", "Firebase", "Python"],
  },
  {
    icon: "Activity",
    name: "Smart Farm Monitor",
    desc: "IoT dashboard for small-scale farmers to monitor soil moisture and crop health remotely.",
    stack: ["React", "Node.js", "IoT"],
  },
];

const MENTORS = [
  {
    id: "emmanuel-osei",
    initials: "EO",
    name: "Emmanuel Osei",
    title: "Sr. Engineer · Andela",
    color: "primary",
  },
  {
    id: "dr-kwame-asante",
    initials: "KA",
    name: "Dr. Kwame Asante",
    title: "ML Lead · Google",
    color: "accent",
  },
];

// ---- Edit Profile Modal ----
function EditProfileModal({ currentUser, onSave, onClose }) {
  const [name, setName] = useState(currentUser.name || "");
  const [title, setTitle] = useState(currentUser.title || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [university, setUniversity] = useState(currentUser.university || "");
  const [course, setCourse] = useState(currentUser.course || "");
  const [year, setYear] = useState(currentUser.year || "");
  const [skills, setSkills] = useState(
    currentUser.skills?.length > 0 ? [...currentUser.skills] : [],
  );
  const [skillInput, setSkillInput] = useState("");

  function addSkill(s) {
    const val = s.trim();
    if (val && !skills.includes(val)) setSkills((prev) => [...prev, val]);
    setSkillInput("");
  }

  function removeSkill(s) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  function handleSkillKey(e) {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      addSkill(skillInput);
    }
  }

  function save() {
    const initials =
      name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";
    onSave({ name, title, bio, university, course, year, skills, initials });
    onClose();
  }

  const inputStyle = {
    width: "100%",
    background: "var(--color-surface)",
    border: "1.5px solid var(--color-border)",
    borderRadius: "var(--radius-md)",
    padding: "10px 14px",
    color: "var(--color-text-1)",
    fontSize: "0.9rem",
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.78rem",
    fontWeight: 500,
    color: "var(--color-text-2)",
    marginBottom: 6,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: 32,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1.25rem",
              color: "var(--color-text-1)",
            }}
          >
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-text-3)",
              cursor: "pointer",
              fontSize: "1.2rem",
              lineHeight: 1,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title / Role</label>
            <input
              style={inputStyle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. IT Student · KNUST Year 2"
            />
          </div>

          {/* Bio */}
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people about yourself…"
            />
          </div>

          {/* Skills */}
          <div>
            <label style={labelStyle}>Skills</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {skills.map((s) => (
                <span
                  key={s}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(108,99,255,0.15)",
                    color: "#6C63FF",
                    border: "1px solid rgba(108,99,255,0.3)",
                    borderRadius: 20,
                    padding: "4px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                  }}
                >
                  {s}
                  <button
                    onClick={() => removeSkill(s)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6C63FF",
                      cursor: "pointer",
                      padding: 0,
                      lineHeight: 1,
                      fontSize: "0.8rem",
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              style={{ ...inputStyle, marginTop: 4 }}
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKey}
              placeholder="Type a skill and press Enter…"
            />
            {/* Quick-add suggestions */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginTop: 8,
              }}
            >
              {DEFAULT_SKILLS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  onClick={() => addSkill(s)}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-2)",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Education row */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>University</label>
              <input
                style={inputStyle}
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. KNUST, UG, UCC"
              />
            </div>
            <div>
              <label style={labelStyle}>Course / Programme</label>
              <input
                style={inputStyle}
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. BSc Computer Science"
              />
            </div>
            <div>
              <label style={labelStyle}>Year of Study</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">— select —</option>
                {[
                  "Year 1",
                  "Year 2",
                  "Year 3",
                  "Year 4",
                  "Year 5",
                  "Year 6",
                ].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 28,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: "var(--color-text-2)",
              border: "1.5px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 20px",
              fontFamily: "var(--font-display)",
              fontWeight: 500,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={save}
            style={{
              background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 24px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- My Profile ----
export function MyProfile({ onViewProfile, currentUser = {}, onUpdateUser }) {
  const [editing, setEditing] = useState(false);
  const displaySkills =
    currentUser.skills?.length > 0 ? currentUser.skills : [];

  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      {editing && (
        <EditProfileModal
          currentUser={currentUser}
          onSave={onUpdateUser}
          onClose={() => setEditing(false)}
        />
      )}

      {/* Hero */}
      <div
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: 120,
            background:
              "linear-gradient(135deg, rgba(108,99,255,0.38), rgba(0,212,170,0.25))",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            padding: "0 28px 28px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              marginTop: -45,
              border: "4px solid var(--color-card)",
              borderRadius: "50%",
              display: "inline-block",
              flexShrink: 0,
            }}
          >
            <Avatar
              initials={currentUser.initials || "U"}
              color="primary"
              size="xl"
            />
          </div>
          <div style={{ flex: 1, minWidth: 0, paddingTop: 12 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "var(--color-text-1)",
                marginBottom: 4,
              }}
            >
              {currentUser.name || "User"}
            </h1>
            <div
              style={{
                color: "#00D4AA",
                fontWeight: 500,
                fontSize: "0.875rem",
                marginBottom: 8,
              }}
            >
              {currentUser.title || ""}
            </div>
            <p
              style={{
                color: "var(--color-text-2)",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                marginBottom: 12,
                maxWidth: 480,
              }}
            >
              {currentUser.bio || ""}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["LinkedIn", "GitHub"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-2)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6C63FF";
                    e.currentTarget.style.color = "#6C63FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-2)";
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <button
            onClick={() => setEditing(true)}
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
              marginTop: 12,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <ProfileSection title="Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {displaySkills.length > 0 ? (
                displaySkills.map((s) => <SkillTag key={s} label={s} active />)
              ) : (
                <span
                  style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}
                >
                  No skills added yet — click Edit Profile to add some.
                </span>
              )}
            </div>
          </ProfileSection>

          <ProfileSection title="Projects">
            <ProjectList projects={PROJECTS} />
          </ProfileSection>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(currentUser.university || currentUser.course) && (
            <ProfileSection title="Education">
              <div
                style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
              >
                <Building2
                  size={22}
                  style={{
                    color: "var(--color-text-3)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--color-text-1)",
                    }}
                  >
                    {currentUser.university}
                  </div>
                  {currentUser.course && (
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--color-text-2)",
                      }}
                    >
                      {currentUser.course}
                    </div>
                  )}
                  {currentUser.year && (
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-3)",
                      }}
                    >
                      {currentUser.year}
                    </div>
                  )}
                </div>
              </div>
            </ProfileSection>
          )}

          <ProfileSection title="Mentor Connections">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MENTORS.map((m) => (
                <div
                  key={m.name}
                  onClick={() => onViewProfile && onViewProfile(m.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    borderRadius: "var(--radius-sm)",
                    padding: "4px 6px",
                    margin: "-4px -6px",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-surface)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <Avatar initials={m.initials} color={m.color} size="xs" />
                  <div>
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: "0.83rem",
                        color: "var(--color-text-1)",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-3)",
                      }}
                    >
                      {m.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}

// ---- Other User Profile ----
export function OtherProfile({ profile, onBack }) {
  const [connected, setConnected] = useState(false);
  const [following, setFollowing] = useState(false);
  const [mentorRequested, setMentorRequested] = useState(false);

  const isCompany = profile.type === "company";
  const isMentor = profile.type === "mentor";

  const bannerGradient = isCompany
    ? "linear-gradient(135deg, rgba(255,183,77,0.3), rgba(108,99,255,0.2))"
    : isMentor
      ? "linear-gradient(135deg, rgba(108,99,255,0.38), rgba(0,212,170,0.22))"
      : "linear-gradient(135deg, rgba(0,212,170,0.25), rgba(108,99,255,0.2))";

  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          color: "var(--color-text-3)",
          cursor: "pointer",
          fontSize: "0.85rem",
          marginBottom: 16,
          padding: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--color-text-1)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--color-text-3)")
        }
      >
        <ArrowLeft size={16} /> Back
      </button>

      {/* Hero card */}
      <div
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div style={{ height: 120, background: bannerGradient }} />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            padding: "0 28px 28px",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              marginTop: -45,
              border: "4px solid var(--color-card)",
              borderRadius: "50%",
              display: "inline-block",
              flexShrink: 0,
            }}
          >
            <Avatar
              initials={profile.initials}
              color={profile.color}
              size="xl"
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 4,
              }}
            >
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  color: "var(--color-text-1)",
                }}
              >
                {profile.name}
              </h1>
              {isMentor && (
                <span
                  style={{
                    background: "rgba(0,212,170,0.15)",
                    color: "#00D4AA",
                    border: "1px solid #00D4AA",
                    borderRadius: 20,
                    padding: "2px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  Mentor
                </span>
              )}
              {isCompany && (
                <span
                  style={{
                    background: "rgba(255,183,77,0.15)",
                    color: "#FFB74D",
                    border: "1px solid #FFB74D",
                    borderRadius: 20,
                    padding: "2px 10px",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                  }}
                >
                  Company
                </span>
              )}
            </div>

            <div
              style={{
                color: "var(--color-text-2)",
                fontSize: "0.875rem",
                marginBottom: 8,
              }}
            >
              {profile.title || profile.industry}
            </div>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                fontSize: "0.78rem",
                color: "var(--color-text-3)",
                marginBottom: 10,
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <MapPin size={13} /> {profile.location}
              </span>
              {isCompany ? (
                <>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Users size={13} /> {profile.size}
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Building2 size={13} /> Founded {profile.founded}
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Heart size={13} /> {profile.followers?.toLocaleString()}{" "}
                    followers
                  </span>
                </>
              ) : (
                <>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Users size={13} /> {profile.connections?.toLocaleString()}{" "}
                    connections
                  </span>
                  {profile.mutualConnections > 0 && (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Users size={13} /> {profile.mutualConnections} mutual
                    </span>
                  )}
                  {isMentor && (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <GraduationCap size={13} /> {profile.menteesCount} mentees
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Mentor availability badge */}
            {isMentor && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(0,212,170,0.1)",
                  border: "1px solid rgba(0,212,170,0.3)",
                  borderRadius: "var(--radius-sm)",
                  padding: "5px 12px",
                  fontSize: "0.78rem",
                  color: "#00D4AA",
                  fontWeight: 500,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#00D4AA",
                    display: "inline-block",
                  }}
                />
                {profile.availability}
              </div>
            )}

            <p
              style={{
                color: "var(--color-text-2)",
                fontSize: "0.875rem",
                lineHeight: 1.5,
                maxWidth: 480,
                marginBottom: 14,
              }}
            >
              {profile.bio}
            </p>

            {/* Socials */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(profile.socials || []).map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text-2)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    fontSize: "0.75rem",
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6C63FF";
                    e.currentTarget.style.color = "#6C63FF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.color = "var(--color-text-2)";
                  }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              paddingTop: 12,
              flexWrap: "wrap",
              alignItems: "flex-start",
            }}
          >
            {isMentor && (
              <button
                onClick={() => setMentorRequested((r) => !r)}
                style={{
                  background: mentorRequested
                    ? "rgba(0,212,170,0.15)"
                    : "linear-gradient(135deg, #7B73FF, #00D4AA)",
                  color: mentorRequested ? "#00D4AA" : "white",
                  border: mentorRequested ? "1.5px solid #00D4AA" : "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 20px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {mentorRequested ? "Requested ✓" : "Request Mentorship"}
              </button>
            )}
            {isCompany ? (
              <button
                onClick={() => setFollowing((f) => !f)}
                style={{
                  background: following ? "#6C63FF" : "rgba(108,99,255,0.15)",
                  color: following ? "white" : "#6C63FF",
                  border: "1.5px solid #6C63FF",
                  borderRadius: 20,
                  padding: "9px 22px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {following ? "Following ✓" : "+ Follow"}
              </button>
            ) : (
              <button
                onClick={() => setConnected((c) => !c)}
                style={{
                  background: connected ? "#6C63FF" : "rgba(108,99,255,0.15)",
                  color: connected ? "white" : "#6C63FF",
                  border: "1.5px solid #6C63FF",
                  borderRadius: 20,
                  padding: "9px 22px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {connected ? "Connected ✓" : "+ Connect"}
              </button>
            )}
            <button
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-1)",
                borderRadius: "var(--radius-sm)",
                padding: "9px 20px",
                fontWeight: 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#6C63FF";
                e.currentTarget.style.color = "#6C63FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.color = "var(--color-text-1)";
              }}
            >
              Message
            </button>
          </div>
        </div>
      </div>

      {/* Body content */}
      {isCompany ? (
        <CompanyBody profile={profile} />
      ) : isMentor ? (
        <MentorBody profile={profile} />
      ) : (
        <PeerBody profile={profile} />
      )}
    </div>
  );
}

// ---- Peer / Alumni body ----
function PeerBody({ profile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProfileSection title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.skills || []).map((s) => (
              <SkillTag key={s} label={s} active />
            ))}
          </div>
        </ProfileSection>

        {profile.projects?.length > 0 && (
          <ProfileSection title="Projects">
            <ProjectList projects={profile.projects} />
          </ProfileSection>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {profile.education && (
          <ProfileSection title="Education">
            <EducationBlock edu={profile.education} />
          </ProfileSection>
        )}

        {profile.mutualConnections > 0 && (
          <ProfileSection title="Mutual Connections">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: "var(--color-text-2)",
                fontSize: "0.85rem",
              }}
            >
              <Users
                size={22}
                style={{ color: "var(--color-text-3)", flexShrink: 0 }}
              />
              <span>
                You and {profile.name.split(" ")[0]} have{" "}
                <strong style={{ color: "var(--color-text-1)" }}>
                  {profile.mutualConnections} mutual connections
                </strong>{" "}
                on Hyia.
              </span>
            </div>
          </ProfileSection>
        )}
      </div>
    </div>
  );
}

// ---- Mentor body ----
function MentorBody({ profile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProfileSection title="Skills">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.skills || []).map((s) => (
              <SkillTag key={s} label={s} active />
            ))}
          </div>
        </ProfileSection>

        <ProfileSection title="Areas of Expertise">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(profile.expertise || []).map((e) => (
              <span
                key={e}
                style={{
                  background: "rgba(108,99,255,0.12)",
                  color: "#6C63FF",
                  border: "1px solid rgba(108,99,255,0.25)",
                  borderRadius: "var(--radius-sm)",
                  padding: "5px 12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                {e}
              </span>
            ))}
          </div>
        </ProfileSection>

        {profile.projects?.length > 0 && (
          <ProfileSection title="Projects">
            <ProjectList projects={profile.projects} />
          </ProfileSection>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {profile.education && (
          <ProfileSection title="Education">
            <EducationBlock edu={profile.education} />
          </ProfileSection>
        )}

        <ProfileSection title="Mentorship Stats">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <StatRow label="Mentees guided" value={profile.menteesCount} />
            <StatRow label="Mentoring since" value={profile.mentorsSince} />
            <StatRow label="Endorsements" value={profile.endorsements} />
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}

// ---- Company body ----
function CompanyBody({ profile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProfileSection title="Open Roles">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {(profile.openRoles || []).map((role) => (
              <div
                key={role.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--color-text-1)",
                      marginBottom: 6,
                    }}
                  >
                    {role.title}
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {role.tags.map((t) => (
                      <SkillPill key={t} label={t} small />
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-3)",
                    }}
                  >
                    {role.deadline}
                  </span>
                  <button
                    style={{
                      background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      padding: "7px 16px",
                      fontWeight: 600,
                      fontSize: "0.78rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ProfileSection>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProfileSection title="About">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <StatRow label="Industry" value={profile.industry} />
            <StatRow label="Size" value={profile.size} />
            <StatRow label="Founded" value={profile.founded} />
            <StatRow
              label="Followers"
              value={profile.followers?.toLocaleString()}
            />
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}

// ---- Shared helpers ----
function ProjectList({ projects }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {projects.map((p) => {
        const PIcon = PROJECT_ICON_MAP[p.icon];
        return (
          <div key={p.name} style={{ display: "flex", gap: 14 }}>
            <div style={{ color: "#6C63FF", flexShrink: 0, marginTop: 2 }}>
              {PIcon && <PIcon size={22} />}
            </div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "var(--color-text-1)",
                  marginBottom: 4,
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--color-text-2)",
                  lineHeight: 1.5,
                  marginBottom: 8,
                }}
              >
                {p.desc}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {p.stack.map((s) => (
                  <SkillPill key={s} label={s} small />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EducationBlock({ edu }) {
  const EduIcon = PROJECT_ICON_MAP[edu.icon] || Building2;
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <EduIcon
        size={22}
        style={{ color: "var(--color-text-3)", flexShrink: 0, marginTop: 2 }}
      />
      <div>
        <div
          style={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "var(--color-text-1)",
          }}
        >
          {edu.school}
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--color-text-2)" }}>
          {edu.degree}
        </div>
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-3)" }}>
          {edu.years}
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <span style={{ fontSize: "0.8rem", color: "var(--color-text-3)" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "var(--color-text-1)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function ProfileSection({ title, children }) {
  return (
    <div
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: 20,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "var(--color-text-1)",
          marginBottom: 14,
          paddingBottom: 10,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

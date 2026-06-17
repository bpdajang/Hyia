import React from "react";
import { useState, useRef } from "react";
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
  Camera,
  Briefcase,
  ExternalLink,
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

const MENTOR_OFFERINGS_LIST = [
  "Career Guidance",
  "Resume Review",
  "Mock Interviews",
  "Project Feedback",
  "Industry Insights",
  "Networking",
];

const ALUMNI_AVAIL_OPTIONS = [
  "1–2 hrs / week",
  "3–5 hrs / week",
  "On request only",
  "Not available right now",
];

// ---- Edit Profile Modal (Student) ----
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

// ---- Alumni Edit Modal ----
function AlumniEditModal({ currentUser, onSave, onClose }) {
  const [name, setName] = useState(currentUser.name || "");
  const [bio, setBio] = useState(currentUser.bio || "");
  const [jobTitle, setJobTitle] = useState(currentUser.jobTitle || "");
  const [company, setCompany] = useState(currentUser.company || "");
  const [linkedin, setLinkedin] = useState(currentUser.linkedin || "");
  const [university, setUniversity] = useState(currentUser.university || "");
  const [gradYear, setGradYear] = useState(currentUser.gradYear || "");
  const [expertise, setExpertise] = useState([...(currentUser.expertise || [])]);
  const [expertiseInput, setExpertiseInput] = useState("");
  const [availability, setAvailability] = useState(
    currentUser.availability || "1–2 hrs / week"
  );
  const [menteeCapacity, setMenteeCapacity] = useState(
    currentUser.menteeCapacity ?? 3
  );
  const [offerings, setOfferings] = useState([...(currentUser.offerings || [])]);

  const YEARS = Array.from({ length: 45 }, (_, i) => 2030 - i);

  function addExpertise(val) {
    const t = val.trim();
    if (t && !expertise.includes(t)) setExpertise((p) => [...p, t]);
    setExpertiseInput("");
  }

  function removeExpertise(val) {
    setExpertise((p) => p.filter((x) => x !== val));
  }

  function toggleOffering(o) {
    setOfferings((p) =>
      p.includes(o) ? p.filter((x) => x !== o) : [...p, o]
    );
  }

  function save() {
    const initials =
      name
        .trim()
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "A";
    const title =
      [jobTitle, company].filter(Boolean).join(" · ") || "Alumni";
    onSave({
      name,
      title,
      bio,
      jobTitle,
      company,
      linkedin,
      university,
      gradYear,
      expertise,
      availability,
      menteeCapacity,
      offerings,
      initials,
      role: "alumni",
    });
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

  const lbl = {
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
          <div>
            <label style={lbl}>Full Name</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label style={lbl}>Bio</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your journey and what inspires you to mentor…"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Current Job Title</label>
              <input
                style={inputStyle}
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Engineer"
              />
            </div>
            <div>
              <label style={lbl}>Company / Organisation</label>
              <input
                style={inputStyle}
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, MTN"
              />
            </div>
          </div>

          <div>
            <label style={lbl}>
              LinkedIn URL{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <input
              style={inputStyle}
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/your-name"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>University Attended</label>
              <input
                style={inputStyle}
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. KNUST, UG"
              />
            </div>
            <div>
              <label style={lbl}>Graduation Year</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
              >
                <option value="">— select —</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={lbl}>Areas of Expertise</label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {expertise.map((e) => (
                <span
                  key={e}
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
                  {e}
                  <button
                    onClick={() => removeExpertise(e)}
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
              value={expertiseInput}
              onChange={(e) => setExpertiseInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && expertiseInput.trim()) {
                  e.preventDefault();
                  addExpertise(expertiseInput);
                }
              }}
              placeholder="Type an area and press Enter…"
            />
          </div>

          <div>
            <label style={lbl}>What You Can Offer</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {MENTOR_OFFERINGS_LIST.map((o) => (
                <button
                  key={o}
                  onClick={() => toggleOffering(o)}
                  style={{
                    background: offerings.includes(o)
                      ? "rgba(108,99,255,0.15)"
                      : "var(--color-surface)",
                    border: `1.5px solid ${offerings.includes(o) ? "#6C63FF" : "var(--color-border)"}`,
                    color: offerings.includes(o)
                      ? "#6C63FF"
                      : "var(--color-text-2)",
                    borderRadius: 20,
                    padding: "5px 12px",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Availability</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                {ALUMNI_AVAIL_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Max Mentees</label>
              <input
                style={inputStyle}
                type="number"
                min={1}
                max={20}
                value={menteeCapacity}
                onChange={(e) =>
                  setMenteeCapacity(
                    Math.max(1, Math.min(20, Number(e.target.value)))
                  )
                }
              />
            </div>
          </div>
        </div>

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

// ---- Alumni About Tab ----
function AlumniAboutTab({ user }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProfileSection title="About">
          <p
            style={{
              color: "var(--color-text-2)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {user.bio ? (
              user.bio
            ) : (
              <span style={{ color: "var(--color-text-3)" }}>
                No bio yet — click Edit Profile to add one.
              </span>
            )}
          </p>
        </ProfileSection>

        <ProfileSection title="Areas of Expertise">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(user.expertise || []).length > 0 ? (
              (user.expertise || []).map((e) => (
                <SkillTag key={e} label={e} active />
              ))
            ) : (
              <span
                style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}
              >
                No expertise added yet.
              </span>
            )}
          </div>
        </ProfileSection>

        {(user.offerings || []).length > 0 && (
          <ProfileSection title="What I Offer">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(user.offerings || []).map((o) => (
                <span
                  key={o}
                  style={{
                    background: "rgba(0,212,170,0.12)",
                    color: "#00D4AA",
                    border: "1px solid rgba(0,212,170,0.3)",
                    borderRadius: 20,
                    padding: "5px 14px",
                    fontSize: "0.8rem",
                    fontWeight: 500,
                  }}
                >
                  {o}
                </span>
              ))}
            </div>
          </ProfileSection>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(user.jobTitle || user.company) && (
          <ProfileSection title="Experience">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Briefcase
                size={20}
                style={{
                  color: "var(--color-text-3)",
                  flexShrink: 0,
                  marginTop: 2,
                }}
              />
              <div>
                {user.jobTitle && (
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "var(--color-text-1)",
                    }}
                  >
                    {user.jobTitle}
                  </div>
                )}
                {user.company && (
                  <div
                    style={{ fontSize: "0.8rem", color: "var(--color-text-2)" }}
                  >
                    {user.company}
                  </div>
                )}
                {user.linkedin && (
                  <a
                    href={user.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 6,
                      fontSize: "0.78rem",
                      color: "#6C63FF",
                      textDecoration: "none",
                    }}
                  >
                    <ExternalLink size={11} /> LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          </ProfileSection>
        )}

        {(user.university || user.gradYear) && (
          <ProfileSection title="Education">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <GraduationCap
                size={20}
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
                  {user.university}
                </div>
                {user.gradYear && (
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--color-text-3)",
                      marginTop: 2,
                    }}
                  >
                    Class of {user.gradYear}
                  </div>
                )}
              </div>
            </div>
          </ProfileSection>
        )}

        <ProfileSection title="Mentoring">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {user.availability && (
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
                  width: "fit-content",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#00D4AA",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {user.availability}
              </div>
            )}
            <StatRow
              label="Mentee capacity"
              value={`${user.menteeCapacity ?? 3} slots`}
            />
            <StatRow label="Active mentees" value="0" />
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}

// ---- Alumni Posts Tab ----
function AlumniPostsTab() {
  return (
    <ProfileSection title="Posts">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 0",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--color-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={24} style={{ color: "var(--color-text-3)" }} />
        </div>
        <p
          style={{
            color: "var(--color-text-3)",
            fontSize: "0.875rem",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 320,
            margin: 0,
          }}
        >
          You haven't shared any posts yet. Share insights, tips, or updates
          with your network.
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "9px 22px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Create a Post
        </button>
      </div>
    </ProfileSection>
  );
}

// ---- Alumni People Tab ----
function AlumniPeopleTab({ onViewProfile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ProfileSection title="Connections (0)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          <Users size={30} style={{ color: "var(--color-text-3)" }} />
          <p
            style={{
              color: "var(--color-text-3)",
              fontSize: "0.82rem",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 220,
              margin: 0,
            }}
          >
            No connections yet. Connect with students and peers on Hyia.
          </p>
        </div>
      </ProfileSection>

      <ProfileSection title="Mentees (0)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          <GraduationCap size={30} style={{ color: "var(--color-text-3)" }} />
          <p
            style={{
              color: "var(--color-text-3)",
              fontSize: "0.82rem",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 220,
              margin: 0,
            }}
          >
            No active mentees yet. Students can request your mentorship through
            your profile.
          </p>
        </div>
      </ProfileSection>
    </div>
  );
}

// ---- Alumni My Profile ----
function AlumniMyProfile({ onViewProfile, currentUser, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("about");
  const [editing, setEditing] = useState(false);
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const coverRef = useRef();
  const photoRef = useRef();

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (file) setCoverImg(URL.createObjectURL(file));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) setProfileImg(URL.createObjectURL(file));
  }

  const TABS = ["about", "posts", "people"];

  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      {editing && (
        <AlumniEditModal
          currentUser={currentUser}
          onSave={onUpdateUser}
          onClose={() => setEditing(false)}
        />
      )}

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
        {/* Cover */}
        <div style={{ position: "relative", height: 150 }}>
          {coverImg ? (
            <img
              src={coverImg}
              alt="cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(108,99,255,0.45), rgba(0,212,170,0.3))",
              }}
            />
          )}
          <button
            onClick={() => coverRef.current.click()}
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "var(--radius-sm)",
              padding: "5px 12px",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.75)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.55)")
            }
          >
            <Camera size={13} /> Edit Cover
          </button>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverChange}
          />
        </div>

        {/* Profile info row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            padding: "0 28px 20px",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar with edit button */}
          <div
            style={{ position: "relative", marginTop: -45, flexShrink: 0 }}
          >
            <div
              style={{
                border: "4px solid var(--color-card)",
                borderRadius: "50%",
                display: "inline-block",
              }}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="profile"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Avatar
                  initials={currentUser.initials || "A"}
                  color="primary"
                  size="xl"
                />
              )}
            </div>
            <button
              onClick={() => photoRef.current.click()}
              style={{
                position: "absolute",
                bottom: 4,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--color-card)",
                border: "2px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6C63FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-border)")
              }
            >
              <Camera size={12} style={{ color: "var(--color-text-2)" }} />
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name / meta */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 16 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "var(--color-text-1)",
                marginBottom: 2,
              }}
            >
              {currentUser.name || "Alumni"}
            </h1>
            <div
              style={{
                color: "var(--color-text-2)",
                fontSize: "0.875rem",
                marginBottom: 8,
              }}
            >
              {[currentUser.jobTitle, currentUser.company]
                .filter(Boolean)
                .join(" · ") || "Alumni"}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: "0.78rem",
                color: "var(--color-text-3)",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={13} /> {currentUser.connections ?? 0} connections
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <GraduationCap size={13} />{" "}
                {currentUser.menteeCapacity ?? 3} mentee slots
              </span>
              {currentUser.university && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Building2 size={13} /> {currentUser.university}
                  {currentUser.gradYear
                    ? ` · ${currentUser.gradYear}`
                    : ""}
                </span>
              )}
            </div>
            {currentUser.linkedin && (
              <a
                href={currentUser.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  color: "var(--color-text-2)",
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
                <ExternalLink size={11} /> LinkedIn
              </a>
            )}
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 22px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              marginTop: 16,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Edit Profile
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            padding: "0 20px",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #6C63FF"
                    : "2px solid transparent",
                color:
                  activeTab === tab ? "#6C63FF" : "var(--color-text-2)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.85rem",
                padding: "14px 20px",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
                marginBottom: -1,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "about" && <AlumniAboutTab user={currentUser} />}
      {activeTab === "posts" && <AlumniPostsTab />}
      {activeTab === "people" && (
        <AlumniPeopleTab onViewProfile={onViewProfile} />
      )}
    </div>
  );
}

// ---- Add Project Modal ----
function AddProjectModal({ onAdd, onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stackInput, setStackInput] = useState("");
  const [stack, setStack] = useState([]);
  const [link, setLink] = useState("");

  function addStack(s) {
    const v = s.trim();
    if (v && !stack.includes(v)) setStack((p) => [...p, v]);
    setStackInput("");
  }

  function submit() {
    if (!name.trim()) return;
    onAdd({ id: Date.now(), name: name.trim(), desc, stack, link });
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

  const lbl = {
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
        zIndex: 300,
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
          maxWidth: 500,
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
              fontSize: "1.2rem",
              color: "var(--color-text-1)",
            }}
          >
            Add Project
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Project Name *</label>
            <input
              style={inputStyle}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rural Health App"
            />
          </div>

          <div>
            <label style={lbl}>
              Description{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 72 }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What does it do? What problem does it solve?"
            />
          </div>

          <div>
            <label style={lbl}>
              Tech Stack{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 8,
              }}
            >
              {stack.map((s) => (
                <span
                  key={s}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(108,99,255,0.15)",
                    color: "#6C63FF",
                    border: "1px solid rgba(108,99,255,0.3)",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                  }}
                >
                  {s}
                  <button
                    onClick={() => setStack((p) => p.filter((x) => x !== s))}
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
              style={inputStyle}
              type="text"
              value={stackInput}
              onChange={(e) => setStackInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && stackInput.trim()) {
                  e.preventDefault();
                  addStack(stackInput);
                }
              }}
              placeholder="Type a technology and press Enter…"
            />
          </div>

          <div>
            <label style={lbl}>
              Project Link{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <input
              style={inputStyle}
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://github.com/you/project or live URL"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 24,
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
            onClick={submit}
            disabled={!name.trim()}
            style={{
              background: name.trim()
                ? "linear-gradient(135deg, #7B73FF, #00D4AA)"
                : "var(--color-border)",
              color: name.trim() ? "white" : "var(--color-text-3)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 24px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: name.trim() ? "pointer" : "not-allowed",
            }}
          >
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Student About Tab ----
function StudentAboutTab({ user, projects, onProjectAdded, onDeleteProject }) {
  const [addingProject, setAddingProject] = useState(false);
  const displaySkills = user.skills?.length > 0 ? user.skills : [];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
      {addingProject && (
        <AddProjectModal
          onAdd={(p) => {
            onProjectAdded(p);
            setAddingProject(false);
          }}
          onClose={() => setAddingProject(false)}
        />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Bio */}
        <ProfileSection title="About">
          <p
            style={{
              color: "var(--color-text-2)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {user.bio ? (
              user.bio
            ) : (
              <span style={{ color: "var(--color-text-3)" }}>
                No bio yet — click Edit Profile to add one.
              </span>
            )}
          </p>
        </ProfileSection>

        {/* Skills */}
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

        {/* Projects */}
        <ProfileSection title={`Projects (${projects.length})`}>
          {projects.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {projects.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      i < projects.length - 1
                        ? "1px solid var(--color-border)"
                        : "none",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
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
                    {p.desc && (
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
                    )}
                    {p.stack?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 4,
                          marginBottom: p.link ? 8 : 0,
                        }}
                      >
                        {p.stack.map((s) => (
                          <SkillPill key={s} label={s} small />
                        ))}
                      </div>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.78rem",
                          color: "#6C63FF",
                          textDecoration: "none",
                        }}
                      >
                        <ExternalLink size={11} /> View Project
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteProject(p.id)}
                    style={{
                      alignSelf: "flex-start",
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-3)",
                      borderRadius: "var(--radius-sm)",
                      padding: "4px 10px",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#FF6B6B";
                      e.currentTarget.style.color = "#FF6B6B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text-3)";
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={() => setAddingProject(true)}
                style={{
                  alignSelf: "flex-start",
                  marginTop: 14,
                  background: "var(--color-surface)",
                  border: "1.5px dashed var(--color-border)",
                  color: "var(--color-text-2)",
                  borderRadius: "var(--radius-sm)",
                  padding: "7px 16px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
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
                + Add Project
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "32px 0",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--color-surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Briefcase size={22} style={{ color: "var(--color-text-3)" }} />
              </div>
              <p
                style={{
                  color: "var(--color-text-3)",
                  fontSize: "0.82rem",
                  textAlign: "center",
                  lineHeight: 1.5,
                  maxWidth: 260,
                  margin: 0,
                }}
              >
                No projects yet. Add your first project to showcase your work to
                mentors and companies.
              </p>
              <button
                onClick={() => setAddingProject(true)}
                style={{
                  background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  padding: "9px 20px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                + Add Project
              </button>
            </div>
          )}
        </ProfileSection>
      </div>

      {/* Right sidebar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(user.university || user.course) && (
          <ProfileSection title="Education">
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <Building2
                size={20}
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
                  {user.university}
                </div>
                {user.course && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-2)",
                      marginTop: 2,
                    }}
                  >
                    {user.course}
                  </div>
                )}
                {user.year && (
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-3)",
                      marginTop: 2,
                    }}
                  >
                    {user.year}
                  </div>
                )}
              </div>
            </div>
          </ProfileSection>
        )}
      </div>
    </div>
  );
}

// ---- Student Posts Tab ----
function StudentPostsTab() {
  return (
    <ProfileSection title="Posts">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 0",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--color-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={24} style={{ color: "var(--color-text-3)" }} />
        </div>
        <p
          style={{
            color: "var(--color-text-3)",
            fontSize: "0.875rem",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 300,
            margin: 0,
          }}
        >
          You haven't shared any posts yet. Share your projects, learnings, or
          updates with the Hyia community.
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "9px 22px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Create a Post
        </button>
      </div>
    </ProfileSection>
  );
}

// ---- Student People Tab ----
function StudentPeopleTab({ onViewProfile }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ProfileSection title="Connections (0)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          <Users size={30} style={{ color: "var(--color-text-3)" }} />
          <p
            style={{
              color: "var(--color-text-3)",
              fontSize: "0.82rem",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 200,
              margin: 0,
            }}
          >
            No connections yet. Explore the circle to connect with peers and
            alumni.
          </p>
        </div>
      </ProfileSection>

      <ProfileSection title="Mentors">
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
  );
}

// ---- Student My Profile ----
function StudentMyProfile({ onViewProfile, currentUser, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("about");
  const [editing, setEditing] = useState(false);
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [projects, setProjects] = useState([]);
  const coverRef = useRef();
  const photoRef = useRef();

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (file) setCoverImg(URL.createObjectURL(file));
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (file) setProfileImg(URL.createObjectURL(file));
  }

  const TABS = ["about", "posts", "people"];

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
        {/* Cover */}
        <div style={{ position: "relative", height: 150 }}>
          {coverImg ? (
            <img
              src={coverImg}
              alt="cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(108,99,255,0.38), rgba(0,212,170,0.25))",
              }}
            />
          )}
          <button
            onClick={() => coverRef.current.click()}
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "var(--radius-sm)",
              padding: "5px 12px",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.75)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.55)")
            }
          >
            <Camera size={13} /> Edit Cover
          </button>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverChange}
          />
        </div>

        {/* Profile info row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            padding: "0 28px 20px",
            flexWrap: "wrap",
          }}
        >
          {/* Avatar with edit */}
          <div
            style={{ position: "relative", marginTop: -45, flexShrink: 0 }}
          >
            <div
              style={{
                border: "4px solid var(--color-card)",
                borderRadius: "50%",
                display: "inline-block",
              }}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt="profile"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <Avatar
                  initials={currentUser.initials || "S"}
                  color="primary"
                  size="xl"
                />
              )}
            </div>
            <button
              onClick={() => photoRef.current.click()}
              style={{
                position: "absolute",
                bottom: 4,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--color-card)",
                border: "2px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6C63FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-border)")
              }
            >
              <Camera size={12} style={{ color: "var(--color-text-2)" }} />
            </button>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />
          </div>

          {/* Name / meta */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 16 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "var(--color-text-1)",
                marginBottom: 2,
              }}
            >
              {currentUser.name || "Student"}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: "0.78rem",
                color: "var(--color-text-3)",
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Users size={13} /> {currentUser.connections ?? 0} connections
              </span>
              {currentUser.university && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Building2 size={13} /> {currentUser.university}
                  {currentUser.year ? ` · ${currentUser.year}` : ""}
                </span>
              )}
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 22px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              marginTop: 16,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Edit Profile
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            padding: "0 20px",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #6C63FF"
                    : "2px solid transparent",
                color:
                  activeTab === tab ? "#6C63FF" : "var(--color-text-2)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.85rem",
                padding: "14px 20px",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
                marginBottom: -1,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "about" && (
        <StudentAboutTab
          user={currentUser}
          projects={projects}
          onProjectAdded={(p) => setProjects((prev) => [p, ...prev])}
          onDeleteProject={(id) =>
            setProjects((prev) => prev.filter((p) => p.id !== id))
          }
        />
      )}
      {activeTab === "posts" && <StudentPostsTab />}
      {activeTab === "people" && (
        <StudentPeopleTab onViewProfile={onViewProfile} />
      )}
    </div>
  );
}

// ---- Company constants ----
const CO_INDUSTRIES = [
  "Technology", "Finance & Banking", "Telecommunications", "Healthcare",
  "Energy", "Education", "Consulting", "Media & Entertainment",
  "Agriculture", "Logistics", "Other",
];
const CO_SIZES = [
  "1–10 employees", "11–50 employees", "51–200 employees",
  "201–500 employees", "500+ employees",
];
const JOB_TYPES = [
  "Internship", "Full-time", "Part-time", "Contract", "Research Collaboration",
];
const JOB_MODES = ["On-site", "Remote", "Hybrid"];

// ---- Company Edit Modal ----
function CompanyEditModal({ currentUser, onSave, onClose }) {
  const [companyName, setCompanyName] = useState(currentUser.name || "");
  const [description, setDescription] = useState(currentUser.bio || "");
  const [industry, setIndustry] = useState(currentUser.industry || "");
  const [size, setSize] = useState(currentUser.size || "");
  const [location, setLocation] = useState(currentUser.location || "");
  const [website, setWebsite] = useState(currentUser.website || "");
  const [contactEmail, setContactEmail] = useState(currentUser.contactEmail || "");
  const [founded, setFounded] = useState(currentUser.founded || "");

  function save() {
    const n = companyName.trim() || "Company";
    onSave({
      name: n,
      initials: n.slice(0, 2).toUpperCase(),
      title: industry || "Company",
      bio: description,
      industry,
      size,
      location,
      website,
      contactEmail,
      founded,
      role: "company",
    });
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

  const lbl = {
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
            Edit Company Profile
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
          <div>
            <label style={lbl}>Company Name</label>
            <input
              style={inputStyle}
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Hubtel, MTN Ghana"
            />
          </div>

          <div>
            <label style={lbl}>Description</label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 90 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your company culture, mission, and what makes you great…"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={lbl}>Industry</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="">— select —</option>
                {CO_INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Company Size</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              >
                <option value="">— select —</option>
                {CO_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={lbl}>Location / HQ</label>
              <input
                style={inputStyle}
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Accra, Ghana"
              />
            </div>
            <div>
              <label style={lbl}>Founded Year</label>
              <input
                style={inputStyle}
                type="number"
                min={1800}
                max={2030}
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="e.g. 2015"
              />
            </div>
          </div>

          <div>
            <label style={lbl}>
              Company Website{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <input
              style={inputStyle}
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourcompany.com"
            />
          </div>

          <div>
            <label style={lbl}>Contact Email</label>
            <input
              style={inputStyle}
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="talent@yourcompany.com"
            />
          </div>
        </div>

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

// ---- Create Job Modal ----
function CreateJobModal({ onAdd, onClose }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Internship");
  const [workMode, setWorkMode] = useState("Hybrid");
  const [duration, setDuration] = useState("");
  const [pay, setPay] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  function addSkill(s) {
    const v = s.trim();
    if (v && !skills.includes(v)) setSkills((p) => [...p, v]);
    setSkillInput("");
  }

  function submit() {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title: title.trim(),
      type,
      workMode,
      duration,
      pay,
      description,
      deadline,
      skills,
      applicants: 0,
      status: "open",
    });
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

  const lbl = {
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
        zIndex: 300,
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
          maxWidth: 520,
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
              fontSize: "1.2rem",
              color: "var(--color-text-1)",
            }}
          >
            Create Job Posting
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

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={lbl}>Job Title *</label>
            <input
              style={inputStyle}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer Intern"
            />
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={lbl}>Job Type</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={lbl}>Work Mode</label>
              <select
                style={{ ...inputStyle, cursor: "pointer" }}
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
              >
                {JOB_MODES.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={lbl}>
                Duration{" "}
                <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                  (optional)
                </span>
              </label>
              <input
                style={inputStyle}
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 months"
              />
            </div>
            <div>
              <label style={lbl}>
                Pay / Compensation{" "}
                <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                  (optional)
                </span>
              </label>
              <input
                style={inputStyle}
                type="text"
                value={pay}
                onChange={(e) => setPay(e.target.value)}
                placeholder="e.g. GHS 1,500/month"
              />
            </div>
          </div>

          <div>
            <label style={lbl}>
              Description{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <textarea
              style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will the applicant work on? What are you looking for?"
            />
          </div>

          <div>
            <label style={lbl}>
              Application Deadline{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
            <input
              style={inputStyle}
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder='e.g. Jun 30, 2025 or "Open"'
            />
          </div>

          <div>
            <label style={lbl}>
              Required Skills{" "}
              <span style={{ fontWeight: 400, color: "var(--color-text-3)" }}>
                (optional)
              </span>
            </label>
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
                    gap: 5,
                    background: "rgba(108,99,255,0.15)",
                    color: "#6C63FF",
                    border: "1px solid rgba(108,99,255,0.3)",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: "0.78rem",
                    fontWeight: 500,
                  }}
                >
                  {s}
                  <button
                    onClick={() =>
                      setSkills((p) => p.filter((x) => x !== s))
                    }
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
              style={inputStyle}
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && skillInput.trim()) {
                  e.preventDefault();
                  addSkill(skillInput);
                }
              }}
              placeholder="Type a skill and press Enter…"
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 24,
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
            onClick={submit}
            disabled={!title.trim()}
            style={{
              background: title.trim()
                ? "linear-gradient(135deg, #7B73FF, #00D4AA)"
                : "var(--color-border)",
              color: title.trim() ? "white" : "var(--color-text-3)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 24px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: title.trim() ? "pointer" : "not-allowed",
            }}
          >
            Post Job
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Company About Tab ----
function CompanyAboutTab({ company }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20 }}>
      <ProfileSection title="About">
        <p
          style={{
            color: "var(--color-text-2)",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {company.bio ? (
            company.bio
          ) : (
            <span style={{ color: "var(--color-text-3)" }}>
              No description yet — click Edit Profile to add one.
            </span>
          )}
        </p>
      </ProfileSection>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <ProfileSection title="Company Info">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {company.industry && (
              <StatRow label="Industry" value={company.industry} />
            )}
            {company.size && <StatRow label="Size" value={company.size} />}
            {company.location && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--color-text-3)" }}
                >
                  Location
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--color-text-1)",
                  }}
                >
                  <MapPin size={12} /> {company.location}
                </span>
              </div>
            )}
            {company.founded && (
              <StatRow label="Founded" value={company.founded} />
            )}
            {company.contactEmail && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--color-text-3)" }}
                >
                  Email
                </span>
                <a
                  href={`mailto:${company.contactEmail}`}
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#6C63FF",
                    textDecoration: "none",
                  }}
                >
                  {company.contactEmail}
                </a>
              </div>
            )}
            {company.website && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <span
                  style={{ fontSize: "0.8rem", color: "var(--color-text-3)" }}
                >
                  Website
                </span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "#6C63FF",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={11} /> Visit
                </a>
              </div>
            )}
            <StatRow
              label="Followers"
              value={(company.followers ?? 0).toLocaleString()}
            />
          </div>
        </ProfileSection>
      </div>
    </div>
  );
}

// ---- Company Posts Tab ----
function CompanyPostsTab() {
  return (
    <ProfileSection title="Posts">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 0",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--color-surface)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={24} style={{ color: "var(--color-text-3)" }} />
        </div>
        <p
          style={{
            color: "var(--color-text-3)",
            fontSize: "0.875rem",
            textAlign: "center",
            lineHeight: 1.6,
            maxWidth: 320,
            margin: 0,
          }}
        >
          No posts yet. Share company updates, opportunities, and insights with
          your followers.
        </p>
        <button
          style={{
            background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "9px 22px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Create a Post
        </button>
      </div>
    </ProfileSection>
  );
}

// ---- Company Jobs Tab ----
function CompanyJobsTab({ jobs, onAddJob, onDeleteJob }) {
  const [showCreate, setShowCreate] = useState(false);

  const openJobs = jobs.filter((j) => j.status === "open");
  const totalApplicants = jobs.reduce(
    (sum, j) => sum + (j.applicants || 0),
    0
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {showCreate && (
        <CreateJobModal
          onAdd={(job) => {
            onAddJob(job);
            setShowCreate(false);
          }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Stats + Create button row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 20 }}>
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}>
            <strong
              style={{ color: "var(--color-text-1)", fontWeight: 600 }}
            >
              {openJobs.length}
            </strong>{" "}
            open {openJobs.length === 1 ? "role" : "roles"}
          </span>
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-3)" }}>
            <strong
              style={{ color: "var(--color-text-1)", fontWeight: 600 }}
            >
              {totalApplicants}
            </strong>{" "}
            total applications
          </span>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
            color: "white",
            border: "none",
            borderRadius: "var(--radius-sm)",
            padding: "9px 18px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            fontSize: "0.82rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          + Create Job
        </button>
      </div>

      {/* Jobs Offered */}
      <ProfileSection title={`Jobs Offered (${jobs.length})`}>
        {jobs.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map((job) => (
              <div
                key={job.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 16px",
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "var(--color-text-1)",
                      }}
                    >
                      {job.title}
                    </span>
                    <span
                      style={{
                        background: "rgba(108,99,255,0.12)",
                        color: "#6C63FF",
                        border: "1px solid rgba(108,99,255,0.25)",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {job.type}
                    </span>
                    <span
                      style={{
                        background: "rgba(0,212,170,0.1)",
                        color: "#00D4AA",
                        border: "1px solid rgba(0,212,170,0.25)",
                        borderRadius: 20,
                        padding: "2px 8px",
                        fontSize: "0.7rem",
                        fontWeight: 600,
                      }}
                    >
                      {job.workMode}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      flexWrap: "wrap",
                      fontSize: "0.78rem",
                      color: "var(--color-text-3)",
                      marginBottom: job.skills?.length ? 8 : 0,
                    }}
                  >
                    {job.duration && <span>{job.duration}</span>}
                    {job.pay && <span>{job.pay}</span>}
                    {job.deadline && <span>Closes {job.deadline}</span>}
                  </div>
                  {job.skills?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {job.skills.map((s) => (
                        <SkillPill key={s} label={s} small />
                      ))}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 8,
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--color-text-3)",
                    }}
                  >
                    {job.applicants} applicant
                    {job.applicants !== 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={() => onDeleteJob(job.id)}
                    style={{
                      background: "transparent",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-3)",
                      borderRadius: "var(--radius-sm)",
                      padding: "4px 10px",
                      fontSize: "0.72rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#FF6B6B";
                      e.currentTarget.style.color = "#FF6B6B";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.color = "var(--color-text-3)";
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "32px 0",
              gap: 10,
            }}
          >
            <Briefcase size={28} style={{ color: "var(--color-text-3)" }} />
            <p
              style={{
                color: "var(--color-text-3)",
                fontSize: "0.82rem",
                textAlign: "center",
                margin: 0,
              }}
            >
              No jobs posted yet. Click{" "}
              <strong style={{ color: "var(--color-text-2)" }}>
                + Create Job
              </strong>{" "}
              to post your first role.
            </p>
          </div>
        )}
      </ProfileSection>

      {/* Open Applications */}
      <ProfileSection title={`Open Applications (${totalApplicants})`}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          <Users size={28} style={{ color: "var(--color-text-3)" }} />
          <p
            style={{
              color: "var(--color-text-3)",
              fontSize: "0.82rem",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 300,
              margin: 0,
            }}
          >
            {totalApplicants === 0
              ? "No applications yet. Post jobs and students will start applying through Hyia."
              : `${totalApplicants} application${totalApplicants !== 1 ? "s" : ""} pending review.`}
          </p>
        </div>
      </ProfileSection>
    </div>
  );
}

// ---- Company People Tab ----
function CompanyPeopleTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      <ProfileSection title="Followers (0)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          <Heart size={30} style={{ color: "var(--color-text-3)" }} />
          <p
            style={{
              color: "var(--color-text-3)",
              fontSize: "0.82rem",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 220,
              margin: 0,
            }}
          >
            No followers yet. Students and alumni will follow as you engage on
            Hyia.
          </p>
        </div>
      </ProfileSection>

      <ProfileSection title="Team Members (0)">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "28px 0",
            gap: 10,
          }}
        >
          <Users size={30} style={{ color: "var(--color-text-3)" }} />
          <p
            style={{
              color: "var(--color-text-3)",
              fontSize: "0.82rem",
              textAlign: "center",
              lineHeight: 1.5,
              maxWidth: 220,
              margin: 0,
            }}
          >
            Add your team members to build your company presence on Hyia.
          </p>
        </div>
      </ProfileSection>
    </div>
  );
}

// ---- Company My Profile ----
function CompanyMyProfile({ onViewProfile, currentUser, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("about");
  const [editing, setEditing] = useState(false);
  const [coverImg, setCoverImg] = useState(null);
  const [logoImg, setLogoImg] = useState(null);
  const [jobs, setJobs] = useState([]);
  const coverRef = useRef();
  const logoRef = useRef();

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (file) setCoverImg(URL.createObjectURL(file));
  }

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (file) setLogoImg(URL.createObjectURL(file));
  }

  const TABS = ["about", "posts", "jobs", "people"];

  return (
    <div
      style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}
      className="fade-in"
    >
      {editing && (
        <CompanyEditModal
          currentUser={currentUser}
          onSave={onUpdateUser}
          onClose={() => setEditing(false)}
        />
      )}

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
        {/* Cover */}
        <div style={{ position: "relative", height: 150 }}>
          {coverImg ? (
            <img
              src={coverImg}
              alt="cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(135deg, rgba(255,183,77,0.35), rgba(108,99,255,0.25))",
              }}
            />
          )}
          <button
            onClick={() => coverRef.current.click()}
            style={{
              position: "absolute",
              bottom: 10,
              right: 12,
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.25)",
              borderRadius: "var(--radius-sm)",
              padding: "5px 12px",
              fontSize: "0.75rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.75)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(0,0,0,0.55)")
            }
          >
            <Camera size={13} /> Edit Cover
          </button>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleCoverChange}
          />
        </div>

        {/* Info row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 20,
            padding: "0 28px 20px",
            flexWrap: "wrap",
          }}
        >
          {/* Logo with edit */}
          <div
            style={{ position: "relative", marginTop: -45, flexShrink: 0 }}
          >
            <div
              style={{
                border: "4px solid var(--color-card)",
                borderRadius: "var(--radius-md)",
                display: "inline-block",
                overflow: "hidden",
              }}
            >
              {logoImg ? (
                <img
                  src={logoImg}
                  alt="logo"
                  style={{
                    width: 90,
                    height: 90,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 90,
                    height: 90,
                    background: "rgba(255,183,77,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "2rem",
                    color: "#FFB74D",
                  }}
                >
                  {currentUser.initials || "C"}
                </div>
              )}
            </div>
            <button
              onClick={() => logoRef.current.click()}
              style={{
                position: "absolute",
                bottom: 4,
                right: -4,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--color-card)",
                border: "2px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6C63FF")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-border)")
              }
            >
              <Camera size={12} style={{ color: "var(--color-text-2)" }} />
            </button>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleLogoChange}
            />
          </div>

          {/* Name / meta */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 16 }}>
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
                  fontSize: "1.5rem",
                  color: "var(--color-text-1)",
                  margin: 0,
                }}
              >
                {currentUser.name || "Company"}
              </h1>
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
            </div>
            {currentUser.industry && (
              <div
                style={{
                  color: "var(--color-text-2)",
                  fontSize: "0.875rem",
                  marginBottom: 8,
                }}
              >
                {currentUser.industry}
              </div>
            )}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: "0.78rem",
                color: "var(--color-text-3)",
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {currentUser.size && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Users size={13} /> {currentUser.size}
                </span>
              )}
              {currentUser.location && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <MapPin size={13} /> {currentUser.location}
                </span>
              )}
              {currentUser.founded && (
                <span
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Building2 size={13} /> Founded {currentUser.founded}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Heart size={13} />{" "}
                {(currentUser.followers ?? 0).toLocaleString()} followers
              </span>
            </div>
            {currentUser.website && (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  color: "var(--color-text-2)",
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
                <Globe size={11} /> Website
              </a>
            )}
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditing(true)}
            style={{
              background: "linear-gradient(135deg, #7B73FF, #00D4AA)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius-sm)",
              padding: "10px 22px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "0.875rem",
              cursor: "pointer",
              marginTop: 16,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Edit Profile
          </button>
        </div>

        {/* Tab bar */}
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            display: "flex",
            padding: "0 20px",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: "none",
                border: "none",
                borderBottom:
                  activeTab === tab
                    ? "2px solid #6C63FF"
                    : "2px solid transparent",
                color:
                  activeTab === tab ? "#6C63FF" : "var(--color-text-2)",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "0.85rem",
                padding: "14px 20px",
                cursor: "pointer",
                transition: "all 0.2s",
                textTransform: "capitalize",
                marginBottom: -1,
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "about" && <CompanyAboutTab company={currentUser} />}
      {activeTab === "posts" && <CompanyPostsTab />}
      {activeTab === "jobs" && (
        <CompanyJobsTab
          jobs={jobs}
          onAddJob={(job) => setJobs((prev) => [job, ...prev])}
          onDeleteJob={(id) => setJobs((prev) => prev.filter((j) => j.id !== id))}
        />
      )}
      {activeTab === "people" && <CompanyPeopleTab />}
    </div>
  );
}

// ---- My Profile ----
export function MyProfile({ onViewProfile, currentUser = {}, onUpdateUser }) {
  if (currentUser?.role === "alumni") {
    return (
      <AlumniMyProfile
        onViewProfile={onViewProfile}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
      />
    );
  }
  if (currentUser?.role === "company") {
    return (
      <CompanyMyProfile
        onViewProfile={onViewProfile}
        currentUser={currentUser}
        onUpdateUser={onUpdateUser}
      />
    );
  }
  return (
    <StudentMyProfile
      onViewProfile={onViewProfile}
      currentUser={currentUser}
      onUpdateUser={onUpdateUser}
    />
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

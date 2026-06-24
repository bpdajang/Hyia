import { useState } from "react";
import { SkillTag } from "../components/ui/index.jsx";
import {
  AuthShell,
  StepIndicator,
  FormGroup,
  PrimaryBtn,
  GhostBtn,
} from "./StudentOnboarding.jsx";
import { Phone } from "lucide-react";
import { showToast } from "../components/ui/toast.js";
import { createCompanyPage } from "../api/companyPages.js";

const h1Style = {
  fontFamily: "var(--font-display)",
  fontSize: "1.75rem",
  fontWeight: 700,
  color: "var(--color-text-1)",
  marginBottom: 8,
};

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

const subStyle = {
  color: "var(--color-text-2)",
  marginBottom: 28,
  fontSize: "1rem",
};

const labelStyle = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--color-text-2)",
  marginBottom: 10,
};

const INDUSTRIES = [
  "Technology",
  "Finance & Banking",
  "Telecommunications",
  "Healthcare",
  "Energy",
  "Education",
  "Consulting",
  "Media & Entertainment",
  "Agriculture",
  "Logistics",
  "Other",
];

const COMPANY_SIZES = [
  "1–10 employees",
  "11–50 employees",
  "51–200 employees",
  "201–500 employees",
  "500+ employees",
];

export function CompanySignupPage({ onNavigate, inApp = false }) {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const emailValid = !contactEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail);
  const canContinue = companyName && industry && size && location && emailValid && !submitting;

  async function handleDone() {
    if (inApp) {
      setSubmitting(true);
      try {
        await createCompanyPage({ companyName, industry, size, location, phone, contactEmail, website, description });
        showToast("Company page created!", "success");
        onNavigate("settings");
      } catch (err) {
        showToast(err.message || "Failed to create company page", "error");
      } finally {
        setSubmitting(false);
      }
    } else {
      onNavigate("home", { companyName, industry, size, location, contactEmail, website, description });
    }
  }

  const content = (
    <>
      {!inApp && <StepIndicator current={2} />}
      <h1 style={inApp ? { ...h1Style, fontSize: "1.4rem" } : h1Style}>
        {inApp ? "Create a Company Page" : "Tell us about your company"}
      </h1>
      <p style={subStyle}>
        Help students and alumni discover who you are and what you stand for.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <FormGroup label="Company Name" fullWidth>
          <input
            type="text"
            placeholder="e.g. Aya Data, MTN Ghana, Zeepay"
            style={inputStyle}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Industry">
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>
              Select industry
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup label="Company Size">
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>
              Select size
            </option>
            {COMPANY_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup label="Headquarters / Location">
          <input
            type="text"
            placeholder="e.g. Accra, Ghana"
            style={inputStyle}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Contact Phone" optional icon={<Phone size={16} />}>
          <input
            type="tel"
            style={inputStyle}
            placeholder="+233 20 000 0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Contact Email">
          <input
            type="email"
            placeholder="talent@yourcompany.com"
            style={inputStyle}
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Company Website" optional>
          <input
            type="url"
            style={inputStyle}
            placeholder="https://yourcompany.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </FormGroup>
        {/* Company description */}
        <FormGroup label="Company description" fullWidth optional>
          <textarea
            placeholder="Describe your culture, mission, and what makes your company a great place to grow…"
            rows={3}
            style={inputStyle}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <GhostBtn onClick={() => onNavigate(inApp ? "settings" : "create-account")}>← Back</GhostBtn>
        <span
          style={{
            opacity: canContinue ? 1 : 0.5,
            pointerEvents: canContinue ? "auto" : "none",
          }}
        >
          <PrimaryBtn onClick={handleDone}>
            {inApp ? (submitting ? "Creating…" : "Create Company Page") : "Finish & Enter Hyia →"}
          </PrimaryBtn>
        </span>
      </div>
    </>
  );

  if (inApp) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px" }} className="fade-in">
        {content}
      </div>
    );
  }

  return <AuthShell>{content}</AuthShell>;
}

// // ---- Step 2: Hiring Preferences ----
// const INITIAL_ROLES = ["Software Engineer", "Data Analyst"];
// const SUGGESTED_ROLES = [
//   "Product Manager",
//   "UX Designer",
//   "DevOps Engineer",
//   "Machine Learning Engineer",
//   "Business Analyst",
//   "Marketing Associate",
//   "Finance Analyst",
//   "Research Scientist",
// ];

// const INITIAL_SKILLS = ["Python", "React", "SQL"];
// const SUGGESTED_SKILLS = [
//   "Node.js",
//   "Cloud (AWS / GCP)",
//   "Figma",
//   "Data Science",
//   "Go",
//   "Java",
//   "Communication",
//   "Project Management",
// ];

// const ENGAGEMENT_TYPES = [
//   "Internship",
//   "Part-time",
//   "Full-time",
//   "Research Collaboration",
//   "Freelance / Contract",
// ];

// export function CompanyHiringPage({ onNavigate }) {
//   const [roles, setRoles] = useState(INITIAL_ROLES);
//   const [roleSuggestions, setRoleSuggestions] = useState(SUGGESTED_ROLES);
//   const [roleInput, setRoleInput] = useState("");

//   const [skills, setSkills] = useState(INITIAL_SKILLS);
//   const [skillSuggestions, setSkillSuggestions] = useState(SUGGESTED_SKILLS);
//   const [skillInput, setSkillInput] = useState("");

//   const [engagements, setEngagements] = useState(["Internship", "Full-time"]);
//   const [description, setDescription] = useState("");

//   function addTag(list, setList, suggestions, setSuggestions, name) {
//     if (!list.includes(name)) setList((s) => [...s, name]);
//     setSuggestions((s) => s.filter((x) => x !== name));
//   }

//   function removeTag(list, setList, suggestions, setSuggestions, name) {
//     setList((s) => s.filter((x) => x !== name));
//     if (
//       suggestions.includes(name) ||
//       SUGGESTED_ROLES.includes(name) ||
//       SUGGESTED_SKILLS.includes(name)
//     )
//       setSuggestions((s) => (s.includes(name) ? s : [...s, name]));
//   }

//   function toggleEngagement(e) {
//     setEngagements((prev) =>
//       prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
//     );
//   }

//   return (
//     <AuthShell>
//       <StepIndicator current={3} />
//       <h1 style={h1Style}>Who are you looking for?</h1>
//       <p style={subStyle}>
//         Our AI uses this to surface the most relevant talent from the Hyia
//         network.
//       </p>

//       {/* Roles hiring for */}
//       <div style={{ marginBottom: 20 }}>
//         <label style={labelStyle}>Roles you're hiring for</label>
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 8,
//             marginBottom: 10,
//           }}
//         >
//           {roles.map((r) => (
//             <SkillTag
//               key={r}
//               label={r}
//               active
//               onRemove={() =>
//                 removeTag(
//                   roles,
//                   setRoles,
//                   roleSuggestions,
//                   setRoleSuggestions,
//                   r,
//                 )
//               }
//             />
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Add a role…"
//           value={roleInput}
//           onChange={(e) => setRoleInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && roleInput.trim()) {
//               addTag(
//                 roles,
//                 setRoles,
//                 roleSuggestions,
//                 setRoleSuggestions,
//                 roleInput.trim(),
//               );
//               setRoleInput("");
//             }
//           }}
//           style={{ marginTop: 10 }}
//         />
//         <div
//           style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}
//         >
//           {roleSuggestions.map((r) => (
//             <SkillTag
//               key={r}
//               label={r}
//               suggest
//               onClick={() =>
//                 addTag(roles, setRoles, roleSuggestions, setRoleSuggestions, r)
//               }
//             />
//           ))}
//         </div>
//       </div>

//       {/* Skills needed */}
//       <div style={{ marginBottom: 24 }}>
//         <label style={labelStyle}>Key skills you're looking for</label>
//         <div
//           style={{
//             display: "flex",
//             flexWrap: "wrap",
//             gap: 8,
//             marginBottom: 10,
//           }}
//         >
//           {skills.map((s) => (
//             <SkillTag
//               key={s}
//               label={s}
//               active
//               onRemove={() =>
//                 removeTag(
//                   skills,
//                   setSkills,
//                   skillSuggestions,
//                   setSkillSuggestions,
//                   s,
//                 )
//               }
//             />
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Add a skill…"
//           value={skillInput}
//           onChange={(e) => setSkillInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && skillInput.trim()) {
//               addTag(
//                 skills,
//                 setSkills,
//                 skillSuggestions,
//                 setSkillSuggestions,
//                 skillInput.trim(),
//               );
//               setSkillInput("");
//             }
//           }}
//           style={{ marginTop: 10 }}
//         />
//         <div
//           style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}
//         >
//           {skillSuggestions.map((s) => (
//             <SkillTag
//               key={s}
//               label={s}
//               suggest
//               onClick={() =>
//                 addTag(
//                   skills,
//                   setSkills,
//                   skillSuggestions,
//                   setSkillSuggestions,
//                   s,
//                 )
//               }
//             />
//           ))}
//         </div>
//       </div>

//       {/* Engagement types */}
//       <div style={{ marginBottom: 24 }}>
//         <label style={labelStyle}>Type of engagement</label>
//         <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
//           {ENGAGEMENT_TYPES.map((e) => (
//             <EngagementChip
//               key={e}
//               label={e}
//               active={engagements.includes(e)}
//               onToggle={() => toggleEngagement(e)}
//             />
//           ))}
//         </div>
//       </div>

//       <div
//         style={{
//           display: "flex",
//           gap: 12,
//           justifyContent: "flex-end",
//           marginTop: 24,
//         }}
//       >
//         <GhostBtn onClick={() => onNavigate("company-signup")}>← Back</GhostBtn>
//         <PrimaryBtn
//           onClick={() =>
//             onNavigate("home", { roles, skills, engagements, description })
//           }
//         >
//           Finish & Enter Hyia →
//         </PrimaryBtn>
//       </div>
//     </AuthShell>
//   );
// }

// // ---- Toggle chip ----
// function EngagementChip({ label, active, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       style={{
//         background: active ? "rgba(0,212,170,0.12)" : "var(--color-card)",
//         border: `1.5px solid ${active ? "#00D4AA" : "var(--color-border)"}`,
//         color: active ? "#00D4AA" : "var(--color-text-2)",
//         borderRadius: 20,
//         padding: "6px 14px",
//         fontSize: "0.8rem",
//         fontWeight: 500,
//         cursor: "pointer",
//         transition: "all 0.2s",
//       }}
//     >
//       {label}
//     </button>
//   );
// }

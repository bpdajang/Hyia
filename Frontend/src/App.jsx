import { useState } from "react";
import "./index.css";

// Pages (auth flow)
import SignUpPage from "./pages/SignUpPage.jsx";
import CreateAccountPage from "./pages/CreateAccount.jsx";
import SignInPage from "./pages/SignIn.jsx";
import {
  StudentSignupPage,
  StudentSkillsPage,
} from "./pages/StudentOnboarding.jsx";
import {
  AlumniSignupPage,
  AlumniExpertisePage,
} from "./pages/AlumniOnboarding.jsx";
import { CompanySignupPage } from "./pages/CompanyOnboarding.jsx";

import TopNav from "./components/layout/TopNav.jsx";

// Tabs
import HomeTab from "./components/tabs/HomeTab.jsx";
import CircleTab from "./components/tabs/CircleTab.jsx";
import OpportunitiesTab from "./components/tabs/OpportunitiesTab.jsx";
import MessagesTab from "./components/tabs/MessagesTab.jsx";
import { NotificationsTab } from "./components/tabs/Notification.jsx";
import { MyProfile, OtherProfile } from "./components/tabs/Profile.jsx";
import { PROFILES, CURRENT_USER as DEFAULT_USER } from "./data/index.js";

function getInitials(name) {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U"
  );
}

function buildCurrentUser(data, role) {
  const target = role?.page;

  if (target === "student-signup") {
    const name = data.name || "Student";
    const uniYear = [data.university, data.year].filter(Boolean).join(" ");
    const title =
      [data.course, uniYear].filter(Boolean).join(" · ") || "Student";
    return {
      initials: getInitials(name),
      name,
      title,
      bio: data.bio || "",
      university: data.university || "",
      course: data.course || "",
      year: data.year || "",
      skills: data.skills || [],
      connections: 0,
      endorsements: 0,
      role: "student",
    };
  }

  if (target === "alumni-signup") {
    const name = data.name || "Alumni";
    const title =
      [data.jobTitle, data.company].filter(Boolean).join(" · ") || "Alumni";
    return {
      initials: getInitials(name),
      name,
      title,
      bio: data.bio || "",
      university: data.university || "",
      gradYear: data.gradYear || "",
      jobTitle: data.jobTitle || "",
      company: data.company || "",
      linkedin: data.linkedin || "",
      expertise: data.expertise || [],
      offerings: data.offerings || [],
      availability: data.availability || "",
      menteeCapacity: data.menteeCapacity ?? 3,
      connections: 0,
      endorsements: 0,
      role: "alumni",
    };
  }

  if (target === "company-signup") {
    const name = data.companyName || "Company";
    return {
      initials: name.slice(0, 2).toUpperCase(),
      name,
      title: data.industry || "Company",
      bio: data.description || "",
      industry: data.industry || "",
      size: data.size || "",
      location: data.location || "",
      website: data.website || "",
      contactEmail: data.contactEmail || "",
      followers: 0,
      connections: 0,
      endorsements: 0,
      role: "company",
    };
  }

  // Sign-in: derive from email
  const emailPart = (data.email || "").split("@")[0];
  const name =
    emailPart
      .split(/[._-]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ") || "User";
  return {
    initials: getInitials(name),
    name,
    title: "Hyia Member",
    bio: "",
    skills: [],
    connections: 0,
    endorsements: 0,
  };
}

export default function App() {
  const [page, setPage] = useState("signup");
  const [activeTab, setActiveTab] = useState("home");
  const [signupRole, setSignupRole] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [onboardingData, setOnboardingData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  function selectRole(role) {
    setSignupRole(role);
    setPage("create-account");
  }

  function navigate(target, data = {}) {
    const merged = { ...onboardingData, ...data };
    setOnboardingData(merged);

    if (target === "home" && !currentUser) {
      setCurrentUser(buildCurrentUser(merged, signupRole));
    }

    const appTabs = [
      "home",
      "circle",
      "opportunities",
      "messages",
      "notifications",
      "profile",
    ];
    if (appTabs.includes(target)) {
      setPage("home");
      setActiveTab(target);
      setViewingProfile(null);
    } else {
      setPage(target);
    }
  }

  function viewProfile(profileId) {
    const profile = PROFILES[profileId];
    if (profile) setViewingProfile(profile);
  }

  function closeProfile() {
    setViewingProfile(null);
  }

  function updateUser(data) {
    setCurrentUser((prev) => ({ ...(prev || DEFAULT_USER), ...data }));
  }

  const user = currentUser || DEFAULT_USER;

  // Auth pages
  if (page === "signup")
    return <SignUpPage onNavigate={navigate} onSelectRole={selectRole} />;
  if (page === "create-account")
    return <CreateAccountPage role={signupRole} onNavigate={navigate} />;
  if (page === "signin") return <SignInPage onNavigate={navigate} />;
  if (page === "student-signup")
    return <StudentSignupPage onNavigate={navigate} />;
  if (page === "student-skills")
    return <StudentSkillsPage onNavigate={navigate} />;
  if (page === "alumni-signup")
    return <AlumniSignupPage onNavigate={navigate} />;
  if (page === "alumni-expertise")
    return <AlumniExpertisePage onNavigate={navigate} />;
  if (page === "company-signup")
    return <CompanySignupPage onNavigate={navigate} />;
  if (page === "company-hiring")
    return <CompanyHiringPage onNavigate={navigate} />;

  // Main app
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-base)",
      }}
    >
      <TopNav
        activeTab={activeTab}
        onTabChange={(tab) => navigate(tab)}
        currentUser={user}
      />

      <div style={{ marginLeft: 260, flex: 1, minWidth: 0 }}>
        {viewingProfile ? (
          <OtherProfile profile={viewingProfile} onBack={closeProfile} />
        ) : (
          <>
            {activeTab === "home" && (
              <div className="fade-in">
                <HomeTab onNavigate={navigate} onViewProfile={viewProfile} />
              </div>
            )}
            {activeTab === "circle" && (
              <CircleTab onViewProfile={viewProfile} />
            )}
            {activeTab === "opportunities" && <OpportunitiesTab />}
            {activeTab === "messages" && (
              <div style={{ height: "100vh" }}>
                <MessagesTab />
              </div>
            )}
            {activeTab === "notifications" && (
              <NotificationsTab onTabChange={navigate} />
            )}
            {activeTab === "profile" && (
              <MyProfile
                onViewProfile={viewProfile}
                currentUser={user}
                onUpdateUser={updateUser}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

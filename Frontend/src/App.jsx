import { useState, useEffect } from "react";
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

import { SideNav, BottomNav } from "./components/layout/NavBar.jsx";
import { ToastContainer } from "./components/ui/ToastContainer.jsx";
import SearchModal from "./components/ui/SearchModal.jsx";
import { ErrorBoundary } from "./components/ui/ErrorBoundary.jsx";

// Tabs
import HomeTab from "./components/tabs/HomeTab.jsx";
import CircleTab from "./components/tabs/CircleTab.jsx";
import OpportunitiesTab from "./components/tabs/OpportunitiesTab.jsx";
import MessagesTab from "./components/tabs/MessagesTab.jsx";
import { NotificationsTab } from "./components/tabs/Notification.jsx";
import { MyProfile, OtherProfile } from "./components/tabs/Profile.jsx";
import SettingsTab from "./components/tabs/SettingsTab.jsx";
import { useIsMobile } from "./hooks/useIsMobile.js";
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
  const [showSearch, setShowSearch] = useState(false);

  const isMobile = useIsMobile();

  // Cmd/Ctrl+K → open search
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch((s) => !s);
      }
      if (e.key === "Escape") setShowSearch(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      "settings",
    ];
    if (appTabs.includes(target)) {
      setPage("home");
      setActiveTab(target);
      setViewingProfile(null);
      // Scroll to top on tab change
      window.scrollTo({ top: 0, behavior: "instant" });
    } else {
      setPage(target);
    }
  }

  function viewProfile(profileId) {
    const profile = PROFILES[profileId];
    if (profile) {
      setViewingProfile(profile);
      window.scrollTo({ top: 0, behavior: "instant" });
    }
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
    return (
      <>
        <SignUpPage onNavigate={navigate} onSelectRole={selectRole} />
        <ToastContainer />
      </>
    );
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

  // Main app
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-base)",
      }}
    >
      {/* Sidebar — desktop only */}
      {!isMobile && (
        <SideNav
          activeTab={activeTab}
          onTabChange={(tab) => navigate(tab)}
          currentUser={user}
          onSearch={() => setShowSearch(true)}
        />
      )}

      <ToastContainer />

      {/* Search modal */}
      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onNavigate={(tab) => {
            navigate(tab);
            setShowSearch(false);
          }}
          onViewProfile={(id) => {
            viewProfile(id);
            setShowSearch(false);
          }}
        />
      )}

      {/* Main content */}
      <div
        className="main-content"
        style={{ marginLeft: isMobile ? 0 : 260, flex: 1, minWidth: 0 }}
      >
        {viewingProfile ? (
          <ErrorBoundary>
            <OtherProfile profile={viewingProfile} onBack={closeProfile} />
          </ErrorBoundary>
        ) : (
          <>
            {activeTab === "home" && (
              <ErrorBoundary>
                <div className="fade-in">
                  <HomeTab
                    onNavigate={navigate}
                    onViewProfile={viewProfile}
                    currentUser={user}
                  />
                </div>
              </ErrorBoundary>
            )}
            {activeTab === "circle" && (
              <ErrorBoundary>
                <CircleTab onViewProfile={viewProfile} />
              </ErrorBoundary>
            )}
            {activeTab === "opportunities" && (
              <ErrorBoundary>
                <OpportunitiesTab />
              </ErrorBoundary>
            )}
            {activeTab === "messages" && (
              <ErrorBoundary>
                <div style={{ height: "100vh" }}>
                  <MessagesTab />
                </div>
              </ErrorBoundary>
            )}
            {activeTab === "notifications" && (
              <ErrorBoundary>
                <NotificationsTab onTabChange={navigate} />
              </ErrorBoundary>
            )}
            {activeTab === "profile" && (
              <ErrorBoundary>
                <MyProfile
                  onViewProfile={viewProfile}
                  currentUser={user}
                  onUpdateUser={updateUser}
                />
              </ErrorBoundary>
            )}
            {activeTab === "settings" && (
              <ErrorBoundary>
                <SettingsTab currentUser={user} onUpdateUser={updateUser} />
              </ErrorBoundary>
            )}
          </>
        )}
      </div>

      {/* Bottom nav — mobile only */}
      {isMobile && (
        <BottomNav activeTab={activeTab} onTabChange={(tab) => navigate(tab)} />
      )}
    </div>
  );
}

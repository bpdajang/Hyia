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

// API
import { getToken, clearToken } from "./api/client.js";
import { register, login, getMe, getMyProfile, updateMyProfile } from "./api/auth.js";
import { showToast } from "./components/ui/toast.js";

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

// Build the app's currentUser shape from an API profile response
function buildCurrentUserFromProfile(profileData) {
  const { id, name, email, role } = profileData;
  const p = profileData.profile || {};
  const initials = getInitials(name || "User");

  if (role === "student") {
    const uniYear = [p.university, p.year].filter(Boolean).join(" ");
    const title = [p.course, uniYear].filter(Boolean).join(" · ") || "Student";
    return {
      id, name, email, initials, title, role,
      bio: p.bio || "",
      university: p.university || "",
      course: p.course || "",
      year: p.year || "",
      skills: p.skills || [],
      github: p.github || "",
      linkedin: p.linkedin || "",
      profilePicture: p.profile_picture || null,
      connections: 0,
      endorsements: 0,
    };
  }

  if (role === "alumni") {
    const title = [p.job_title, p.current_company].filter(Boolean).join(" · ") || "Alumni";
    return {
      id, name, email, initials, title, role,
      bio: p.bio || "",
      university: p.university || "",
      gradYear: p.graduation_year || "",
      jobTitle: p.job_title || "",
      company: p.current_company || "",
      linkedin: p.linkedin || "",
      github: p.github || "",
      expertise: p.expertise || [],
      offerings: p.offerings || [],
      availability: p.availability || "",
      menteeCapacity: p.mentor_capacity ?? 3,
      profilePicture: p.profile_picture || null,
      connections: 0,
      endorsements: 0,
    };
  }

  // company
  const displayName = p.company_name || name;
  return {
    id, name: displayName, email,
    initials: displayName.slice(0, 2).toUpperCase(),
    title: p.industry || "Company",
    role,
    bio: p.description || "",
    industry: p.industry || "",
    size: p.size || "",
    location: p.location || "",
    website: p.website || "",
    contactEmail: p.contact_email || "",
    followers: 0,
    connections: 0,
    endorsements: 0,
  };
}

// Build onboarding data for profile update after registration
function buildProfilePayload(merged, role) {
  if (role === "student") {
    return {
      name: merged.name,
      university: merged.university,
      course: merged.course,
      year: merged.year,
      skills: merged.skills || [],
      bio: merged.bio || "",
    };
  }
  if (role === "alumni") {
    const payload = {
      name: merged.name,
      university: merged.university,
      job_title: merged.jobTitle,
      current_company: merged.company,
      linkedin: merged.linkedin,
      expertise: merged.expertise || [],
      bio: merged.bio || "",
      availability: merged.availability,
      offerings: merged.offerings || [],
      mentor_capacity: merged.menteeCapacity ?? 3,
    };
    if (merged.gradYear) payload.graduation_year = parseInt(merged.gradYear, 10);
    return payload;
  }
  // company
  return {
    name: merged.companyName,
    company_name: merged.companyName,
    industry: merged.industry,
    size: merged.size,
    location: merged.location,
    phone: merged.phone,
    contact_email: merged.contactEmail,
    website: merged.website,
    description: merged.description,
  };
}

const APP_TABS = [
  "home", "circle", "opportunities", "messages",
  "notifications", "profile", "settings",
];

export default function App() {
  const [page, setPage] = useState("loading"); // starts as loading while we check auth
  const [activeTab, setActiveTab] = useState("home");
  const [signupRole, setSignupRole] = useState(null);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [onboardingData, setOnboardingData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const isMobile = useIsMobile();

  // On mount: restore session if token exists
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setPage("signup");
      return;
    }
    getMe()
      .then((me) => getMyProfile(me.role).then((profile) => {
        setCurrentUser(buildCurrentUserFromProfile(profile));
        setPage("home");
      }))
      .catch(() => {
        clearToken();
        setPage("signup");
      });
  }, []);

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

  async function navigate(target, data = {}) {
    const merged = { ...onboardingData, ...data };
    setOnboardingData(merged);

    if (target === "home") {
      if (merged.password) {
        // New registration: register → login → update profile → load user
        setAuthLoading(true);
        try {
          const rolePageId = signupRole?.page || "student-signup";
          const role = rolePageId.replace("-signup", "");
          const name = merged.name || merged.companyName || "User";

          await register(name, merged.email, merged.password, rolePageId);
          await login(merged.email, merged.password);

          const profilePayload = buildProfilePayload(merged, role);
          const profileData = await updateMyProfile(role, profilePayload);
          setCurrentUser(buildCurrentUserFromProfile(profileData));

          // Clear sensitive onboarding data
          setOnboardingData({});
        } catch (err) {
          showToast(err.message || "Registration failed", "error");
          setAuthLoading(false);
          return;
        }
        setAuthLoading(false);
      } else if (!currentUser) {
        // Sign-in flow: token already set by SignIn, load profile
        setAuthLoading(true);
        try {
          const me = await getMe();
          const profile = await getMyProfile(me.role);
          setCurrentUser(buildCurrentUserFromProfile(profile));
        } catch (err) {
          showToast("Could not load profile", "error");
          clearToken();
          setPage("signup");
          setAuthLoading(false);
          return;
        }
        setAuthLoading(false);
      }

      setPage("home");
      setActiveTab("home");
      setViewingProfile(null);
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (APP_TABS.includes(target)) {
      setPage("home");
      setActiveTab(target);
      setViewingProfile(null);
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

  function logout() {
    clearToken();
    setCurrentUser(null);
    setOnboardingData({});
    setSignupRole(null);
    setPage("signup");
    setActiveTab("home");
  }

  const user = currentUser || DEFAULT_USER;

  // Initial loading state while checking stored token
  if (page === "loading" || authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-base)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid var(--color-border)",
              borderTopColor: "#6C63FF",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ color: "var(--color-text-3)", fontSize: "0.9rem" }}>
            {authLoading ? "Setting up your account…" : "Loading…"}
          </p>
        </div>
        <ToastContainer />
      </div>
    );
  }

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
                  <MessagesTab currentUser={user} />
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
                <SettingsTab
                  currentUser={user}
                  onUpdateUser={updateUser}
                  onLogout={logout}
                />
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

import { apiRequest, setToken, BASE_URL } from "./client.js";

const ROLE_MAP = {
  "student-signup": "student",
  "alumni-signup": "alumni",
  "company-signup": "company",
};

export async function register(name, email, password, rolePageId) {
  const role = ROLE_MAP[rolePageId] || rolePageId;
  return apiRequest(
    "POST",
    "/auth/register",
    { name, email, password, role },
    false,
  );
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    let detail = "Incorrect email or password";
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch {}
    throw new Error(detail);
  }

  const data = await res.json();
  setToken(data.access_token);
  return data; // { access_token, token_type, role, user_id }
}

export async function getMe() {
  return apiRequest("GET", "/auth/me");
}

export async function getMyProfile(role) {
  const path =
    role === "student"
      ? "/students/me"
      : role === "alumni"
        ? "/alumni/me"
        : "/companies/me";
  return apiRequest("GET", path);
}

export async function updateMyProfile(role, data) {
  const path =
    role === "student"
      ? "/students/me"
      : role === "alumni"
        ? "/alumni/me"
        : "/companies/me";
  return apiRequest("PUT", path, data);
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export function getToken() {
  return localStorage.getItem("hyia_token");
}

export function setToken(token) {
  localStorage.setItem("hyia_token", token);
}

export function clearToken() {
  localStorage.removeItem("hyia_token");
}

export async function apiRequest(method, path, body = null, requiresAuth = true) {
  const headers = {};

  if (body !== null) {
    headers["Content-Type"] = "application/json";
  }

  if (requiresAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      detail = err.detail || detail;
    } catch {}
    throw new Error(detail);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export { BASE_URL };

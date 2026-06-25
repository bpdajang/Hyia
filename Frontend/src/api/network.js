import { apiRequest } from "./client.js";

export async function getConnections() {
  return apiRequest("GET", "/network/connections");
}

export async function getPendingRequests() {
  return apiRequest("GET", "/network/pending");
}

export async function sendConnectionRequest(userId) {
  return apiRequest("POST", `/network/connect/${userId}`);
}

export async function respondToRequest(requestId, action) {
  return apiRequest("PATCH", `/network/respond/${requestId}`, { action });
}

export async function listAlumni() {
  return apiRequest("GET", "/alumni");
}

export async function listCompanies() {
  return apiRequest("GET", "/companies");
}

export async function listStudents() {
  return apiRequest("GET", "/students");
}

export async function getMyMentorshipRequests() {
  return apiRequest("GET", "/mentorship/my-requests");
}

export async function sendMentorshipRequest(alumniId, message) {
  return apiRequest("POST", `/mentorship/request/${alumniId}`, { message });
}

export async function getIncomingMentorshipRequests() {
  return apiRequest("GET", "/mentorship/incoming");
}

export async function respondToMentorshipRequest(requestId, action) {
  return apiRequest("PATCH", `/mentorship/${requestId}/respond`, { action });
}

export async function getMyMentees() {
  return apiRequest("GET", "/mentorship/my-mentees");
}

export async function fetchUserProfile(id, role) {
  if (role === "student") return apiRequest("GET", `/students/${id}`);
  if (role === "alumni") return apiRequest("GET", `/alumni/${id}`);
  if (role === "company") return apiRequest("GET", `/companies/${id}`);
  throw new Error("Unknown role");
}

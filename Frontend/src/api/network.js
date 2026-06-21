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

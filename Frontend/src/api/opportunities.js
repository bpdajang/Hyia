import { apiRequest } from "./client.js";

export async function listOpportunities(type = null) {
  const params = type && type !== "All" ? `?type=${type.toLowerCase()}` : "";
  return apiRequest("GET", `/opportunities${params}`);
}

export async function applyToOpportunity(opportunityId, coverLetter) {
  return apiRequest("POST", `/opportunities/${opportunityId}/apply`, {
    cover_letter: coverLetter,
  });
}

export async function getMyApplications() {
  return apiRequest("GET", "/opportunities/my/applications");
}

import { apiRequest } from "./client.js";

export async function createCompanyPage(data) {
  return apiRequest("POST", "/company-pages/", {
    company_name: data.companyName,
    industry: data.industry || null,
    size: data.size || null,
    location: data.location || null,
    phone: data.phone || null,
    contact_email: data.contactEmail || null,
    website: data.website || null,
    description: data.description || null,
  });
}

export async function getMyCompanyPages() {
  return apiRequest("GET", "/company-pages/my");
}

export async function listCompanyPages() {
  return apiRequest("GET", "/company-pages/");
}

export async function getCompanyPage(pageId) {
  return apiRequest("GET", `/company-pages/${pageId}`);
}

export async function updateCompanyPage(pageId, data) {
  return apiRequest("PUT", `/company-pages/${pageId}`, data);
}

export async function deleteCompanyPage(pageId) {
  return apiRequest("DELETE", `/company-pages/${pageId}`);
}

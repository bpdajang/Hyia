import { apiRequest } from "./client.js";

export async function getInbox() {
  return apiRequest("GET", "/messages/inbox");
}

export async function getThread(userId) {
  return apiRequest("GET", `/messages/thread/${userId}`);
}

export async function sendMessage(userId, content) {
  return apiRequest("POST", `/messages/${userId}`, { content });
}

export async function getUnreadMessageCount() {
  return apiRequest("GET", "/messages/unread/count");
}

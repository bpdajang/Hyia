import { apiRequest } from "./client.js";

export async function getNotifications() {
  return apiRequest("GET", "/notifications");
}

export async function markNotificationRead(notificationId) {
  return apiRequest("PATCH", `/notifications/${notificationId}/read`);
}

// export async function markAllNotificationsRead() {
//   return apiRequest("PATCH", "/notifications/read-all");
// }

export async function deleteNotification(notificationId) {
  return apiRequest("DELETE", `/notifications/${notificationId}`);
}

export async function getUnreadNotificationCount() {
  return apiRequest("GET", "/notifications/unread/count");
}

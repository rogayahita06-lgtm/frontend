import { API_BASE } from "./config.js";
import { getAccessToken } from "./auth.js";

async function request(path, options = {}) {
  const token = await getAccessToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // 🔑 PASTIKAN TOKEN TERKIRIM
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    throw new Error(data?.message || "Request gagal");
  }

  return data;
}

export const api = {
  // ===== COURSES =====
  listCourses() {
    return request("/api/courses");
  },

  getCourse(id) {
    return request(`/api/courses/${id}`);
  },

  createCourse(payload) {
    return request("/api/courses", {
      method: "POST",
      body: payload
    });
  },

  updateCourse(id, payload) {
    return request(`/api/courses/${id}`, {
      method: "PUT",
      body: payload
    });
  },

  deleteCourse(id) {
    return request(`/api/courses/${id}`, {
      method: "DELETE"
    });
  },

  // ===== ENROLLMENT =====
  enroll(course_id) {
    return request("/api/enroll", {
      method: "POST",
      body: { course_id }
    });
  },

  myEnrollments() {
    return request("/api/my-enrollments");
  },

  adminEnrollments() {
    return request("/api/enrollments");
  },

  updateEnrollment(id, status) {
    return request(`/api/enrollments/${id}`, {
      method: "PUT",
      body: { status }
    });
  },

  // ===== CERTIFICATE =====
  certificateUrl(courseId) {
    return `${API_BASE}/api/certificates/${courseId}`;
  }
};

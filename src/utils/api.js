export const API_BASE = "http://localhost:5000/api";

export function authFetch(endpoint, options = {}) {
  const session = localStorage.getItem("shieldEyeSession");
  let token = null;

  if (session) {
    try {
      token = JSON.parse(session).token;
    } catch {}
  }

  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
}

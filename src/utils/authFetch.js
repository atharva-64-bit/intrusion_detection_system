const AUTH_KEY = "shieldEyeSession";

export default async function authFetch(url, options = {}) {
  const session = localStorage.getItem(AUTH_KEY);
  let token = null;

  if (session) {
    try {
      const parsed = JSON.parse(session);
      token = parsed.token;
    } catch (e) {
      console.error("Failed to parse session", e);
    }
  }

  if (!token) {
    throw new Error("Not authenticated");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "API error");
  }

  return res.json();
}

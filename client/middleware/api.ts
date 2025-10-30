const API_URL = process.env.EXPO_PUBLIC_API_URL;

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json().catch(() => null);
    return data as T;
  } catch (err) {
    console.error(`[API ERROR] ${endpoint}:`, err);
    throw err;
  }
}

export async function signUp(username: string, password: string) {
  return request("/auth/signUp", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ username, password }),
  });
}

export async function signIn(username: string, password: string) {
  return request("/auth/signIn", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ username, password }),
  });
}

export async function uploadImage(image: FormData) {
  return request("/user/uploadAvatar", {
    method: "POST",
    body: image,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export async function verifyUsername(username: string) {
  return request("/user/verifyUsername", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ username }),
  });
}

export async function createProfile(profile: Record<string, any>) {
  return request("/auth/createProfile", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(profile),
  });
}

export async function searchUser(userId: string, search: string) {
  return request("/user/searchUser", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ userId, search }),
  });
}

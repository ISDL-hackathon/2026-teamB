const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const BULLETIN_API_BASE_URL =
  import.meta.env.VITE_BULLETIN_API_BASE_URL || API_BASE_URL;

export async function requestJson(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "通信に失敗しました");
  }

  return data;
}

export async function requestBulletinJson(path, options) {
  const res = await fetch(`${BULLETIN_API_BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "掲示板APIとの通信に失敗しました");
  }

  return data;
}

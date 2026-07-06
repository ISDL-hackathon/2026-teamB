const API_BASE_URL = "http://127.0.0.1:8000";

export async function requestJson(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "通信に失敗しました");
  }

  return data;
}

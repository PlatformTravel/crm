const getBackendUrl = () => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const rawUrl = env?.VITE_BACKEND_URL?.trim() || "";
  const normalized = rawUrl.replace(/\/$/, "");

  if (normalized) {
    return normalized;
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return "http://localhost:8000";
};

export const BACKEND_URL = getBackendUrl();
console.log(`[CONFIG] BACKEND_URL set to: ${BACKEND_URL}`);

export const config = {
  BACKEND_URL,
};


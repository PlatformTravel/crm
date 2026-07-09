const getBackendUrl = () => {
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const rawUrl = env?.VITE_BACKEND_URL || "";
  return rawUrl.replace(/\/$/, "");
};

export const BACKEND_URL = getBackendUrl();
console.log(`[CONFIG] BACKEND_URL set to: ${BACKEND_URL}`);

export const config = {
  BACKEND_URL,
};


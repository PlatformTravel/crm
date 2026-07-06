export async function hashPassword(password: string): Promise<string> {
  const normalized = password.trim();
  if (!normalized) return '';

  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const hashHex = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  return `sha256$${hashHex}`;
}

export async function verifyPassword(inputPassword: string, storedPassword?: string): Promise<boolean> {
  const normalizedInput = inputPassword.trim();
  const normalizedStored = (storedPassword ?? '').trim();

  if (!normalizedInput || !normalizedStored) return false;

  if (normalizedStored === normalizedInput) {
    return true;
  }

  const expectedHash = await hashPassword(normalizedInput);

  if (normalizedStored.startsWith('sha256$')) {
    return normalizedStored === expectedHash;
  }

  if (/^[a-f0-9]{64}$/i.test(normalizedStored)) {
    return normalizedStored.toLowerCase() === expectedHash.replace('sha256$', '').toLowerCase();
  }

  return false;
}

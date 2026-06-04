const SESSION_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "fallback-secret-at-least-32-chars-long-for-seayou-admin";
const SESSION_DURATION = 1000 * 60 * 60 * 24; // 24 hours

const encoder = new TextEncoder();

async function getCryptoKey() {
  const keyData = encoder.encode(SESSION_SECRET);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs a session for the specified email address.
 * Returns a dot-separated string: base64(payload).base64(signature)
 */
export async function signSession(email: string): Promise<string> {
  const payload = {
    email,
    expires: Date.now() + SESSION_DURATION,
  };
  const payloadStr = JSON.stringify(payload);
  
  // Safe base64 encoding
  const payloadBase64 = btoa(unescape(encodeURIComponent(payloadStr)));

  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payloadBase64)
  );

  const signatureBase64 = btoa(
    String.fromCharCode(...new Uint8Array(signature))
  );
  return `${payloadBase64}.${signatureBase64}`;
}

/**
 * Verifies a session token.
 * Returns the email if valid, or null if invalid/expired.
 */
export async function verifySession(token: string): Promise<string | null> {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [payloadBase64, signatureBase64] = parts;
    const key = await getCryptoKey();

    // Reconstruct signature bytes from base64
    const signatureBin = atob(signatureBase64);
    const signatureBytes = new Uint8Array(signatureBin.length);
    for (let i = 0; i < signatureBin.length; i++) {
      signatureBytes[i] = signatureBin.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes,
      encoder.encode(payloadBase64)
    );

    if (!isValid) return null;

    // Safe base64 decoding
    const payloadStr = decodeURIComponent(escape(atob(payloadBase64)));
    const payload = JSON.parse(payloadStr);

    if (payload.expires < Date.now()) {
      return null;
    }

    return payload.email || null;
  } catch (e) {
    return null;
  }
}

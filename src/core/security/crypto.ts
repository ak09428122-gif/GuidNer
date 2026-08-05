/**
 * GuideNer Crypto & Security Service
 * Implements Web Crypto AES-GCM encryption for the Encrypted Vault & SHA-256 hashing for PIN/Password security.
 */

const SALT = 'GuideNer-Secure-Vault-Salt-2026';

// Derive CryptoKey from user PIN or Master Password using PBKDF2
async function deriveKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode(SALT),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * SHA-256 Hash helper for PIN/Password validation
 */
export async function hashPin(pin: string): Promise<string> {
  const enc = new TextEncoder();
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', enc.encode(pin + SALT));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * AES-GCM Payload Encryption
 */
export async function encryptVaultData(
  plainText: string,
  passcode: string
): Promise<{ encryptedPayload: string; iv: string }> {
  try {
    const key = await deriveKey(passcode);
    const enc = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      enc.encode(plainText)
    );

    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const encryptedHex = encryptedArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    const ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, '0')).join('');

    return { encryptedPayload: encryptedHex, iv: ivHex };
  } catch (err) {
    console.error('Vault Encryption Failed:', err);
    throw new Error('Encryption failed');
  }
}

/**
 * AES-GCM Payload Decryption
 */
export async function decryptVaultData(
  encryptedHex: string,
  ivHex: string,
  passcode: string
): Promise<string> {
  try {
    const key = await deriveKey(passcode);

    const matchEncrypted = encryptedHex.match(/.{1,2}/g);
    if (!matchEncrypted) throw new Error('Invalid encrypted payload');
    const encryptedArray = new Uint8Array(matchEncrypted.map((byte) => parseInt(byte, 16)));

    const matchIv = ivHex.match(/.{1,2}/g);
    if (!matchIv) throw new Error('Invalid IV');
    const ivArray = new Uint8Array(matchIv.map((byte) => parseInt(byte, 16)));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivArray },
      key,
      encryptedArray
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);
  } catch (err) {
    console.error('Vault Decryption Failed:', err);
    throw new Error('Invalid PIN or decryption error');
  }
}

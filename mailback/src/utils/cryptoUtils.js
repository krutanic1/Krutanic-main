import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

/**
 * Encrypts a string using AES-256-CBC.
 * Returns a string formatted as IV:Ciphertext.
 */
export function encrypt(text) {
  if (!text) return text;
  const KEY_HEX = (process.env.MAILBLASTER_ENCRYPTION_KEY || '').trim();
  if (!KEY_HEX || KEY_HEX.length !== 64) {
    throw new Error('Encryption key must be a 64-character hex string (32 bytes).');
  }

  const key = Buffer.from(KEY_HEX, 'hex');
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypts a string formatted as IV:Ciphertext.
 */
export function decrypt(encryptedData) {
  if (!encryptedData) return encryptedData;
  if (!encryptedData.includes(':')) {
    // Possibly legacy plain text password
    return encryptedData;
  }

  const KEY_HEX = process.env.MAILBLASTER_ENCRYPTION_KEY || '';
  if (!KEY_HEX || KEY_HEX.length !== 64) {
    throw new Error('Encryption key must be a 64-character hex string (32 bytes).');
  }

  try {
    const [ivHex, ciphertextHex] = encryptedData.split(':');
    const key = Buffer.from(KEY_HEX, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    
    let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', err.message);
    // Return the original data if decryption fails (might be plain text)
    return encryptedData;
  }
}

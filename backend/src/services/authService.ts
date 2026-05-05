import { exportJWK, importJWK, SignJWT, jwtVerify } from 'jose'

/**
 * Encodes a string into a Uint8Array
 */
const encoder = new TextEncoder()

/**
 * Hashes a password using PBKDF2 (Native Web Crypto)
 * This is a highly secure way to store passwords in Cloudflare Workers.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )

  const exportedKey = await crypto.subtle.exportKey('raw', key)
  const hash = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))
  const saltStr = btoa(String.fromCharCode(...salt))

  return `${saltStr}.${hash}`
}

/**
 * Compares a plain password with a stored hash
 */
export async function comparePassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [saltStr, originalHash] = storedHash.split('.')
    const salt = Uint8Array.from(atob(saltStr), c => c.charCodeAt(0))
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    )

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    )

    const exportedKey = await crypto.subtle.exportKey('raw', key)
    const currentHash = btoa(String.fromCharCode(...new Uint8Array(exportedKey)))

    return currentHash === originalHash
  } catch (e) {
    return false
  }
}

/**
 * Generates a JWT token for a user
 */
export async function generateToken(userId: string, secret: string): Promise<string> {
  const secretKey = encoder.encode(secret)
  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey)
}

/**
 * Verifies a JWT token
 */
export async function verifyToken(token: string, secret: string): Promise<string | null> {
  try {
    const secretKey = encoder.encode(secret)
    const { payload } = await jwtVerify(token, secretKey)
    return payload.sub as string
  } catch (e) {
    return null
  }
}

export interface DecodedToken {
  [key: string]: any;
  name?: string;
  role?: string | string[];
  username?: string;
  sub?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  iss?: string;
  aud?: string;
  jti?: string;
}

/**
 * Normalizes ASP.NET Identity claim names to simple property names
 */
function normalizeTokenClaims(rawToken: any): DecodedToken {
  const nameClaimUrl = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
  const roleClaimUrl = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  
  // Map ASP.NET Identity claim types to simple names
  const nameClaim = rawToken[nameClaimUrl];
  const roleClaim = rawToken[roleClaimUrl];
  
  // Create normalized object without the long URL-type properties
  const normalized: DecodedToken = { ...rawToken };
  
  // Remove the long URL-type properties
  delete normalized[nameClaimUrl];
  delete normalized[roleClaimUrl];
  
  if (nameClaim) {
    normalized.name = nameClaim;
    normalized.username = nameClaim;
  }
  
  if (roleClaim) {
    normalized.role = roleClaim;
  }
  
  return normalized;
}

/**
 * Decodes a JWT token without verification (signature verification should be done on backend)
 * @param token - The JWT token string
 * @returns Decoded token payload with normalized claim names or null if invalid
 */
export function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Convert base64url to base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    
    // Decode and parse JSON
    const rawDecoded = JSON.parse(atob(padded));
    
    // Normalize claim names to simple property names
    return normalizeTokenClaims(rawDecoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Extracts user information from a decoded JWT token
 * Handles both standard JWT claims and ASP.NET Identity claim types
 */
export function extractUserFromToken(token: string): {
  username: string;
  role: string;
  expiresAt?: Date;
} | null {
  const decoded = decodeJWT(token);
  if (!decoded) {
    return null;
  }

  // Token claims are now normalized to simple names
  const username = decoded.name || decoded.username || decoded.sub || '';
  const role = Array.isArray(decoded.role) 
    ? decoded.role[0] 
    : (decoded.role || '');
  
  const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : undefined;

  if (!username) {
    console.error('No username found in token');
    return null;
  }

  return {
    username,
    role: role || 'User',
    expiresAt,
  };
}

/**
 * Checks if a JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  return Date.now() >= expirationTime;
}

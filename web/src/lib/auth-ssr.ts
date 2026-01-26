// src/lib/auth-ssr.ts
import { auth } from './firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

export async function verifyToken(token: string): Promise<DecodedIdToken | null> {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  
  return tokenCookie ? tokenCookie.split('=')[1] : null;
}

export async function isAuthorized(request: Request): Promise<boolean> {
    const token = getTokenFromCookie(request.headers.get('cookie'));
    if (!token) return false;
    if (await verifyToken(token)) return true;
    return false;
}
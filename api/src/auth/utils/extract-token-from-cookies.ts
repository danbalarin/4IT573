import { Request } from 'express';
import { parseCookie } from './parse-cookie';

export function extractTokenFromCookies(request: Request): string | undefined {
  const cookies = parseCookie(request.headers.cookie ?? '');
  const authCookie = cookies['Authorization'] ?? '';
  const [type, token] = authCookie.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

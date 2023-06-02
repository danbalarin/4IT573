import { Request } from 'express';

const parseCookie = (str: string) =>
  str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});

export function extractTokenFromCookies(request: Request): string | undefined {
  const cookies = parseCookie(request.headers.cookie ?? '');
  const authCookie = cookies['Authorization'] ?? '';
  const [type, token] = authCookie.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

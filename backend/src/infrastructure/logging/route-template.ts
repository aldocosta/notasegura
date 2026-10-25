import { Request } from 'express';

export function routeTemplate(req: Request): string {
  const route = (req as unknown as { route?: { path?: string } }).route;
  const routePath = route?.path;
  if (!routePath) return 'unmatched';
  const base = (req as unknown as { baseUrl?: string }).baseUrl ?? '';
  const full = `${base}${routePath}`;
  return full.startsWith('/') ? full : `/${full}`;
}

export function routeTemplate(req: any): string {
  const routePath = req?.route?.path;
  if (!routePath) return 'unmatched';
  const base = req?.baseUrl ?? '';
  const full = `${base}${routePath}`;
  return full.startsWith('/') ? full : `/${full}`;
}

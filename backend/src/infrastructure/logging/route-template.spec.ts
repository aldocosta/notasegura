import { routeTemplate } from './route-template';
import { Request } from 'express';

describe('routeTemplate', () => {
  it('POST notes', () => {
    const req = {
      baseUrl: '/api',
      route: { path: '/notes' },
      method: 'POST',
    } as unknown as Request;
    expect(routeTemplate(req)).toBe('/api/notes');
  });
  it('GET notes by id', () => {
    const req = {
      baseUrl: '/api',
      route: { path: '/notes/:id' },
    } as unknown as Request;
    expect(routeTemplate(req)).toBe('/api/notes/:id');
  });
  it('unmatched', () => {
    const req = { baseUrl: '/api', url: '/foo' } as unknown as Request;
    expect(routeTemplate(req)).toBe('unmatched');
  });
});

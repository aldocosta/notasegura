import { routeTemplate } from './route-template';
describe('routeTemplate', () => {
  it('POST notes', () => {
    const req: any = { baseUrl: '/api', route: { path: '/notes' }, method: 'POST' };
    expect(routeTemplate(req)).toBe('/api/notes');
  });
  it('GET notes by id', () => {
    const req: any = { baseUrl: '/api', route: { path: '/notes/:id' } };
    expect(routeTemplate(req)).toBe('/api/notes/:id');
  });
  it('unmatched', () => {
    const req: any = { baseUrl: '/api', url: '/foo' };
    expect(routeTemplate(req)).toBe('unmatched');
  });
});

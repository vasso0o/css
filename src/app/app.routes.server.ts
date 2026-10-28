import { RenderMode, ServerRoute } from '@angular/ssr';
import { loadContent } from './cms.server';

export const serverRoutes: ServerRoute[] = [
  {
    path: ':slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => (await loadContent()).pages.map((p) => ({ slug: p.slug })),
  },
  { path: '**', renderMode: RenderMode.Prerender },
];

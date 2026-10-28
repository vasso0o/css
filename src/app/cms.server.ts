// Server-only (build/prerender time): loads one user's site from the CMS backend.
//   USER_ID      id of the CMS user whose site is built
//   CMS_API_URL  backend base URL (default http://localhost:4001)
// Local development reads them from .env.local; real environment variables take precedence.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { CmsContent } from './models';

const envFile = resolve(process.cwd(), '.env.local');
try {
  if (existsSync(envFile)) process.loadEnvFile(envFile);
} catch {
  // Unreadable .env.local: rely on real environment variables.
}

let cached: Promise<CmsContent> | undefined;

export function loadContent(): Promise<CmsContent> {
  return (cached ??= fetchContent());
}

async function fetchContent(): Promise<CmsContent> {
  const userId = process.env['USER_ID']?.trim();
  if (!userId) throw new Error('USER_ID is not set (add it to .env.local or the environment).');

  const base = (process.env['CMS_API_URL'] || 'http://localhost:4001').replace(/\/+$/, '');
  const root = `${base}/api/public/users/${encodeURIComponent(userId)}`;

  let res: Response;
  try {
    res = await fetch(root, { headers: { Accept: 'application/json' } });
  } catch (err) {
    throw new Error(`Could not reach the CMS at ${root}: ${(err as Error).message}`);
  }
  if (!res.ok) throw new Error(`The CMS responded ${res.status} for ${root}`);

  const bundle = await res.json();
  if (!Array.isArray(bundle.pages)) throw new Error('The CMS response has no pages array.');

  // Uploaded media is referenced relative to the CMS; make it absolute.
  const MEDIA =
    /(?:https?:\/\/[^"\\/]+)?\/api\/public\/(?:users\/[0-9a-f-]{36}\/)?media\/([0-9a-f-]{36})/gi;
  const json = JSON.stringify({
    pages: bundle.pages.filter((p: { status: string }) => p.status === 'published'),
    site: {
      branding: bundle.branding ?? null,
      menus: bundle.menus ?? { navigation: [], footer: [] },
      theme: bundle.theme ?? null,
    },
  }).replace(MEDIA, (_, id) => `${root}/media/${id}`);

  const content = JSON.parse(json) as CmsContent;
  console.log(`[cms] user ${userId}: ${content.pages.length} published page(s) from ${base}`);
  return content;
}

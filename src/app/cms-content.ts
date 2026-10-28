import { inject } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/core';
import { CmsContent } from './models';

/** Content fetched from the CMS while prerendering, embedded in each page for the browser. */
export const CMS_KEY = makeStateKey<CmsContent>('cms-content');

export function cmsContent(): CmsContent {
  const content = inject(TransferState).get(CMS_KEY, null);
  if (!content) throw new Error('CMS content is missing. It is loaded when the site is prerendered.');
  return content;
}

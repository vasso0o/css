import { Injectable } from '@angular/core';
import { cmsContent } from './cms-content';
import { Page } from './models';

@Injectable({ providedIn: 'root' })
export class PagesService {
  readonly pages: Page[] = cmsContent().pages;
  readonly homeSlug = (this.pages.find((p) => p.slug === 'home') ?? this.pages[0])?.slug;

  bySlug(slug: string | null | undefined): Page | undefined {
    return this.pages.find((p) => p.slug === (slug || this.homeSlug));
  }
}

import { Component, computed, effect, inject } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PagesService } from './pages.service';
import { SiteService } from './site.service';
import { BLOCK_REGISTRY } from './block-registry';
import { GenericBlock } from './blocks/generic';
import { Block, BlockType } from './models';

@Component({
  selector: 'app-page',
  imports: [NgComponentOutlet],
  template: `
    @if (page(); as p) {
      @for (block of p.blocks; track block.id) {
        <ng-container *ngComponentOutlet="component(block); inputs: { data: dataOf(block) }" />
      }
    } @else {
      <section class="nf"><h1>Page not found</h1></section>
    }
  `,
  styles: `.nf { padding: 6rem 1.5rem; text-align: center; }`,
})
export class PageComponent {
  private readonly pages = inject(PagesService);
  private readonly slug = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((m) => m.get('slug'))),
    { initialValue: null },
  );

  readonly page = computed(() => this.pages.bySlug(this.slug()));

  constructor() {
    const title = inject(Title);
    const meta = inject(Meta);
    const b = inject(SiteService).branding;

    effect(() => {
      const p = this.page();
      const isHome = !!p && p === this.pages.bySlug(null);
      const pageTitle = !p
        ? 'Page not found'
        : isHome && b.metaTitle
          ? b.metaTitle
          : [p.title, b.siteName].filter(Boolean).join(' | ');
      const firstText = p?.blocks
        .flatMap((x) => [x.data['subtitle'], x.data['body'], x.data['answer']])
        .find((v) => !!v?.trim());
      const description = (isHome && b.metaDescription.trim()) || firstText || b.metaDescription.trim() || b.tagline;

      title.setTitle(pageTitle);
      const tags: Record<string, string | undefined> = {
        description: description?.slice(0, 320),
        keywords: b.metaKeywords,
        'og:title': pageTitle,
        'og:description': description?.slice(0, 320),
        'og:image': b.ogImageUrl,
        'og:site_name': b.siteName,
        'og:type': 'website',
        'twitter:card': b.ogImageUrl ? 'summary_large_image' : 'summary',
      };
      for (const [name, content] of Object.entries(tags)) {
        if (!content?.trim()) continue;
        const attr = name.startsWith('og:') ? 'property' : 'name';
        meta.updateTag({ [attr]: name, content: content.trim() });
      }
    });
  }

  private readonly dataCache = new WeakMap<Block, Record<string, string>>();

  /** Prefix scheme-less domains (e.g. "example.com") typed into URL fields with https://. */
  private fixUrls<T extends Record<string, unknown>>(obj: T): T {
    const out: Record<string, unknown> = { ...obj };
    for (const [k, v] of Object.entries(out)) {
      if (/url$/i.test(k) && typeof v === 'string' && /^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(v.trim())) {
        out[k] = 'https://' + v.trim();
      }
    }
    return out as T;
  }

  dataOf(block: Block): Record<string, string> {
    let out = this.dataCache.get(block);
    if (!out) {
      out = this.fixUrls(block.data ?? {});
      let items: unknown = block.items;
      if (!out['items']?.trim() && Array.isArray(items) && items.length) {
        out['items'] = JSON.stringify(items);
      }
      if (out['items']) {
        try {
          const list = JSON.parse(out['items']);
          if (Array.isArray(list)) {
            out['items'] = JSON.stringify(list.map((i) => (i && typeof i === 'object' ? this.fixUrls(i) : i)));
          }
        } catch {
          /* leave as is */
        }
      }
      this.dataCache.set(block, out);
    }
    return out;
  }

  component(block: Block) {
    return BLOCK_REGISTRY[block.type as BlockType] ?? GenericBlock;
  }
}

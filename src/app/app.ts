import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PagesService } from './pages.service';
import { SiteService } from './site.service';
import { MenuItem } from './models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  host: { '[style]': 'site.cssVars', '[attr.data-mode]': 'site.mode' },
  template: `
    <header>
      <div class="bar">
        <a class="brand" routerLink="/">
          @if (b.logoUrl) {
            <img class="logo" [src]="b.logoUrl" [alt]="b.siteName" />
          }
          @if (b.siteName) {
            <span class="name">
              {{ b.siteName }}
              @if (b.tagline) {
                <small>{{ b.tagline }}</small>
              }
            </span>
          }
        </a>
        <nav aria-label="Main">
          @for (item of nav; track item.url + item.label) {
            @if (external(item)) {
              <a [href]="item.url">{{ item.label }}</a>
            } @else if (item.url.startsWith('#')) {
              <a [href]="item.url">{{ item.label }}</a>
            } @else {
              <a [routerLink]="item.url" routerLinkActive="active">{{ item.label }}</a>
            }
          }
        </nav>
      </div>
    </header>

    <main><router-outlet /></main>

    <footer>
      <div class="foot">
        <div class="about">
          @if (b.logoUrl) {
            <img class="logo" [src]="b.logoUrl" [alt]="b.siteName" />
          }
          <strong>{{ b.siteName }}</strong>
          @if (b.tagline) {
            <p>{{ b.tagline }}</p>
          }
          @if (b.contactEmail) {
            <a [href]="'mailto:' + b.contactEmail">{{ b.contactEmail }}</a>
          }
        </div>
        <nav aria-label="Footer">
          @for (item of site.footer; track item.url + item.label) {
            @if (external(item) || item.url.startsWith('#')) {
              <a [href]="item.url">{{ item.label }}</a>
            } @else {
              <a [routerLink]="item.url">{{ item.label }}</a>
            }
          }
        </nav>
      </div>
      <p class="copy">© {{ year }} {{ b.siteName }}</p>
    </footer>
  `,
  styles: `
    header { position: sticky; top: 0; z-index: 10; background: color-mix(in srgb, var(--c-bg) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--c-line); }
    .bar { max-width: 1120px; margin: 0 auto; padding: calc(var(--site-pad) * .6) var(--site-pad); display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
    .brand { display: flex; align-items: center; gap: .75rem; text-decoration: none; color: var(--c-fg); }
    .logo { height: 40px; width: auto; max-width: 160px; object-fit: contain; border-radius: calc(var(--site-radius) / 2); }
    .name { font-weight: 700; font-size: 1.1rem; line-height: 1.2; display: flex; flex-direction: column; }
    .name small { font-weight: 400; font-size: .75rem; color: var(--c-muted); }
    nav { display: flex; gap: .25rem; flex-wrap: wrap; }
    nav a { color: var(--c-fg); text-decoration: none; font-weight: 500; padding: .45rem .9rem; border-radius: var(--site-radius); transition: background .15s, color .15s; }
    nav a:hover { background: var(--c-surface); }
    nav a.active { color: var(--c-accent-fg); background: var(--c-accent); }
    main { min-height: 60vh; }
    footer { margin-top: 4rem; background: var(--c-surface); border-top: 1px solid var(--c-line); }
    .foot { max-width: 1120px; margin: 0 auto; padding: calc(var(--site-pad) * 2) var(--site-pad); display: flex; justify-content: space-between; gap: 2rem; flex-wrap: wrap; }
    .about { display: flex; flex-direction: column; gap: .35rem; align-items: flex-start; }
    .about p { margin: 0; color: var(--c-muted); }
    footer nav { flex-direction: column; gap: .15rem; }
    footer nav a { padding: .3rem 0; color: var(--c-muted); }
    footer nav a:hover { background: none; color: var(--c-accent); }
    .copy { margin: 0; padding: 1rem var(--site-pad); text-align: center; font-size: .85rem; color: var(--c-muted); border-top: 1px solid var(--c-line); }
  `,
})
export class App {
  protected readonly site = inject(SiteService);
  private readonly pages = inject(PagesService);
  protected readonly b = this.site.branding;
  protected readonly nav: MenuItem[] = this.buildNav();
  protected readonly year = new Date().getFullYear();

  private buildNav(): MenuItem[] {
    const norm = (u: string) => u.replace(/^\/+|\/+$/g, '');
    const items = [...this.site.navigation];
    for (const p of this.pages.pages) {
      if (!items.some((i) => norm(i.url) === p.slug)) {
        items.push({ label: p.title, url: `/${p.slug}` });
      }
    }
    return items;
  }

  constructor() {
    if (this.b.faviconUrl) {
      const doc = inject(DOCUMENT);
      const link = doc.createElement('link');
      link.rel = 'icon';
      link.href = this.b.faviconUrl;
      doc.head.appendChild(link);
    }
  }

  protected external(item: MenuItem) {
    return /^(https?:)?\/\//i.test(item.url);
  }
}

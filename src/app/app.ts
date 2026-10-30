import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PagesService } from './pages.service';
import { SiteService } from './site.service';
import { MenuItem } from './models';

const PLATFORM_LABELS: Record<string, string> = {
  facebook: 'Facebook', instagram: 'Instagram', x: 'X', linkedin: 'LinkedIn', youtube: 'YouTube', tiktok: 'TikTok',
  github: 'GitHub', pinterest: 'Pinterest', whatsapp: 'WhatsApp', telegram: 'Telegram', email: 'Email', website: 'Website',
};

// Stroke icons (24x24 viewBox) keyed by social platform, plus phone and pin for contact details.
const ICONS: Record<string, string> = {
  facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  instagram: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01',
  x: 'M4 4l16 16M20 4L4 20',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  youtube: 'M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27z',
  tiktok: 'M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  pinterest: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',
  whatsapp: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  telegram: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  email: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
  website: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  host: { '[style]': 'site.cssVars', '[attr.data-mode]': 'site.mode' },
  template: `
    <header>
      <div class="bar">
        <a class="brand" routerLink="/">
          @if (b.logoUrl) {
            <img class="logo" [src]="b.logoUrl" [alt]="b.siteName" [style.height.px]="logoSize" />
          } @else if (b.siteName) {
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

    <footer [attr.data-layout]="f.layout">
      <div class="foot">
        <div class="about">
          @if (b.logoUrl && f.showLogo) {
            <img class="logo" [src]="b.logoUrl" [alt]="b.siteName"             [style.height.px]="logoSize" />
          }
                      @if (b.siteName) {
                        <strong class="fname">{{ b.siteName }}</strong>
                      }
          @if (f.description || b.tagline) {
            <p class="blurb">{{ f.description || b.tagline }}</p>
          }
          @if ((f.showEmail && b.contactEmail) || f.phone || f.address) {
            <ul class="contact">
              @if (f.showEmail && b.contactEmail) {
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="icons['email']" /></svg>
                  <a [href]="'mailto:' + b.contactEmail">{{ b.contactEmail }}</a>
                </li>
              }
              @if (f.phone) {
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="icons['phone']" /></svg>
                  <a [href]="'tel:' + f.phone.replace(' ', '')">{{ f.phone }}</a>
                </li>
              }
              @if (f.address) {
                <li>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="icons['pin']" /></svg>
                  <span>{{ f.address }}</span>
                </li>
              }
            </ul>
          }
          @if (social.length) {
            <ul class="social" aria-label="Social media">
              @for (s of social; track $index) {
                <li>
                  <a [href]="s.url" [attr.aria-label]="s.label" [title]="s.label" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path [attr.d]="icons[s.platform] ?? icons['website']" /></svg>
                  </a>
                </li>
              }
            </ul>
          }
        </div>
        @if (site.footer.length) {
          <nav class="links" aria-label="Footer">
            <h3>Explore</h3>
            <ul>
              @for (item of site.footer; track item.url + item.label) {
                <li>
                  @if (external(item) || item.url.startsWith('#')) {
                    <a [href]="item.url">{{ item.label }}</a>
                  } @else {
                    <a [routerLink]="item.url">{{ item.label }}</a>
                  }
                </li>
              }
            </ul>
          </nav>
        }
      </div>
      <div class="bottom">
        <p class="copy">{{ f.copyright || '© ' + year + ' ' + b.siteName }}</p>
        @if (f.backToTop) {
          <button type="button" class="top" (click)="toTop()" aria-label="Back to top">
            <span>Back to top</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </button>
        }
      </div>
    </footer>
  `,
  styles: `
    header { position: sticky; top: 0; z-index: 40; background: color-mix(in srgb, var(--c-bg) 88%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--c-line); }
    .bar { max-width: 1120px; margin: 0 auto; padding: calc(var(--site-pad) * .6) var(--site-pad); display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
    .brand { display: flex; align-items: center; gap: .75rem; text-decoration: none; color: var(--c-fg); }
    .logo { width: auto; max-width: min(60vw, 600px); object-fit: contain; border-radius: calc(var(--site-radius) / 2); }
    .name { font-weight: 700; font-size: 1.1rem; line-height: 1.2; display: flex; flex-direction: column; }
    .name small { font-weight: 400; font-size: .75rem; color: var(--c-muted); }
    nav { display: flex; gap: .25rem; flex-wrap: wrap; }
    nav a { color: var(--c-fg); text-decoration: none; font-weight: 500; padding: .45rem .9rem; border-radius: var(--site-radius); transition: background .15s, color .15s; }
    nav a:hover { background: var(--c-surface); }
    nav a.active { color: var(--c-accent-fg); background: var(--c-accent); }
    main { min-height: 60vh; }

    footer { position: relative; margin-top: 5rem; overflow: hidden; color: var(--c-fg);
      background:
        radial-gradient(60rem 22rem at 100% 0%, color-mix(in srgb, var(--c-accent) 14%, transparent), transparent 70%),
        radial-gradient(40rem 18rem at 0% 100%, color-mix(in srgb, var(--c-secondary) 12%, transparent), transparent 70%),
        var(--c-surface); }
    footer::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 4px; background: linear-gradient(90deg, var(--c-accent), var(--c-secondary)); }
    .foot { max-width: 1120px; margin: 0 auto; padding: calc(var(--site-pad) * 2.5) var(--site-pad) calc(var(--site-pad) * 1.5);
      display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr); gap: clamp(2rem, 6vw, 5rem); }
    .about { display: flex; flex-direction: column; gap: .9rem; align-items: flex-start; }
    .fname { font-size: 1.35rem; letter-spacing: -.01em; }
    .blurb { margin: 0; max-width: 46ch; color: var(--c-muted); line-height: 1.7; }
    .contact, .social, .links ul { list-style: none; margin: 0; padding: 0; }
    .contact { display: grid; gap: .55rem; color: var(--c-muted); }
    .contact li { display: flex; align-items: flex-start; gap: .7rem; }
    .contact svg { flex: none; width: 1.1rem; height: 1.1rem; margin-top: .2rem; color: var(--c-accent); }
    .contact a { color: inherit; text-decoration: none; }
    .contact a:hover { color: var(--c-accent); }
    svg { fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

    .social { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .4rem; }
    .social a { display: grid; place-items: center; width: 2.6rem; height: 2.6rem; border-radius: 50%; color: var(--c-fg); text-decoration: none;
      background: color-mix(in srgb, var(--c-fg) 7%, transparent); border: 1px solid var(--c-line); transition: transform .25s, background .25s, color .25s, box-shadow .25s; }
    .social svg { width: 1.2rem; height: 1.2rem; }
    .social a:hover, .social a:focus-visible { transform: translateY(-4px); background: var(--c-accent); color: var(--c-accent-fg); border-color: transparent;
      box-shadow: 0 12px 22px -10px color-mix(in srgb, var(--c-accent) 70%, transparent); outline: none; }

    .links { display: block; }
    .links h3 { margin: 0 0 1rem; font-size: .75rem; text-transform: uppercase; letter-spacing: .16em; color: var(--c-muted); }
    .links ul { columns: 2 9rem; column-gap: 2rem; }
    .links li { break-inside: avoid; }
    .links a { position: relative; display: inline-block; padding: .35rem 0; color: var(--c-fg); text-decoration: none; font-weight: 500; transition: color .2s, transform .2s; }
    .links a::after { content: ''; position: absolute; left: 0; right: 0; bottom: .15rem; height: 2px; border-radius: 2px; background: var(--c-accent); transform: scaleX(0); transform-origin: left; transition: transform .25s; }
    .links a:hover { color: var(--c-accent); transform: translateX(3px); background: none; }
    .links a:hover::after { transform: scaleX(1); }

    .bottom { max-width: 1120px; margin: 0 auto; padding: 1.1rem var(--site-pad) 1.6rem; border-top: 1px solid var(--c-line);
      display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .copy { margin: 0; font-size: .85rem; color: var(--c-muted); }
    .top { all: unset; box-sizing: border-box; cursor: pointer; display: inline-flex; align-items: center; gap: .5rem; padding: .5rem 1rem; border-radius: 999px;
      font-size: .85rem; font-weight: 600; color: var(--c-fg); border: 1px solid var(--c-line); transition: background .2s, color .2s, transform .2s; }
    .top svg { width: 1rem; height: 1rem; transition: transform .2s; }
    .top:hover { background: var(--c-accent); color: var(--c-accent-fg); border-color: transparent; }
    .top:hover svg { transform: translateY(-3px); }
    .top:focus-visible { outline: 2px solid var(--c-accent); outline-offset: 3px; }

    footer[data-layout='centered'] .foot { grid-template-columns: minmax(0, 1fr); text-align: center; justify-items: center; }
    footer[data-layout='centered'] .about { align-items: center; }
    footer[data-layout='centered'] .contact li { justify-content: center; }
    footer[data-layout='centered'] .social { justify-content: center; }
    footer[data-layout='centered'] .links ul { columns: auto; display: flex; flex-wrap: wrap; justify-content: center; gap: .25rem 1.6rem; }
    footer[data-layout='centered'] .bottom { justify-content: center; }
    @media (max-width: 760px) {
      .foot { grid-template-columns: minmax(0, 1fr); }
      .bottom { justify-content: center; text-align: center; }
    }
    @media (prefers-reduced-motion: reduce) { .social a, .links a, .top, .top svg, .links a::after { transition: none; } }
  `,
})
export class App {
  protected readonly site = inject(SiteService);
  private readonly pages = inject(PagesService);
  private readonly doc = inject(DOCUMENT);
  protected readonly b = this.site.branding;
  protected readonly logoSize = Math.min(300, Math.max(16, Number(this.b.logoSize) || 40));
  protected readonly f = this.site.footerOptions;
  protected readonly nav: MenuItem[] = this.buildNav();
  protected readonly year = new Date().getFullYear();
  protected readonly icons = ICONS;
  protected readonly social = this.f.social
    .map((s) => ({ ...s, url: /^[^\s@:/]+@[^\s@:/]+$/.test(s.url) ? 'mailto:' + s.url : s.url }))
    .filter((s) => /^(https?:\/\/|mailto:|tel:)/i.test(s.url))
    .map((s) => ({ ...s, label: PLATFORM_LABELS[s.platform] ?? s.platform }));

  protected toTop() {
    this.doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
    this.doc.documentElement.style.fontSize = `${this.site.baseSize}px`;
    if (this.site.fontsUrl) {
      const fonts = this.doc.createElement('link');
      fonts.rel = 'stylesheet';
      fonts.href = this.site.fontsUrl;
      this.doc.head.appendChild(fonts);
    }
    if (this.b.faviconUrl) {
      const link = this.doc.createElement('link');
      link.rel = 'icon';
      link.href = this.b.faviconUrl;
      this.doc.head.appendChild(link);
    }
  }

  protected external(item: MenuItem) {
    return /^(https?:)?\/\//i.test(item.url);
  }
}

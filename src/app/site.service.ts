import { Injectable } from '@angular/core';
import { cmsContent } from './cms-content';
import { Branding, Footer, Palette, Theme } from './models';

const DEFAULT_FOOTER: Footer = {
  layout: 'columns', description: '', phone: '', address: '', social: [], copyright: '',
  showLogo: true, showEmail: true, backToTop: true,
};

const DEFAULT_THEME: Theme = {
  defaultMode: 'auto',
  light: { primary: '#5b4bff', secondary: '#ff7a59', background: '#ffffff', surface: '#f6f5fb', text: '#1b1a2e' },
  dark: { primary: '#8b7fff', secondary: '#ff9a7e', background: '#12111d', surface: '#1d1c2c', text: '#ecebf7' },
  cornerRadius: 8,
  padding: 24,
};

const EMPTY_BRANDING: Branding = {
  siteName: '', tagline: '', logoUrl: '', faviconUrl: '', contactEmail: '',
  metaTitle: '', metaDescription: '', metaKeywords: '', ogImageUrl: '', domain: '',
};

function luminance(hex: string): number {
  const n = parseInt(hex.replace('#', ''), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const onColor = (hex: string) => (luminance(hex) > 0.4 ? '#111111' : '#ffffff');

function palette(prefix: 'l' | 'd', p: Palette): Record<string, string> {
  return {
    [`--${prefix}-primary`]: p.primary,
    [`--${prefix}-primary-fg`]: onColor(p.primary),
    [`--${prefix}-secondary`]: p.secondary,
    [`--${prefix}-bg`]: p.background,
    [`--${prefix}-surface`]: p.surface,
    [`--${prefix}-text`]: p.text,
  };
}

const FONT_NAME = /^[A-Za-z][A-Za-z0-9 ]{0,39}$/;

/** Returns a CSS font stack for a font name from the CMS; "system" or anything unexpected falls back to the system stack. */
function fontStack(name: string | undefined, fallback: string): string {
  return name && name !== 'system' && FONT_NAME.test(name) ? `'${name}', ${fallback}` : fallback;
}

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly site = cmsContent().site;
  readonly branding = this.site.branding ?? EMPTY_BRANDING;
  readonly navigation = this.site.menus?.navigation ?? [];
  readonly footer = this.site.menus?.footer ?? [];
  readonly theme = this.site.theme ?? DEFAULT_THEME;
  readonly footerOptions: Footer = { ...DEFAULT_FOOTER, ...(this.site.footer ?? {}) };
  readonly mode = this.theme.defaultMode;

  readonly baseSize = Math.min(24, Math.max(12, Number(this.theme.baseSize) || 16));

  /** Google Fonts stylesheet for the chosen heading and body fonts, or '' when both use the system font. */
  readonly fontsUrl: string = (() => {
    const names = [...new Set([this.theme.headingFont, this.theme.bodyFont])].filter(
      (n): n is string => !!n && n !== 'system' && FONT_NAME.test(n),
    );
    if (!names.length) return '';
    const families = names.map((n) => `family=${n.replace(/ /g, '+')}:wght@400;500;600;700;800;900`);
    return `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;
  })();

  /** Palettes, radius, padding and typography as CSS custom properties; styles.css picks the active palette. */
  readonly cssVars: Record<string, string> = {
    ...palette('l', this.theme.light),
    ...palette('d', this.theme.dark),
    '--site-radius': `${this.theme.cornerRadius}px`,
    '--site-pad': `${this.theme.padding}px`,
    '--font-body': fontStack(this.theme.bodyFont, "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"),
    '--font-heading': fontStack(this.theme.headingFont, "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"),
    '--heading-weight': `${Math.min(900, Math.max(300, Number(this.theme.headingWeight) || 700))}`,
  };
}

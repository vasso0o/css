import { Directive, computed, input } from '@angular/core';

export type BlockData = Record<string, string | undefined>;

const COLOR =
  /^(#[0-9a-f]{3,8}|[a-z]{3,20}|(rgb|hsl)a?\([\d\s.,%/a-z]+\)|var\(--[\w-]+\))$/i;
const LENGTH = /^-?\d+(\.\d+)?(px|rem|em|%|vw|vh)?$/i;
const SCALE: Record<string, string> = {
  none: '0',
  xs: '.25rem',
  sm: '.75rem',
  md: '1.5rem',
  lg: '3rem',
  xl: '5rem',
  '2xl': '8rem',
  full: '9999px',
};

function pick(data: BlockData, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = data[k]?.toString().trim();
    if (v) return v;
  }
  return undefined;
}

export function color(v?: string): string | undefined {
  return v && COLOR.test(v) ? v : undefined;
}

// Accepts "24", "24px", "2rem", "lg", or a space-separated list such as "16px 24".
export function length(v?: string): string | undefined {
  if (!v) return undefined;
  const parts = v.split(/\s+/);
  if (parts.length > 4) return undefined;
  const out: string[] = [];
  for (const p of parts) {
    const key = p.toLowerCase();
    if (SCALE[key] !== undefined) out.push(SCALE[key]);
    else if (LENGTH.test(p)) out.push(/^-?[\d.]+$/.test(p) ? `${p}px` : p);
    else return undefined;
  }
  return out.join(' ');
}

/** Maps the optional style fields sent by the CMS to CSS custom properties. */
export function styleVars(data: BlockData): Record<string, string> {
  const vars: Record<string, string> = {};
  const set = (name: string, value: string | undefined) => {
    if (value) vars[name] = value;
  };

  set('--bg', color(pick(data, ['backgroundColor', 'bgColor', 'background', 'bg'])));
  set('--fg', color(pick(data, ['textColor', 'color', 'fg'])));
  set('--muted', color(pick(data, ['mutedColor', 'subtitleColor', 'bodyColor'])));
  set('--accent', color(pick(data, ['accentColor', 'buttonColor', 'buttonBg', 'primaryColor'])));
  set('--accent-fg', color(pick(data, ['buttonTextColor', 'buttonFg', 'accentTextColor'])));
  set('--border', color(pick(data, ['borderColor'])));

  set('--pad', length(pick(data, ['padding', 'blockPadding'])));
  set('--pad-y', length(pick(data, ['paddingY', 'paddingVertical'])));
  set('--pad-x', length(pick(data, ['paddingX', 'paddingHorizontal'])));
  set('--radius', length(pick(data, ['borderRadius', 'radius', 'rounded', 'cornerRadius'])));
  set('--img-radius', length(pick(data, ['imageRadius', 'imageBorderRadius'])));
  set('--btn-radius', length(pick(data, ['buttonRadius', 'buttonBorderRadius'])));
  set('--max', length(pick(data, ['maxWidth', 'width', 'contentWidth'])));
  set('--gap', length(pick(data, ['gap', 'spacing'])));
  set('--margin-y', length(pick(data, ['marginY', 'margin'])));

  const opacity = Number(pick(data, ['opacity', 'blockOpacity']));
  if (Number.isFinite(opacity) && pick(data, ['opacity', 'blockOpacity'])) {
    vars['--block-opacity'] = String(Math.min(1, Math.max(0, opacity > 1 ? opacity / 100 : opacity)));
  }

  const align = pick(data, ['align', 'textAlign', 'alignment'])?.toLowerCase();
  if (align === 'left' || align === 'start') vars['--align'] = 'left';
  else if (align === 'right' || align === 'end') vars['--align'] = 'right';
  else if (align === 'center' || align === 'centre') vars['--align'] = 'center';

  return vars;
}

export function isSafeUrl(url?: string): boolean {
  return !!url && /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(url.trim());
}

export function isExternal(url?: string): boolean {
  return !!url && /^(https?:)?\/\/|^mailto:|^tel:/i.test(url.trim());
}

export type BlockItem = Record<string, string>;

const SCHEMA_COLORS: Record<string, string> = {
  '--primary': 'var(--c-accent)',
  '--secondary': 'var(--c-secondary)',
  '--background': 'var(--c-bg)',
  '--surface': 'var(--c-surface)',
  '--text': 'var(--c-fg)',
};

/** Maps a color-schema token (e.g. "--primary") or hex color from the CMS to a CSS color; undefined when empty or invalid. */
export function schemaColor(v?: string): string | undefined {
  const value = v?.trim();
  if (!value) return undefined;
  return SCHEMA_COLORS[value] ?? (/^#[0-9a-f]{3,8}$/i.test(value) ? value : undefined);
}

/** Repeatable entries (slides, tiles, images, questions) arrive as a JSON array inside `items`. */
export function parseItems(raw?: string): BlockItem[] {
  if (!raw) return [];
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter((x) => x && typeof x === 'object')
      .map((x) =>
        Object.fromEntries(Object.entries(x).map(([k, v]) => [k, v == null ? '' : String(v)])),
      );
  } catch {
    return [];
  }
}

@Directive({
  host: {
    'data-block': '',
    '[style]': 'vars()',
    '[attr.data-align]': 'align()',
  },
})
export abstract class BlockBase {
  readonly data = input.required<BlockData>();
  protected readonly vars = computed(() => styleVars(this.data()));
  protected readonly align = computed(() => this.vars()['--align'] ?? null);
  protected readonly items = computed(() => parseItems(this.data()['items']));

  protected text(...keys: string[]): string {
    return pick(this.data(), keys) ?? '';
  }

  /** Numeric field clamped to [min, max]; falls back when missing or not a number. */
  protected num(key: string, fallback: number, min: number, max: number): number {
    const raw = this.data()[key];
    const n = raw === undefined || raw.trim() === '' ? NaN : Number(raw);
    return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
  }
}

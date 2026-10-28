import { Component } from '@angular/core';
import { BlockBase } from './block-style';

const SKIP = /color|padding|radius|margin|align|width|gap|^bg$|background|^id$/i;

/** Fallback for block types without a dedicated component: renders every text field it receives. */
@Component({
  selector: 'block-generic',
  template: `
    <section class="wrap">
      @for (f of fields(); track f.key) {
        @if (f.isUrl) {
          <p><a [href]="f.value">{{ f.value }}</a></p>
        } @else {
          <p [class.lead]="$first">{{ f.value }}</p>
        }
      }
    </section>
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); color: var(--fg, var(--c-fg)); text-align: var(--align, left); }
    .wrap { max-width: var(--max, 960px); margin: 0 auto; padding: var(--pad, var(--pad-y, calc(var(--site-pad) * 1.5)) var(--pad-x, var(--site-pad))); }
    p { margin: 0 0 .75rem; color: var(--muted, var(--c-muted)); white-space: pre-line; }
    .lead { font-size: 1.5rem; font-weight: 700; color: var(--fg, var(--c-fg)); }
  `,
})
export class GenericBlock extends BlockBase {
  fields() {
    return Object.entries(this.data())
      .filter(([key, value]) => !!value?.trim() && !SKIP.test(key))
      .map(([key, value]) => ({
        key,
        value: value as string,
        isUrl: /^https?:\/\//i.test(value as string),
      }));
  }
}

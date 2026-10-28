import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlockBase, isExternal, isSafeUrl } from './block-style';

@Component({
  selector: 'block-button',
  imports: [RouterLink],
  template: `
    <div class="wrap">
      @if (external()) {
        <a class="btn" [href]="url()">{{ text('label', 'text') }}</a>
      } @else {
        <a class="btn" [routerLink]="url() || '/'">{{ text('label', 'text') }}</a>
      }
    </div>
  `,
  styles: `
    :host { display: block; background: var(--bg, transparent); text-align: var(--align, center); }
    .wrap { max-width: var(--max, 960px); margin: 0 auto; padding: var(--pad, var(--pad-y, var(--site-pad)) var(--pad-x, var(--site-pad))); }
    .btn { display: inline-block; padding: .85rem 1.75rem; border-radius: var(--btn-radius, var(--radius, var(--site-radius))); background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); text-decoration: none; font-weight: 600; transition: transform .15s, filter .15s; }
    .btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
  `,
})
export class ButtonBlock extends BlockBase {
  url() {
    const u = this.text('url', 'href');
    return isSafeUrl(u) ? u : '';
  }
  external() {
    return isExternal(this.url());
  }
}

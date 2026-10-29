import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlockBase, isExternal, isSafeUrl } from './block-style';

const JUSTIFY: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  between: 'space-between',
};

/** A row of buttons that wraps; `justify` is start, center or between. */
@Component({
  selector: 'block-button-group',
  imports: [RouterLink],
  template: `
    <div class="group" [style.justify-content]="justify()">
      @for (b of buttons(); track $index) {
        @if (b.external) {
          <a class="btn" [href]="b.url">{{ b.label }}</a>
        } @else {
          <a class="btn" [routerLink]="b.url || '/'">{{ b.label }}</a>
        }
      }
    </div>
  `,
  styles: `
    :host { display: block; width: 100%; background: var(--bg, transparent); }
    .group { display: flex; flex-direction: row; flex-wrap: wrap; gap: var(--gap, 1rem); width: 100%; box-sizing: border-box; padding: var(--pad, var(--pad-y, var(--site-pad)) var(--pad-x, var(--site-pad))); }
    .btn { display: inline-block; padding: .85rem 1.75rem; border-radius: var(--btn-radius, var(--radius, var(--site-radius))); background: var(--accent, var(--c-accent)); color: var(--accent-fg, var(--c-accent-fg)); text-decoration: none; font-weight: 600; transition: transform .15s, filter .15s; }
    .btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
  `,
})
export class ButtonGroupBlock extends BlockBase {
  justify() {
    return JUSTIFY[this.text('justify')] ?? JUSTIFY['start'];
  }
  buttons() {
    return this.items()
      .filter((item) => item['label'])
      .map((item) => {
        const url = isSafeUrl(item['url']) ? item['url'] : '';
        return { label: item['label'], url, external: isExternal(url) };
      });
  }
}
